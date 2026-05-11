param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$SkipService
)

$ErrorActionPreference = "Stop"

function Test-RequiredCommand {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found. Install it first, then run setup.ps1 again."
    }
}

function Write-Step {
    param([string]$Message)

    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-JavacVersion {
    param([string]$JavacPath)

    if (-not (Test-Path $JavacPath)) {
        return $null
    }

    return (& $JavacPath -version 2>&1) -join " "
}

function Find-Jdk25Home {
    $candidateHomes = @()

    if ($env:JAVA_HOME) {
        $candidateHomes += $env:JAVA_HOME.TrimEnd("\")
    }

    $candidateHomes += "C:\Program Files\Java\jdk-25"

    $searchRoots = @(
        "C:\Program Files\Java",
        "C:\Program Files\Eclipse Adoptium",
        "C:\Program Files\Microsoft",
        "C:\Program Files\Zulu"
    )

    foreach ($root in $searchRoots) {
        if (Test-Path $root) {
            $candidateHomes += Get-ChildItem $root -Directory -Filter "*25*" -ErrorAction SilentlyContinue |
                Select-Object -ExpandProperty FullName
        }
    }

    $candidateHomes = $candidateHomes | Where-Object { $_ } | Select-Object -Unique

    foreach ($candidateHome in $candidateHomes) {
        $javacPath = Join-Path $candidateHome "bin\javac.exe"
        $version = Get-JavacVersion $javacPath

        if ($version -match "25\.") {
            return $candidateHome
        }
    }

    return $null
}

function Use-Jdk25 {
    $jdkHome = Find-Jdk25Home

    if (-not $jdkHome) {
        $currentJavaHome = if ($env:JAVA_HOME) { $env:JAVA_HOME } else { "<not set>" }
        throw "This backend requires JDK 25. Install JDK 25 or set JAVA_HOME to it. Current JAVA_HOME is '$currentJavaHome'."
    }

    $env:JAVA_HOME = $jdkHome
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"

    $mavenJavaVersion = (& "$env:JAVA_HOME\bin\java.exe" -version 2>&1) -join " "
    Write-Host "Using JAVA_HOME=$env:JAVA_HOME ($mavenJavaVersion)"
}

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

$EnvExample = Join-Path $ProjectRoot ".env.example"
$EnvFile = Join-Path $ProjectRoot ".env"

if ((Test-Path $EnvExample) -and -not (Test-Path $EnvFile)) {
    Write-Step "Creating local .env from .env.example"
    Copy-Item $EnvExample $EnvFile
}

Write-Step "Checking required tools"
if (-not $SkipBackend) {
    Test-RequiredCommand java
    Test-RequiredCommand javac
    Use-Jdk25
}

if (-not $SkipFrontend) {
    Test-RequiredCommand node
    Test-RequiredCommand npm
}

if (-not $SkipService) {
    Test-RequiredCommand python
}

if (-not $SkipBackend) {
    Write-Step "Downloading backend Maven dependencies"
    Push-Location "$ProjectRoot\backend"
    try {
        .\mvnw.cmd dependency:go-offline
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipFrontend) {
    Write-Step "Installing frontend dependencies into frontend/node_modules"
    Push-Location "$ProjectRoot\frontend"
    try {
        npm install
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipService) {
    Write-Step "Creating FastAPI virtual environment and installing service dependencies"
    Push-Location "$ProjectRoot\service"
    try {
        if (-not (Test-Path ".\venv\Scripts\python.exe")) {
            python -m venv venv
        }

        .\venv\Scripts\python.exe -m pip install --upgrade pip
        .\venv\Scripts\python.exe -m pip install -r requirements.txt
    }
    finally {
        Pop-Location
    }
}

Write-Step "Setup complete"
Write-Host "Run backend:  cd backend; .\mvnw.cmd spring-boot:run"
Write-Host "Run frontend: cd frontend; npm run dev"
Write-Host "Run service:  cd service; .\venv\Scripts\Activate.ps1; uvicorn service:app --reload --port 8000"
