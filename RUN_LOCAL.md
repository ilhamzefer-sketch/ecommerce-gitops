# Local Runbook

Use this after turning on the server PC to run the e-commerce platform in Docker Desktop Kubernetes and watch it from Argo CD.

## One Command

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
$env:GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
$env:JWT_SECRET_KEY="YOUR_BASE64_ENCODED_256_BIT_SECRET"
.\scripts\start-docker-desktop.ps1
```

When it finishes, open:

```text
Argo CD: https://PC-IP:8082
Gateway: http://PC-IP:8080
Swagger: http://PC-IP:8080/swagger-ui/index.html
```

Argo username is `admin`. The script prints the current Argo password.

## GitHub Credentials

Because both GitOps and GHCR images can be private, create a GitHub token with:

- `repo` access for `ecommerce-gitops`
- `read:packages` for pulling GHCR images

Each microservice GitHub Actions workflow needs a repository secret named `GITOPS_TOKEN` with write access to `ecommerce-gitops`.

The frontend must call only the gateway:

```text
http://PC-IP:8080/api/...
```

The auth service is internal and is reached by the gateway through:

```text
http://ecommerce-auth-service:8081
```

## Manual Checks

```powershell
kubectl -n argocd get applications -o wide
kubectl get pods
kubectl get svc
```

## Older Minikube Script

The repo still contains `scripts/start-local.sh` and `scripts/start-local.ps1` for the older minikube flow. Prefer `scripts/start-docker-desktop.ps1` for the PC-as-server setup.

