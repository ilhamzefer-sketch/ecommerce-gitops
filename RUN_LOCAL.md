# Local Runbook

Use this after turning on the server PC to run the auth app in Docker Desktop Kubernetes and watch it from Argo CD.

## One Command

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
$env:GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
.\scripts\start-docker-desktop.ps1
```

When it finishes, open:

```text
Argo CD: https://PC-IP:8082
Swagger: http://PC-IP:8080/swagger-ui.html
```

Argo username is `admin`. The script prints the current Argo password.

## GitHub Credentials

Because both GitOps and GHCR images can be private, create a GitHub token with:

- `repo` access for `ecommerce-gitops`
- `read:packages` for pulling GHCR images

The `ecommerce-auth` GitHub Actions workflow also needs a repository secret named `GITOPS_TOKEN` with write access to `ecommerce-gitops`.

## Manual Checks

```powershell
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
kubectl get svc
```

## Older Minikube Script

The repo still contains `scripts/start-local.sh` and `scripts/start-local.ps1` for the older minikube flow. Prefer `scripts/start-docker-desktop.ps1` for the PC-as-server setup.

