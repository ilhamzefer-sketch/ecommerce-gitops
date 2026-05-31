param(
    [string]$AuthDir = "C:\Users\Dell\Desktop\ecommerce-auth",
    [string]$ImageName = "ecommerce-auth-ecommerce-auth:latest",
    [int]$ArgoPort = 8082,
    [int]$AppPort = 8080
)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Require-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Missing command: $Name"
    }
}

function Wait-Docker {
    Write-Host "Waiting for Docker Desktop..."
    for ($i = 0; $i -lt 90; $i++) {
        docker info *> $null
        if ($LASTEXITCODE -eq 0) {
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "Docker Desktop did not become ready. Start Docker Desktop and enable Kubernetes, then rerun this script."
}

function Wait-Kubernetes {
    Write-Host "Waiting for Kubernetes..."
    for ($i = 0; $i -lt 90; $i++) {
        kubectl get nodes *> $null
        if ($LASTEXITCODE -eq 0) {
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "Kubernetes is not ready. In Docker Desktop, enable Settings > Kubernetes > Enable Kubernetes."
}

function Use-MinikubeDocker {
    $envOutput = minikube docker-env --shell powershell
    foreach ($line in $envOutput) {
        if ($line -match '^\$Env:([^=]+) = "(.+)"$') {
            Set-Item -Path "Env:\$($matches[1])" -Value $matches[2]
        }
    }
}

function Start-PortForward {
    param(
        [string]$Name,
        [string]$Namespace,
        [string]$Service,
        [string]$Mapping
    )

    Get-CimInstance Win32_Process |
        Where-Object { $_.CommandLine -like "*kubectl*port-forward*$Service*$Mapping*" } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

    $LogFile = Join-Path $env:TEMP "$Name-port-forward.log"
    Start-Process -FilePath "kubectl" `
        -ArgumentList @("-n", $Namespace, "port-forward", $Service, $Mapping) `
        -RedirectStandardOutput $LogFile `
        -RedirectStandardError $LogFile `
        -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

Require-Command docker
Require-Command kubectl
Require-Command minikube

if (-not (Test-Path $AuthDir)) {
    throw "Auth repo not found: $AuthDir"
}

$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerDesktop) {
    Start-Process -FilePath $dockerDesktop -WindowStyle Hidden
}

Wait-Docker

Write-Host "Starting minikube..."
minikube start --driver=docker
kubectl config use-context minikube | Out-Null
Wait-Kubernetes

Write-Host "Building auth image..."
Use-MinikubeDocker
docker build -t $ImageName $AuthDir

Write-Host "Installing/checking Argo CD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd wait --for=condition=Ready pod -l app.kubernetes.io/part-of=argocd --timeout=300s

if ($env:GITHUB_TOKEN) {
    Write-Host "Adding private GitHub repo credentials to Argo CD..."
    kubectl -n argocd create secret generic ecommerce-gitops-repo `
        --from-literal=type=git `
        --from-literal=url=https://github.com/ilhamzefer-sketch/ecommerce-gitops.git `
        --from-literal=username=ilhamzefer-sketch `
        --from-literal=password=$env:GITHUB_TOKEN `
        --dry-run=client -o yaml | kubectl apply -f -
    kubectl -n argocd label secret ecommerce-gitops-repo argocd.argoproj.io/secret-type=repository --overwrite
} else {
    Write-Host "GITHUB_TOKEN is not set. Applying manifests directly; Argo may need repo credentials to sync the private GitHub repo."
}

Write-Host "Applying workloads..."
kubectl apply -f (Join-Path $RootDir "apps\ecommerce-auth\postgres.yaml")
kubectl apply -f (Join-Path $RootDir "apps\ecommerce-auth\app.yaml")
kubectl apply -f (Join-Path $RootDir "bootstrap\ecommerce-auth-app.yaml")
kubectl -n argocd annotate application ecommerce-auth argocd.argoproj.io/refresh=hard --overwrite *> $null

kubectl rollout status deployment/postgres-db --timeout=180s
kubectl rollout restart deployment/ecommerce-auth-app
kubectl rollout status deployment/ecommerce-auth-app --timeout=180s

Write-Host "Starting port-forwards..."
Start-PortForward -Name "argocd" -Namespace "argocd" -Service "svc/argocd-server" -Mapping "${ArgoPort}:443"
Start-PortForward -Name "ecommerce-auth" -Namespace "default" -Service "svc/ecommerce-auth-service" -Mapping "${AppPort}:8080"

$ArgoPassword = ""
try {
    $Encoded = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" 2>$null
    if ($Encoded) {
        $ArgoPassword = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Encoded))
    }
} catch {
    $ArgoPassword = ""
}

Write-Host ""
Write-Host "Ready."
Write-Host "Argo CD:  https://localhost:$ArgoPort"
Write-Host "Argo user: admin"
if ($ArgoPassword) {
    Write-Host "Argo pass: $ArgoPassword"
}
Write-Host "Swagger:  http://localhost:$AppPort/swagger-ui.html"
Write-Host ""
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
