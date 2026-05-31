param(
    [int]$ArgoPort = 8082,
    [int]$AppPort = 8080,
    [string]$GitHubUsername = "ilhamzefer-sketch"
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
    throw "Docker Desktop is not ready. Start Docker Desktop and try again."
}

function Wait-Kubernetes {
    Write-Host "Waiting for Docker Desktop Kubernetes..."
    for ($i = 0; $i -lt 90; $i++) {
        kubectl get nodes *> $null
        if ($LASTEXITCODE -eq 0) {
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "Kubernetes is not ready. Enable Docker Desktop > Settings > Kubernetes."
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
        -ArgumentList @("-n", $Namespace, "port-forward", "--address", "0.0.0.0", $Service, $Mapping) `
        -RedirectStandardOutput $LogFile `
        -RedirectStandardError $LogFile `
        -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

function Wait-Workload {
    Write-Host "Waiting for ecommerce-auth workload..."
    for ($i = 0; $i -lt 150; $i++) {
        kubectl get svc ecommerce-auth-service *> $null
        if ($LASTEXITCODE -eq 0) {
            kubectl rollout status deployment/postgres-db --timeout=180s
            kubectl rollout status deployment/ecommerce-auth-app --timeout=180s
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "ecommerce-auth-service was not created. Check Argo CD sync status and repository credentials."
}

Require-Command docker
Require-Command kubectl

if (-not $env:GITHUB_TOKEN) {
    throw "GITHUB_TOKEN is required because ecommerce-gitops and GHCR image access are private."
}

$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerDesktop) {
    Start-Process -FilePath $dockerDesktop -WindowStyle Hidden
}

Wait-Docker

kubectl config use-context docker-desktop | Out-Null
Wait-Kubernetes

Write-Host "Installing/checking Argo CD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd wait --for=condition=Ready pod -l app.kubernetes.io/part-of=argocd --timeout=300s

Write-Host "Adding private GitOps repo credentials to Argo CD..."
kubectl -n argocd create secret generic ecommerce-gitops-repo `
    --from-literal=type=git `
    --from-literal=url=https://github.com/ilhamzefer-sketch/ecommerce-gitops.git `
    --from-literal=username=$GitHubUsername `
    --from-literal=password=$env:GITHUB_TOKEN `
    --dry-run=client -o yaml | kubectl apply -f -
kubectl -n argocd label secret ecommerce-gitops-repo argocd.argoproj.io/secret-type=repository --overwrite

Write-Host "Adding GHCR image pull secret..."
kubectl create secret docker-registry ghcr-pull-secret `
    --docker-server=ghcr.io `
    --docker-username=$GitHubUsername `
    --docker-password=$env:GITHUB_TOKEN `
    --dry-run=client -o yaml | kubectl apply -f -

Write-Host "Creating Argo CD application..."
kubectl apply -f (Join-Path $RootDir "bootstrap\ecommerce-auth-app.yaml")
kubectl -n argocd annotate application ecommerce-auth argocd.argoproj.io/refresh=hard --overwrite *> $null
Wait-Workload

Write-Host "Starting LAN port-forwards..."
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

$PcIp = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" } |
    Select-Object -First 1 -ExpandProperty IPAddress)

Write-Host ""
Write-Host "Ready."
Write-Host "Argo CD local: https://localhost:$ArgoPort"
if ($PcIp) {
    Write-Host "Argo CD LAN:   https://${PcIp}:$ArgoPort"
    Write-Host "Swagger LAN:   http://${PcIp}:$AppPort/swagger-ui.html"
}
Write-Host "Argo user: admin"
if ($ArgoPassword) {
    Write-Host "Argo pass: $ArgoPassword"
}
Write-Host "Swagger local: http://localhost:$AppPort/swagger-ui.html"
Write-Host ""
kubectl -n argocd get application ecommerce-auth -o wide
kubectl get pods
