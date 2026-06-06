#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AUTH_DIR="${AUTH_DIR:-/home/ilham/Desktop/ecommerce-auth}"
IMAGE_NAME="${IMAGE_NAME:-ecommerce-auth-ecommerce-auth:latest}"
ARGO_PORT="${ARGO_PORT:-8082}"
APP_PORT="${APP_PORT:-8081}"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing command: $1"
    exit 1
  fi
}

wait_for_argocd() {
  echo "Waiting for Argo CD pods..."
  kubectl -n argocd wait --for=condition=Ready pod \
    -l app.kubernetes.io/part-of=argocd \
    --timeout=300s
}

wait_for_deployment() {
  local deployment="$1"
  local timeout_seconds="${2:-180}"
  local waited=0

  until kubectl get deployment "$deployment" >/dev/null 2>&1; do
    if [ "$waited" -ge "$timeout_seconds" ]; then
      echo "Deployment did not appear in time: $deployment"
      exit 1
    fi
    sleep 5
    waited=$((waited + 5))
  done
}

start_port_forward() {
  local name="$1"
  local namespace="$2"
  local service="$3"
  local mapping="$4"
  local logfile="/tmp/${name}-port-forward.log"

  pkill -f "kubectl -n ${namespace} port-forward ${service} ${mapping}" >/dev/null 2>&1 || true
  setsid kubectl -n "$namespace" port-forward "$service" "$mapping" >"$logfile" 2>&1 < /dev/null &
  sleep 1
  if ! pgrep -f "kubectl -n ${namespace} port-forward ${service} ${mapping}" >/dev/null; then
    echo "Port-forward failed for ${service}. Log:"
    cat "$logfile" || true
    exit 1
  fi
}

need_cmd docker
need_cmd kubectl
need_cmd minikube

if [ ! -d "$AUTH_DIR" ]; then
  echo "Auth repo not found: $AUTH_DIR"
  exit 1
fi

echo "Starting minikube..."
minikube start --driver=docker
kubectl config use-context minikube >/dev/null

echo "Building auth image inside minikube Docker..."
eval "$(minikube docker-env)"
docker build -t "$IMAGE_NAME" "$AUTH_DIR"

echo "Installing/checking Argo CD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
wait_for_argocd

if ! kubectl -n argocd get secret ecommerce-gitops-repo >/dev/null 2>&1; then
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    echo "Adding private GitHub repo credentials to Argo CD..."
    kubectl -n argocd create secret generic ecommerce-gitops-repo \
      --from-literal=type=git \
      --from-literal=url=https://github.com/ilhamzefer-sketch/ecommerce-gitops.git \
      --from-literal=username=ilhamzefer-sketch \
      --from-literal=password="$GITHUB_TOKEN" \
      --dry-run=client -o yaml | kubectl apply -f -
    kubectl -n argocd label secret ecommerce-gitops-repo \
      argocd.argoproj.io/secret-type=repository --overwrite
  else
    echo "Repo secret missing. If GitHub repo is private, run with: GITHUB_TOKEN=... ./scripts/start-local.sh"
  fi
fi

echo "Applying Argo application..."
kubectl apply -f "$ROOT_DIR/bootstrap/ecommerce-auth-app.yaml"
kubectl -n argocd annotate application ecommerce-auth argocd.argoproj.io/refresh=hard --overwrite >/dev/null 2>&1 || true

echo "Waiting for workloads..."
wait_for_deployment postgres-db 180
wait_for_deployment ecommerce-auth-app 180
kubectl rollout status deployment/postgres-db --timeout=180s
kubectl rollout restart deployment/ecommerce-auth-app
kubectl rollout status deployment/ecommerce-auth-app --timeout=180s

echo "Starting port-forwards..."
start_port_forward "argocd" "argocd" "svc/argocd-server" "${ARGO_PORT}:443"
start_port_forward "ecommerce-auth" "default" "svc/ecommerce-auth-service" "${APP_PORT}:8081"

ARGO_PASSWORD="$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' 2>/dev/null | base64 -d || true)"

echo
echo "Ready."
echo "Argo CD:  https://localhost:${ARGO_PORT}"
echo "Argo user: admin"
if [ -n "$ARGO_PASSWORD" ]; then
  echo "Argo pass: ${ARGO_PASSWORD}"
fi
echo "Swagger:  http://localhost:${APP_PORT}/swagger-ui.html"
echo
kubectl -n argocd get application ecommerce-auth -o wide || true
kubectl get pods
