# Local Runbook

Use this after turning on the notebook to run the auth app in minikube and watch it from Argo CD.

## One Command

```bash
cd /home/ilham/Desktop/ecommerce-gitops
./scripts/start-local.sh
```

When it finishes, open:

```text
Argo CD: https://localhost:8081
Swagger: http://localhost:8080/swagger-ui.html
```

Argo username is `admin`. The script prints the current Argo password.

## If GitHub Repo Auth Is Missing

If Argo says `Repository not found` or `authentication required`, run the script with a GitHub token:

```bash
cd /home/ilham/Desktop/ecommerce-gitops
GITHUB_TOKEN=YOUR_TOKEN ./scripts/start-local.sh
```

## Manual Commands

```bash
minikube start --driver=docker
kubectl config use-context minikube

eval $(minikube docker-env)
docker build -t ecommerce-auth-ecommerce-auth:latest /home/ilham/Desktop/ecommerce-auth

kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd wait --for=condition=Ready pod -l app.kubernetes.io/part-of=argocd --timeout=300s

kubectl apply -f /home/ilham/Desktop/ecommerce-gitops/bootstrap/ecommerce-auth-app.yaml
kubectl rollout restart deployment/ecommerce-auth-app
kubectl rollout status deployment/ecommerce-auth-app --timeout=180s

kubectl -n argocd port-forward svc/argocd-server 8081:443
kubectl port-forward svc/ecommerce-auth-service 8080:8080
```

## Useful Checks

```bash
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
kubectl get svc
```

