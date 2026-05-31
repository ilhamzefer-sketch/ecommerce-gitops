# Notebook and Server Runbook

Bu setup-da notebook developer masinidir, server PC ise Kubernetes ve Argo CD masinidir.

## Arxitektura

```text
Notebook
  -> ecommerce-auth kod deyisir
  -> git push origin main

GitHub Actions
  -> Docker image build edir
  -> ghcr.io/ilhamzefer-sketch/ecommerce-auth:<commit-sha> push edir
  -> ecommerce-gitops/apps/ecommerce-auth/app.yaml image tag-ni update edir

Server PC
  -> Docker Desktop Kubernetes isledir
  -> Argo CD ecommerce-gitops repo-nu izleyir
  -> yeni manifest gelende app-i sync edir
```

## Notebookda edilmeliler

Auth servis kodu ucun:

```powershell
cd C:\Users\Dell\Desktop\ecommerce-auth
.\gradlew.bat test
git status
git add .
git commit -m "Update ecommerce auth"
git push origin main
```

GitOps manifestlerini elle deyisende:

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
git status
git add .
git commit -m "Update GitOps manifests"
git push origin main
```

GitHub Actions neticesini burada izleyirsen:

```text
https://github.com/ilhamzefer-sketch/ecommerce-auth/actions
```

GitOps commitlerini burada izleyirsen:

```text
https://github.com/ilhamzefer-sketch/ecommerce-gitops/commits/main
```

## Server PC-de bir defe hazirliq

Server PC-de bunlar lazimdir:

```text
Docker Desktop
Docker Desktop Kubernetes enabled
kubectl
Git
PowerShell
```

Repo-nu server PC-yə clone et:

```powershell
cd C:\Users\Dell\Desktop
git clone https://github.com/ilhamzefer-sketch/ecommerce-gitops.git
cd C:\Users\Dell\Desktop\ecommerce-gitops
```

GitHub token yarat. Repo-lar ve GHCR private qalirsa token ucun bunlar lazimdir:

```text
repo
read:packages
```

Server PC-de tokeni session ucun set et:

```powershell
$env:GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
```

## Server PC-de run

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
git pull origin main
$env:GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
.\scripts\start-docker-desktop.ps1
```

Script bunlari edir:

```text
1. Docker Desktop ve Kubernetes hazirdir yoxlayir
2. Argo CD install/update edir
3. Private GitOps repo credential-ni Argo CD-ye verir
4. GHCR image pull secret yaradir
5. Argo CD Application yaradir
6. ecommerce-auth workload hazir olana qeder gozleyir
7. Argo CD ve Swagger ucun LAN port-forward acir
```

Script sonunda bu linkleri verir:

```text
Argo CD: https://SERVER-PC-IP:8082
Swagger: http://SERVER-PC-IP:8080/swagger-ui.html
```

Argo username:

```text
admin
```

Password-u script ekrana cixarir.

## Argo ile veziyyeti izlemek

Server PC-de:

```powershell
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
kubectl get svc
```

Argo UI-da:

```text
Application: ecommerce-auth
Status: Synced
Health: Healthy
```

Yeni kod push edenden sonra normal ardicilliq:

```text
1. Notebookdan ecommerce-auth push olunur
2. GitHub Actions yeni image yaradir
3. GitHub Actions GitOps manifestini update edir
4. Argo CD yeni commit-i gorur
5. Argo CD app-i sync edir
6. Server PC-de pod yeniden rollout olur
```

## Tez yoxlama komandlari

Hazir image tag:

```powershell
cd C:\Users\Dell\Desktop\ecommerce-gitops
Select-String -Path .\apps\ecommerce-auth\app.yaml -Pattern "image:"
```

Pod loglari:

```powershell
kubectl logs deployment/ecommerce-auth-app
```

Rollout:

```powershell
kubectl rollout status deployment/ecommerce-auth-app
```

Argo refresh:

```powershell
kubectl -n argocd annotate application ecommerce-auth argocd.argoproj.io/refresh=hard --overwrite
```
