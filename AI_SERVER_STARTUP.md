# AI Server Startup Runbook

Bu fayl server PC acilanda AI agentin oxumasi ucundur. Meqsed: Docker Desktop Kubernetes + Argo CD ile `ecommerce-auth` servisinin GitOps uzerinden islediyini yoxlamaq ve lazim olsa start etmek.

## Role

Bu masin server PC-dir.

Notebook developer masinidir ve adeten burada kod deyisiklikleri edilmir. Server PC-de esas is:

```text
1. Docker Desktop Kubernetes-i isletmek
2. Argo CD-ni isletmek
3. ecommerce-gitops repo-nu sync etmek
4. ecommerce-auth app-inin veziyyetini izlemek
```

## Important Paths

```text
GitOps repo:
C:\Users\Dell\Desktop\ecommerce-gitops

Startup script:
C:\Users\Dell\Desktop\ecommerce-gitops\scripts\start-docker-desktop.ps1

Argo CD Application manifest:
C:\Users\Dell\Desktop\ecommerce-gitops\bootstrap\ecommerce-auth-app.yaml

Kubernetes app manifests:
C:\Users\Dell\Desktop\ecommerce-gitops\apps\ecommerce-auth
```

## Expected External Repos

```text
Application repo:
https://github.com/ilhamzefer-sketch/ecommerce-auth

GitOps repo:
https://github.com/ilhamzefer-sketch/ecommerce-gitops

Container image:
ghcr.io/ilhamzefer-sketch/ecommerce-auth:<git-sha>
```

## Required Tools

Before doing anything, verify:

```powershell
docker --version
kubectl version --client
git --version
```

Docker Desktop must be installed and Kubernetes must be enabled:

```text
Docker Desktop > Settings > Kubernetes > Enable Kubernetes
```

## Required Secret

This setup assumes the environment variable `GITHUB_TOKEN` exists in the current PowerShell session.

The token needs access to:

```text
repo
read:packages
```

Reason:

```text
1. Argo CD needs repo access if ecommerce-gitops is private
2. Kubernetes needs GHCR access if ecommerce-auth image/package is private
```

Check:

```powershell
if (-not $env:GITHUB_TOKEN) { throw "GITHUB_TOKEN is missing" }
```

If missing, ask the human for a GitHub token. Do not invent a token.

## Startup Command

Run this exact sequence:

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
git pull origin main
.\scripts\start-docker-desktop.ps1
```

If `GITHUB_TOKEN` is not set, run:

```powershell
$env:GITHUB_TOKEN="PASTE_TOKEN_HERE"
cd C:\Users\Dell\Desktop\ecommerce-gitops
git pull origin main
.\scripts\start-docker-desktop.ps1
```

## What The Script Does

The script is expected to:

```text
1. Start/check Docker Desktop
2. Switch kubectl context to docker-desktop
3. Wait for Kubernetes
4. Install/update Argo CD
5. Create Argo CD private repo credential secret
6. Create GHCR image pull secret named ghcr-pull-secret
7. Apply bootstrap/ecommerce-auth-app.yaml
8. Wait for postgres-db deployment
9. Wait for ecommerce-auth-app deployment
10. Start LAN port-forwards:
    - Argo CD: 0.0.0.0:8082 -> argocd-server:443
    - ecommerce-auth: 0.0.0.0:8080 -> ecommerce-auth-service:8080
```

## Success Criteria

After startup, these commands should be healthy:

```powershell
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
kubectl get svc ecommerce-auth-service
kubectl rollout status deployment/ecommerce-auth-app
```

Expected human-facing URLs:

```text
Argo CD:
https://SERVER_PC_IP:8082

Swagger:
http://SERVER_PC_IP:8080/swagger-ui.html
```

Argo CD username:

```text
admin
```

The startup script prints the current Argo CD password if the initial admin secret still exists.

## If App Is Not Updating

Check the current image in GitOps:

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
git pull origin main
Select-String -Path .\apps\ecommerce-auth\app.yaml -Pattern "image:"
```

Check Argo status:

```powershell
kubectl -n argocd get application ecommerce-auth -o yaml
```

Force Argo refresh:

```powershell
kubectl -n argocd annotate application ecommerce-auth argocd.argoproj.io/refresh=hard --overwrite
```

Then recheck:

```powershell
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
```

## If Pod Cannot Pull Image

Look for `ImagePullBackOff` or `ErrImagePull`:

```powershell
kubectl get pods
kubectl describe pod -l app=ecommerce-auth-app
```

Likely causes:

```text
1. GITHUB_TOKEN is missing or expired
2. Token does not have read:packages
3. GHCR package is private and ghcr-pull-secret is wrong
4. apps/ecommerce-auth/app.yaml references an image tag that does not exist
```

Fix by recreating pull secret:

```powershell
kubectl create secret docker-registry ghcr-pull-secret `
  --docker-server=ghcr.io `
  --docker-username=ilhamzefer-sketch `
  --docker-password=$env:GITHUB_TOKEN `
  --dry-run=client -o yaml | kubectl apply -f -

kubectl rollout restart deployment/ecommerce-auth-app
kubectl rollout status deployment/ecommerce-auth-app
```

## If Argo Cannot Read Repo

Symptoms:

```text
Repository not found
authentication required
comparison error
```

Recreate Argo repo credential:

```powershell
kubectl -n argocd create secret generic ecommerce-gitops-repo `
  --from-literal=type=git `
  --from-literal=url=https://github.com/ilhamzefer-sketch/ecommerce-gitops.git `
  --from-literal=username=ilhamzefer-sketch `
  --from-literal=password=$env:GITHUB_TOKEN `
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n argocd label secret ecommerce-gitops-repo argocd.argoproj.io/secret-type=repository --overwrite
kubectl -n argocd annotate application ecommerce-auth argocd.argoproj.io/refresh=hard --overwrite
```

## If Port Is Busy

The script tries to stop old matching `kubectl port-forward` processes. If ports are still busy, inspect:

```powershell
Get-NetTCPConnection -LocalPort 8080,8082 -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like "*kubectl*port-forward*" } | Select-Object ProcessId,CommandLine
```

Stop only stale port-forward processes:

```powershell
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*kubectl*port-forward*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

Then rerun:

```powershell
.\scripts\start-docker-desktop.ps1
```

## Do Not Do This On Server PC

Do not edit application source code here unless explicitly asked.

Do not manually build local Docker images for normal deploy. The normal deploy flow is:

```text
notebook git push -> GitHub Actions image build -> GitOps manifest update -> Argo CD sync
```

Do not use `git reset --hard` unless the human explicitly asks.

## Final Report To Human

When finished, tell the human:

```text
1. Argo CD URL
2. Swagger URL
3. Argo Application sync/health status
4. Current ecommerce-auth image tag
5. Any problem that remains
```
