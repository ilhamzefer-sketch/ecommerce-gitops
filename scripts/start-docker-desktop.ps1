param(
    [int]$ArgoPort = 8082,
    [string]$GitHubUsername = "ilhamzefer-sketch",
    [string]$SourcesDir = ""
)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$EnvFile = Join-Path $RootDir "scripts\.env"
$ServicesFile = Join-Path $RootDir "scripts\platform-services.json"
if (-not $SourcesDir) {
    $SourcesDir = Join-Path $RootDir "_sources"
}

function Require-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Missing command: $Name"
    }
}

function Import-EnvFile {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return
    }

    Get-Content -Path $Path | ForEach-Object {
        $Line = $_.Trim()
        if (-not $Line -or $Line.StartsWith("#")) {
            return
        }

        $Parts = $Line -split "=", 2
        if ($Parts.Count -ne 2) {
            return
        }

        $Name = $Parts[0].Trim()
        $Value = $Parts[1].Trim()
        if (($Value.StartsWith('"') -and $Value.EndsWith('"')) -or ($Value.StartsWith("'") -and $Value.EndsWith("'"))) {
            $Value = $Value.Substring(1, $Value.Length - 2)
        }

        if ($Name) {
            [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
        }
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

function Update-SourceRepositories {
    param([array]$Services)

    New-Item -ItemType Directory -Force -Path $SourcesDir | Out-Null
    foreach ($Service in $Services) {
        if (-not $Service.repo) {
            continue
        }

        $Target = Join-Path $SourcesDir $Service.name
        if (Test-Path (Join-Path $Target ".git")) {
            Write-Host "Pulling source repo: $($Service.name)"
            git -C $Target pull --ff-only
        } else {
            Write-Host "Cloning source repo: $($Service.name)"
            git clone $Service.repo $Target
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
        Where-Object { $_.CommandLine -like "*kubectl*port-forward*" -and ($_.CommandLine -like "*$Service*" -or $_.CommandLine -like "*$Mapping*") } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

    $OutLogFile = Join-Path $env:TEMP "$Name-port-forward.out.log"
    $ErrLogFile = Join-Path $env:TEMP "$Name-port-forward.err.log"
    Start-Process -FilePath "kubectl" `
        -ArgumentList @("-n", $Namespace, "port-forward", "--address", "0.0.0.0", $Service, $Mapping) `
        -RedirectStandardOutput $OutLogFile `
        -RedirectStandardError $ErrLogFile `
        -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

function Wait-Deployment {
    param([string]$Deployment)

    Write-Host "Waiting for deployment: $Deployment"
    for ($i = 0; $i -lt 150; $i++) {
        $Name = kubectl get deployment $Deployment --ignore-not-found -o name
        if ($LASTEXITCODE -eq 0 -and $Name) {
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "$Deployment was not created. Check Argo CD sync status."
}

function Get-ServiceDeployments {
    param([object]$Service)

    if ($Service.deployments) {
        return @($Service.deployments)
    }

    if ($Service.deployment) {
        return @($Service.deployment)
    }

    return @()
}

function Get-DeploymentImage {
    param([string]$Deployment)
    return kubectl get deployment $Deployment -o jsonpath="{.spec.template.spec.containers[0].image}"
}

function Pull-Image {
    param([string]$Image)

    if (-not $Image -or $Image -notlike "ghcr.io/*") {
        return
    }

    Write-Host "Pulling image: $Image"
    docker pull $Image
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to pull $Image. Check that scripts\.env GITHUB_TOKEN can read this GHCR package."
    }
}

function Set-DefaultImagePullSecret {
    $Patch = @{
        imagePullSecrets = @(
            @{
                name = "ghcr-pull-secret"
            }
        )
    } | ConvertTo-Json -Compress

    $PatchFile = New-TemporaryFile
    try {
        Set-Content -Path $PatchFile -Value $Patch -NoNewline
        kubectl patch serviceaccount default -n default --type=merge --patch-file $PatchFile | Out-Null
    } finally {
        Remove-Item -LiteralPath $PatchFile -Force -ErrorAction SilentlyContinue
    }
}

function Ensure-JwtSecret {
    $JwtSecret = $env:JWT_SECRET_KEY
    if (-not $JwtSecret) {
        $JwtSecret = "v7I8Jm9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q"
    }

    kubectl create secret generic ecommerce-jwt-secret `
        -n default `
        --from-literal=secret-key=$JwtSecret `
        --dry-run=client -o yaml | kubectl apply -f -
}

Require-Command docker
Require-Command kubectl
Require-Command git

Import-EnvFile -Path $EnvFile

if (-not (Test-Path $ServicesFile)) {
    throw "Missing services config: $ServicesFile"
}
$Services = Get-Content -Path $ServicesFile -Raw | ConvertFrom-Json

if (-not $env:GITHUB_TOKEN) {
    throw "GITHUB_TOKEN is required. Add GITHUB_TOKEN=your_token to scripts\.env."
}

if ($env:GITHUB_TOKEN -in @("SENIN_GITHUB_TOKEN", "YENI_TOKEN")) {
    throw "Replace the placeholder GITHUB_TOKEN in scripts\.env with a real GitHub token."
}

Update-SourceRepositories -Services $Services

$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerDesktop) {
    Start-Process -FilePath $dockerDesktop -WindowStyle Hidden
}

Wait-Docker

Write-Host "Logging in to GHCR..."
$env:GITHUB_TOKEN | docker login ghcr.io -u $GitHubUsername --password-stdin | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "Failed to login to ghcr.io. Check GitHubUsername and GITHUB_TOKEN in scripts\.env."
}

kubectl config use-context docker-desktop | Out-Null
Wait-Kubernetes
kubectl create namespace default --dry-run=client -o yaml | kubectl apply -f - | Out-Null

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
Set-DefaultImagePullSecret

Write-Host "Adding shared JWT secret..."
Ensure-JwtSecret

Write-Host "Creating platform Argo CD application..."
kubectl apply -f (Join-Path $RootDir "bootstrap\ecommerce-platform.yaml")
kubectl -n argocd annotate application ecommerce-platform argocd.argoproj.io/refresh=hard --overwrite *> $null

foreach ($Service in $Services) {
    foreach ($Deployment in (Get-ServiceDeployments -Service $Service)) {
        Wait-Deployment -Deployment $Deployment
        $Image = Get-DeploymentImage -Deployment $Deployment
        Pull-Image -Image $Image
    }
}

foreach ($Service in $Services) {
    foreach ($Deployment in (Get-ServiceDeployments -Service $Service)) {
        Write-Host "Restarting $Deployment..."
        kubectl rollout restart "deployment/$Deployment"
        kubectl rollout status "deployment/$Deployment" --timeout=180s
    }
}

Write-Host "Starting LAN port-forwards..."
Start-PortForward -Name "argocd" -Namespace "argocd" -Service "svc/argocd-server" -Mapping "${ArgoPort}:443"
foreach ($Service in $Services) {
    if (-not $Service.service) {
        continue
    }

    Start-PortForward `
        -Name $Service.name `
        -Namespace "default" `
        -Service "svc/$($Service.service)" `
        -Mapping "$($Service.localPort):$($Service.servicePort)"
}

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
}
Write-Host "Argo user: admin"
if ($ArgoPassword) {
    Write-Host "Argo pass: $ArgoPassword"
}
foreach ($Service in $Services) {
    if (-not $Service.localPort) {
        continue
    }

    $Path = $Service.urlPath
    if (-not $Path) {
        $Path = "/"
    }
    Write-Host "$($Service.name) local: http://localhost:$($Service.localPort)$Path"
    if ($PcIp) {
        Write-Host "$($Service.name) LAN:   http://${PcIp}:$($Service.localPort)$Path"
    }
}
Write-Host ""
kubectl -n argocd get applications -o wide
kubectl get pods
