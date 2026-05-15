[CmdletBinding()]
param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$SkipService,
    [switch]$SkipToolInstall,
    [switch]$SkipDatabaseSetup
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ToolPackages = [ordered]@{
    JavaJdk25 = "EclipseAdoptium.Temurin.25.JDK"
    NodeJsLts = "OpenJS.NodeJS.LTS"
    Python313 = "Python.Python.3.13"
    MySqlServer = "Oracle.MySQL"
    Git = "Git.Git"
    Postman = "Postman.Postman"
}

$ApacheMavenVersion = "3.9.15"

function Write-Step {
    param([string]$Message)

    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Info {
    param([string]$Message)

    Write-Host "    $Message"
}

function Write-Warn {
    param([string]$Message)

    Write-Warning $Message
}

function Test-RequiredCommand {
    param(
        [string]$Name,
        [string]$InstallHint
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        $message = "Required command '$Name' was not found."
        if ($InstallHint) {
            $message += " $InstallHint"
        }

        throw $message
    }
}

function Get-CommandOutput {
    param(
        [string]$Command,
        [string[]]$Arguments = @()
    )

    return (& $Command @Arguments 2>&1 | Out-String).Trim()
}

function Invoke-CheckedCommand {
    param(
        [scriptblock]$Command,
        [string]$FailureMessage
    )

    & $Command
    if ($LASTEXITCODE -ne $null -and $LASTEXITCODE -ne 0) {
        throw $FailureMessage
    }
}

function Update-CurrentPath {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = (@($machinePath, $userPath) | Where-Object { $_ }) -join ";"
}

function Remove-DirectorySafely {
    param(
        [string]$Path,
        [string]$AllowedRoot
    )

    $resolvedRoot = [IO.Path]::GetFullPath($AllowedRoot).TrimEnd("\")
    $resolvedTarget = [IO.Path]::GetFullPath($Path).TrimEnd("\")

    if (-not $resolvedTarget.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to delete '$resolvedTarget' because it is outside '$resolvedRoot'."
    }

    if (Test-Path -LiteralPath $resolvedTarget) {
        Remove-Item -LiteralPath $resolvedTarget -Recurse -Force
    }
}

function Add-UserPathEntry {
    param([string]$PathEntry)

    if (-not (Test-Path -LiteralPath $PathEntry)) {
        return
    }

    $currentUserPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $entries = @()
    if ($currentUserPath) {
        $entries = $currentUserPath -split ";" | Where-Object { $_ }
    }

    if ($entries -notcontains $PathEntry) {
        $newUserPath = (@($entries) + $PathEntry) -join ";"
        [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
    }

    if (($env:Path -split ";") -notcontains $PathEntry) {
        $env:Path = "$PathEntry;$env:Path"
    }
}

function Test-WinGetAvailable {
    return [bool](Get-Command winget -ErrorAction SilentlyContinue)
}

function Assert-WinGetAvailable {
    if (-not (Test-WinGetAvailable)) {
        throw "Automatic tool installation requires WinGet. Install App Installer / WinGet first, or rerun with -SkipToolInstall after installing tools manually."
    }
}

function Test-WinGetPackageInstalled {
    param([string]$Id)

    if (-not (Test-WinGetAvailable)) {
        return $false
    }

    & winget list --id $Id --exact --disable-interactivity --accept-source-agreements *> $null
    return $LASTEXITCODE -eq 0
}

function Install-WinGetPackage {
    param(
        [string]$Id,
        [string]$Label
    )

    Assert-WinGetAvailable
    Write-Step "Installing $Label"
    Invoke-CheckedCommand `
        -Command { winget install --id $Id --exact --source winget --silent --accept-package-agreements --accept-source-agreements --disable-interactivity } `
        -FailureMessage "Could not install $Label with WinGet. Install it manually, then run setup.ps1 again."
    Update-CurrentPath
}

function Initialize-WinGetPackage {
    param(
        [string]$Id,
        [string]$Label
    )

    if (Test-WinGetPackageInstalled $Id) {
        Write-Info "$Label is already installed"
        return
    }

    Install-WinGetPackage -Id $Id -Label $Label
}

function ConvertTo-Version {
    param([string]$Value)

    $match = [regex]::Match($Value, '(\d+)\.(\d+)\.(\d+)')
    if (-not $match.Success) {
        return $null
    }

    return [version]$match.Groups[0].Value
}

function Assert-SupportedNodeVersion {
    $rawVersion = Get-CommandOutput "node" @("--version")
    $version = ConvertTo-Version $rawVersion

    if (-not $version) {
        throw "Could not read the Node.js version from '$rawVersion'."
    }

    $isSupported =
        (($version.Major -eq 20) -and ($version -ge [version]"20.19.0")) -or
        (($version.Major -eq 22) -and ($version -ge [version]"22.12.0")) -or
        (($version.Major -eq 24) -and ($version -ge [version]"24.15.0"))

    if (-not $isSupported) {
        throw "Node.js $version is not supported. Install Node.js 20.19+, 22.12+, or 24.15+."
    }

    Write-Info "Node.js $version"
}

function Test-SupportedNodeVersion {
    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeCommand) {
        return $false
    }

    $rawVersion = Get-CommandOutput "node" @("--version")
    $version = ConvertTo-Version $rawVersion
    if (-not $version) {
        return $false
    }

    return (
        (($version.Major -eq 20) -and ($version -ge [version]"20.19.0")) -or
        (($version.Major -eq 22) -and ($version -ge [version]"22.12.0")) -or
        (($version.Major -eq 24) -and ($version -ge [version]"24.15.0"))
    )
}

function Assert-SupportedPythonVersion {
    $rawVersion = Get-CommandOutput "python" @("--version")
    $version = ConvertTo-Version $rawVersion

    if (-not $version) {
        throw "Could not read the Python version from '$rawVersion'."
    }

    if ($version -lt [version]"3.11.0") {
        throw "Python $version is not supported. Install Python 3.11 or newer."
    }

    Write-Info "Python $version"
}

function Test-SupportedPythonVersion {
    $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCommand) {
        return $false
    }

    $rawVersion = Get-CommandOutput "python" @("--version")
    $version = ConvertTo-Version $rawVersion
    if (-not $version) {
        return $false
    }

    return $version -ge [version]"3.11.0"
}

function Get-JavacVersion {
    param([string]$JavacPath)

    if (-not (Test-Path -LiteralPath $JavacPath)) {
        return $null
    }

    return Get-CommandOutput $JavacPath @("-version")
}

function Find-Jdk25Home {
    $candidateHomes = @()

    if ($env:JAVA_HOME) {
        $candidateHomes += $env:JAVA_HOME.TrimEnd("\")
    }

    $javacCommand = Get-Command javac -ErrorAction SilentlyContinue
    if ($javacCommand -and $javacCommand.Source) {
        $candidateHomes += Split-Path -Parent (Split-Path -Parent $javacCommand.Source)
    }

    $candidateHomes += "C:\Program Files\Java\jdk-25"

    $searchRoots = @(
        "C:\Program Files\Java",
        "C:\Program Files\Eclipse Adoptium",
        "C:\Program Files\Microsoft",
        "C:\Program Files\Zulu"
    )

    foreach ($root in $searchRoots) {
        if (Test-Path -LiteralPath $root) {
            $candidateHomes += Get-ChildItem -LiteralPath $root -Directory -Filter "*25*" -ErrorAction SilentlyContinue |
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

    $javaVersion = Get-CommandOutput (Join-Path $env:JAVA_HOME "bin\java.exe") @("-version")
    Write-Info "Using JAVA_HOME=$env:JAVA_HOME"
    Write-Info (($javaVersion -split "\r?\n")[0])

    return $jdkHome
}

function Initialize-MavenToolchain {
    param([string]$JdkHome)

    $m2Directory = Join-Path $HOME ".m2"
    $toolchainsPath = Join-Path $m2Directory "toolchains.xml"

    if (-not (Test-Path -LiteralPath $m2Directory)) {
        New-Item -ItemType Directory -Path $m2Directory | Out-Null
    }

    if (Test-Path -LiteralPath $toolchainsPath) {
        try {
            [xml]$xml = Get-Content -LiteralPath $toolchainsPath -Raw
        }
        catch {
            throw "Could not parse '$toolchainsPath'. Fix that Maven toolchains file, then run setup.ps1 again."
        }
    }
    else {
        [xml]$xml = '<?xml version="1.0" encoding="UTF-8"?><toolchains></toolchains>'
    }

    $toolchainsNode = $xml.SelectSingleNode("/toolchains")
    if (-not $toolchainsNode) {
        throw "The Maven toolchains file '$toolchainsPath' must contain a <toolchains> root element."
    }

    $jdk25Node = $xml.SelectSingleNode("/toolchains/toolchain[type='jdk' and provides/version='25']")
    $changed = $false

    if (-not $jdk25Node) {
        $jdk25Node = $xml.CreateElement("toolchain")

        $typeNode = $xml.CreateElement("type")
        $typeNode.InnerText = "jdk"
        [void]$jdk25Node.AppendChild($typeNode)

        $providesNode = $xml.CreateElement("provides")
        $versionNode = $xml.CreateElement("version")
        $versionNode.InnerText = "25"
        [void]$providesNode.AppendChild($versionNode)
        [void]$jdk25Node.AppendChild($providesNode)

        $configurationNode = $xml.CreateElement("configuration")
        $jdkHomeNode = $xml.CreateElement("jdkHome")
        $jdkHomeNode.InnerText = $JdkHome
        [void]$configurationNode.AppendChild($jdkHomeNode)
        [void]$jdk25Node.AppendChild($configurationNode)

        [void]$toolchainsNode.AppendChild($jdk25Node)
        $changed = $true
    }
    else {
        $configurationNode = $jdk25Node.SelectSingleNode("configuration")
        if (-not $configurationNode) {
            $configurationNode = $xml.CreateElement("configuration")
            [void]$jdk25Node.AppendChild($configurationNode)
            $changed = $true
        }

        $jdkHomeNode = $configurationNode.SelectSingleNode("jdkHome")
        if (-not $jdkHomeNode) {
            $jdkHomeNode = $xml.CreateElement("jdkHome")
            [void]$configurationNode.AppendChild($jdkHomeNode)
            $changed = $true
        }

        if ($jdkHomeNode.InnerText -ne $JdkHome) {
            $jdkHomeNode.InnerText = $JdkHome
            $changed = $true
        }
    }

    if ($changed) {
        $xml.Save($toolchainsPath)
        Write-Info "Configured Maven toolchain for JDK 25 in $toolchainsPath"
    }
    else {
        Write-Info "Maven toolchain for JDK 25 is already configured"
    }
}

function Find-MySqlExecutable {
    $mysqlCommand = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysqlCommand) {
        return $mysqlCommand.Source
    }

    $searchRoots = @(
        "C:\Program Files\MySQL",
        "C:\Program Files (x86)\MySQL"
    )

    foreach ($root in $searchRoots) {
        if (-not (Test-Path -LiteralPath $root)) {
            continue
        }

        $candidate = Get-ChildItem -LiteralPath $root -Directory -Filter "MySQL Server *" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            ForEach-Object { Join-Path $_.FullName "bin\mysql.exe" } |
            Where-Object { Test-Path -LiteralPath $_ } |
            Select-Object -First 1

        if ($candidate) {
            return $candidate
        }
    }

    return $null
}

function Get-EnvValue {
    param(
        [string]$EnvFilePath,
        [string]$Name
    )

    if (-not (Test-Path -LiteralPath $EnvFilePath)) {
        return $null
    }

    $match = Get-Content -LiteralPath $EnvFilePath |
        Where-Object { $_ -match "^\s*$([regex]::Escape($Name))\s*=" } |
        Select-Object -Last 1

    if (-not $match) {
        return $null
    }

    return ($match -split "=", 2)[1]
}

function Set-EnvValue {
    param(
        [string]$EnvFilePath,
        [string]$Name,
        [string]$Value
    )

    $lines = @()
    if (Test-Path -LiteralPath $EnvFilePath) {
        $lines = Get-Content -LiteralPath $EnvFilePath
    }

    $updated = $false
    for ($index = 0; $index -lt $lines.Count; $index++) {
        if ($lines[$index] -match "^\s*$([regex]::Escape($Name))\s*=") {
            $lines[$index] = "$Name=$Value"
            $updated = $true
        }
    }

    if (-not $updated) {
        $lines += "$Name=$Value"
    }

    Set-Content -LiteralPath $EnvFilePath -Value $lines
}

function Test-PlaceholderValue {
    param([string]$Value)

    return [string]::IsNullOrWhiteSpace($Value) -or ($Value -match 'change_me|replace_with|your_')
}

function ConvertFrom-JdbcMySqlUrl {
    param([string]$JdbcUrl)

    $match = [regex]::Match($JdbcUrl, '^jdbc:mysql://([^/:?]+)(?::(\d+))?/([^?]+)')
    if (-not $match.Success) {
        throw "Could not parse DB_URL '$JdbcUrl'. Expected a value like jdbc:mysql://localhost:3306/koupreng_db?... "
    }

    return [pscustomobject]@{
        Host = $match.Groups[1].Value
        Port = if ($match.Groups[2].Success) { $match.Groups[2].Value } else { "3306" }
        Database = $match.Groups[3].Value
    }
}

function Convert-SecureStringToPlainText {
    param([securestring]$SecureString)

    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

function Start-MySqlService {
    $service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue |
        Sort-Object Name |
        Select-Object -First 1

    if (-not $service) {
        Write-Warn "No MySQL Windows service was found. If this is a fresh MySQL install, finish MySQL configuration first, then run setup.ps1 again."
        return
    }

    if ($service.Status -ne "Running") {
        Write-Step "Starting MySQL service"
        try {
            Start-Service -Name $service.Name
            $service.WaitForStatus("Running", [timespan]::FromSeconds(20))
        }
        catch {
            throw "MySQL service '$($service.Name)' is installed but could not be started automatically. Start it manually, then run setup.ps1 again."
        }
    }

    Write-Info "MySQL service '$($service.Name)' is running"
}

function Invoke-MySqlCommand {
    param(
        [string]$MySqlExecutable,
        [string]$HostName,
        [string]$Port,
        [string]$Username,
        [SecureString]$Password,
        [string]$Sql,
        [string]$FailureMessage
    )

    $previousMySqlPassword = $env:MYSQL_PWD
    try {
        $env:MYSQL_PWD = Convert-SecureStringToPlainText $Password
        & $MySqlExecutable "--host=$HostName" "--port=$Port" "--user=$Username" "--execute=$Sql" 1>$null
        if ($LASTEXITCODE -ne 0) {
            throw $FailureMessage
        }
    }
    finally {
        $env:MYSQL_PWD = $previousMySqlPassword
    }
}

function Initialize-MySqlDatabase {
    param(
        [string]$EnvFilePath,
        [string]$MySqlExecutable
    )

    if (-not (Test-Path -LiteralPath $EnvFilePath)) {
        throw "Cannot configure MySQL because '$EnvFilePath' does not exist."
    }

    Start-MySqlService

    $dbUrl = Get-EnvValue -EnvFilePath $EnvFilePath -Name "DB_URL"
    $username = Get-EnvValue -EnvFilePath $EnvFilePath -Name "DB_USERNAME"
    $password = Get-EnvValue -EnvFilePath $EnvFilePath -Name "DB_PASSWORD"

    if ([string]::IsNullOrWhiteSpace($dbUrl)) {
        throw "DB_URL is missing from '$EnvFilePath'."
    }

    if (Test-PlaceholderValue $username) {
        $enteredUsername = Read-Host "MySQL username for local setup [root]"
        $username = if ([string]::IsNullOrWhiteSpace($enteredUsername)) { "root" } else { $enteredUsername }
        Set-EnvValue -EnvFilePath $EnvFilePath -Name "DB_USERNAME" -Value $username
    }

    if (Test-PlaceholderValue $password) {
        $securePassword = Read-Host "MySQL password for '$username'" -AsSecureString
        $password = Convert-SecureStringToPlainText $securePassword
        Set-EnvValue -EnvFilePath $EnvFilePath -Name "DB_PASSWORD" -Value $password
    }

    $connection = ConvertFrom-JdbcMySqlUrl $dbUrl
    if ($connection.Database -notmatch '^[A-Za-z0-9_]+$') {
        throw "Database name '$($connection.Database)' is not supported by the automatic setup flow. Use only letters, numbers, and underscores."
    }

    Write-Step "Creating local MySQL database"
    $securePasswordArg = ConvertTo-SecureString -String $password -AsPlainText -Force
    Invoke-MySqlCommand `
        -MySqlExecutable $MySqlExecutable `
        -HostName $connection.Host `
        -Port $connection.Port `
        -Username $username `
        -Password $securePasswordArg `
        -Sql "SELECT 1;" `
        -FailureMessage "Could not connect to MySQL using DB_USERNAME/DB_PASSWORD from '$EnvFilePath'. Update the credentials and run setup.ps1 again."

    $createDatabaseSql = "CREATE DATABASE IF NOT EXISTS ``$($connection.Database)`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    Invoke-MySqlCommand `
        -MySqlExecutable $MySqlExecutable `
        -HostName $connection.Host `
        -Port $connection.Port `
        -Username $username `
        -Password $securePasswordArg `
        -Sql $createDatabaseSql `
        -FailureMessage "Connected to MySQL, but could not create database '$($connection.Database)'."

    Write-Info "Database '$($connection.Database)' is ready"
}

function Install-Jdk25 {
    if (Find-Jdk25Home) {
        Write-Info "JDK 25 is already installed"
        return
    }

    Install-WinGetPackage -Id $ToolPackages.JavaJdk25 -Label "JDK 25"
}

function Install-NodeJs {
    if (Test-SupportedNodeVersion) {
        Write-Info "A supported Node.js version is already installed"
        return
    }

    Install-WinGetPackage -Id $ToolPackages.NodeJsLts -Label "Node.js LTS"
}

function Install-Python {
    if (Test-SupportedPythonVersion) {
        Write-Info "A supported Python version is already installed"
        return
    }

    Install-WinGetPackage -Id $ToolPackages.Python313 -Label "Python 3.13"
}

function Install-MySql {
    $mysqlExecutable = Find-MySqlExecutable
    if ($mysqlExecutable) {
        Add-UserPathEntry (Split-Path -Parent $mysqlExecutable)
        Write-Info "MySQL is already installed"
        return
    }

    Install-WinGetPackage -Id $ToolPackages.MySqlServer -Label "MySQL Server"
}

function Install-Git {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Info "Git is already installed"
        return
    }

    Install-WinGetPackage -Id $ToolPackages.Git -Label "Git"
}

function Install-Postman {
    Initialize-WinGetPackage -Id $ToolPackages.Postman -Label "Postman"
}

function Install-ApacheMaven {
    param([string]$Version = $ApacheMavenVersion)

    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        Write-Info "Apache Maven is already installed"
        return
    }

    Write-Step "Installing Apache Maven $Version"

    $mavenRoot = Join-Path $env:LOCALAPPDATA "Programs\Apache\Maven"
    $installDirectory = Join-Path $mavenRoot "apache-maven-$Version"
    $mavenBinDirectory = Join-Path $installDirectory "bin"
    $mavenCommand = Join-Path $mavenBinDirectory "mvn.cmd"

    if (-not (Test-Path -LiteralPath $mavenCommand)) {
        if (-not (Test-Path -LiteralPath $mavenRoot)) {
            New-Item -ItemType Directory -Path $mavenRoot -Force | Out-Null
        }

        $tempRoot = Join-Path ([IO.Path]::GetTempPath()) "koupreng-maven-$Version"
        Remove-DirectorySafely -Path $tempRoot -AllowedRoot ([IO.Path]::GetTempPath())
        New-Item -ItemType Directory -Path $tempRoot | Out-Null

        $zipPath = Join-Path $tempRoot "apache-maven-$Version-bin.zip"
        $shaPath = "$zipPath.sha512"
        $downloadCandidates = @(
            "https://dlcdn.apache.org/maven/maven-3/$Version/binaries/apache-maven-$Version-bin.zip",
            "https://archive.apache.org/dist/maven/maven-3/$Version/binaries/apache-maven-$Version-bin.zip"
        )

        $downloaded = $false
        foreach ($downloadUrl in $downloadCandidates) {
            try {
                Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
                Invoke-WebRequest -Uri "$downloadUrl.sha512" -OutFile $shaPath
                $downloaded = $true
                break
            }
            catch {
                if (Test-Path -LiteralPath $zipPath) {
                    Remove-Item -LiteralPath $zipPath -Force
                }
                if (Test-Path -LiteralPath $shaPath) {
                    Remove-Item -LiteralPath $shaPath -Force
                }
            }
        }

        if (-not $downloaded) {
            throw "Could not download Apache Maven $Version from the official Apache mirrors."
        }

        $expectedSha512 = ((Get-Content -LiteralPath $shaPath -Raw).Trim() -split "\s+")[0].ToUpperInvariant()
        $actualSha512 = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA512).Hash.ToUpperInvariant()
        if ($expectedSha512 -ne $actualSha512) {
            throw "Apache Maven checksum verification failed. The downloaded archive was not installed."
        }

        Expand-Archive -LiteralPath $zipPath -DestinationPath $mavenRoot -Force

        Remove-DirectorySafely -Path $tempRoot -AllowedRoot ([IO.Path]::GetTempPath())
    }

    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $installDirectory, "User")
    [Environment]::SetEnvironmentVariable("M2_HOME", $installDirectory, "User")
    $env:MAVEN_HOME = $installDirectory
    $env:M2_HOME = $installDirectory
    Add-UserPathEntry $mavenBinDirectory
    Update-CurrentPath

    if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
        throw "Apache Maven was installed, but 'mvn' is still not available on PATH. Open a new PowerShell window and run setup.ps1 again."
    }

    Write-Info "Apache Maven $Version installed"
}

function Install-DevelopmentTools {
    Write-Step "Installing missing system tools"

    if (-not $SkipBackend) {
        Install-Jdk25
        Install-MySql
    }

    if (-not $SkipFrontend) {
        Install-NodeJs
    }

    if (-not $SkipService) {
        Install-Python
    }

    Install-Git
    Install-Postman
    Install-ApacheMaven
    Update-CurrentPath
}

function Initialize-EnvFile {
    param(
        [string]$ExamplePath,
        [string]$TargetPath,
        [string]$Label
    )

    if ((Test-Path -LiteralPath $ExamplePath) -and -not (Test-Path -LiteralPath $TargetPath)) {
        Copy-Item -LiteralPath $ExamplePath -Destination $TargetPath
        Write-Info "Created $Label from template"
    }
    elseif (Test-Path -LiteralPath $TargetPath) {
        Write-Info "$Label already exists"
    }
}

function Test-PackageJsonHasDependencies {
    param([string]$PackageJsonPath)

    if (-not (Test-Path -LiteralPath $PackageJsonPath)) {
        return $false
    }

    $package = Get-Content -LiteralPath $PackageJsonPath -Raw | ConvertFrom-Json
    $dependencyCount = 0

    if ($package.dependencies) {
        $dependencyCount += @($package.dependencies.PSObject.Properties).Count
    }

    if ($package.devDependencies) {
        $dependencyCount += @($package.devDependencies.PSObject.Properties).Count
    }

    return $dependencyCount -gt 0
}

function Install-NpmDependencies {
    param(
        [string]$ProjectPath,
        [string]$Label
    )

    $packageJsonPath = Join-Path $ProjectPath "package.json"
    if (-not (Test-PackageJsonHasDependencies $packageJsonPath)) {
        Write-Info "Skipping $Label because it has no npm dependencies"
        return
    }

    Write-Step "Installing npm dependencies for $Label"
    Push-Location $ProjectPath
    try {
        if ((Test-Path -LiteralPath ".\package-lock.json") -and -not (Test-Path -LiteralPath ".\node_modules")) {
            Invoke-CheckedCommand `
                -Command { npm ci --no-audit --no-fund } `
                -FailureMessage "npm ci failed for $Label."
        }
        else {
            Invoke-CheckedCommand `
                -Command { npm install --no-audit --no-fund } `
                -FailureMessage "npm install failed for $Label. If a dev server is using files in node_modules, stop it and run setup.ps1 again."
        }
    }
    finally {
        Pop-Location
    }
}

function Write-PlaceholderEnvValueWarning {
    param([string]$EnvFilePath)

    if (-not (Test-Path -LiteralPath $EnvFilePath)) {
        return
    }

    $placeholderPattern = 'change_me|replace_with|your_'
    if (Select-String -LiteralPath $EnvFilePath -Pattern $placeholderPattern -Quiet) {
        Write-Warn "Review '$EnvFilePath' before real use; it still contains placeholder values."
    }
}

$ProjectRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $ProjectRoot

Write-Step "Preparing local environment files"
Initialize-EnvFile `
    -ExamplePath (Join-Path $ProjectRoot ".env.example") `
    -TargetPath (Join-Path $ProjectRoot ".env") `
    -Label ".env"
Initialize-EnvFile `
    -ExamplePath (Join-Path $ProjectRoot "frontend-user\.env.example") `
    -TargetPath (Join-Path $ProjectRoot "frontend-user\.env") `
    -Label "frontend-user\.env"
Initialize-EnvFile `
    -ExamplePath (Join-Path $ProjectRoot "frontend-admin\.env.example") `
    -TargetPath (Join-Path $ProjectRoot "frontend-admin\.env") `
    -Label "frontend-admin\.env"
Write-PlaceholderEnvValueWarning (Join-Path $ProjectRoot ".env")

if (-not $SkipToolInstall) {
    Install-DevelopmentTools
}
else {
    Write-Step "Skipping automatic system tool installation"
    Write-Info "Missing tools will be reported during validation instead of installed automatically"
}

Write-Step "Checking required tools"
if (-not $SkipBackend) {
    Test-RequiredCommand java "Install JDK 25, then run setup.ps1 again."
    Test-RequiredCommand javac "Install JDK 25, then run setup.ps1 again."
    $jdk25Home = Use-Jdk25
    Initialize-MavenToolchain $jdk25Home

    $mysqlExecutable = Find-MySqlExecutable
    if ($mysqlExecutable) {
        Add-UserPathEntry (Split-Path -Parent $mysqlExecutable)
        Write-Info (Get-CommandOutput $mysqlExecutable @("--version"))
    }
    else {
        Write-Warn "MySQL client was not found. Backend dependencies can still be installed, but you need MySQL Server 8.0+ to run the backend locally."
    }
}

if (-not $SkipFrontend) {
    Test-RequiredCommand node "Install Node.js 20.19+, 22.12+, or 24.15+."
    Test-RequiredCommand npm "npm is installed with Node.js."
    Assert-SupportedNodeVersion
    Write-Info "npm $(Get-CommandOutput "npm" @("--version"))"
}

if (-not $SkipService) {
    Test-RequiredCommand python "Install Python 3.11 or newer."
    Assert-SupportedPythonVersion
}

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Info (((Get-CommandOutput "mvn" @("-version")) -split "\r?\n")[0])
}
else {
    Write-Warn "Apache Maven is not on PATH. The backend can still run with .\mvnw.cmd, but setup.ps1 normally installs Maven unless -SkipToolInstall is used."
}

if ((-not $SkipBackend) -and (-not $SkipDatabaseSetup)) {
    $mysqlExecutable = Find-MySqlExecutable
    if ($mysqlExecutable) {
        Initialize-MySqlDatabase -EnvFilePath (Join-Path $ProjectRoot ".env") -MySqlExecutable $mysqlExecutable
    }
    else {
        Write-Warn "Skipping automatic database creation because mysql.exe was not found."
    }
}
elseif ($SkipDatabaseSetup) {
    Write-Step "Skipping automatic database creation"
}

if (-not $SkipBackend) {
    Write-Step "Downloading backend Maven dependencies"
    Push-Location (Join-Path $ProjectRoot "backend")
    try {
        Invoke-CheckedCommand `
            -Command { .\mvnw.cmd dependency:go-offline } `
            -FailureMessage "Backend Maven dependency download failed."
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipFrontend) {
    Install-NpmDependencies -ProjectPath (Join-Path $ProjectRoot "frontend-user") -Label "frontend-user"
    Install-NpmDependencies -ProjectPath (Join-Path $ProjectRoot "frontend-admin") -Label "frontend-admin"
    Install-NpmDependencies -ProjectPath $ProjectRoot -Label "project root"
}

if (-not $SkipService) {
    Write-Step "Creating FastAPI virtual environment and installing Python dependencies"
    Push-Location (Join-Path $ProjectRoot "service")
    try {
        if (-not (Test-Path -LiteralPath ".\venv\Scripts\python.exe")) {
            Invoke-CheckedCommand `
                -Command { python -m venv venv } `
                -FailureMessage "Could not create the FastAPI virtual environment."
        }

        Invoke-CheckedCommand `
            -Command { .\venv\Scripts\python.exe -m pip install --upgrade pip } `
            -FailureMessage "Could not upgrade pip inside service\venv."
        Invoke-CheckedCommand `
            -Command { .\venv\Scripts\python.exe -m pip install -r requirements.txt } `
            -FailureMessage "Could not install FastAPI service dependencies."
    }
    finally {
        Pop-Location
    }
}

Write-Step "Setup complete"
Write-Host "Run backend:  cd backend; .\mvnw.cmd spring-boot:run"
Write-Host "Run user UI:   cd frontend-user; npm run dev"
Write-Host "Run admin UI:  cd frontend-admin; npm run dev"
Write-Host "Run service:   cd service; .\venv\Scripts\Activate.ps1; uvicorn service:app --reload --port 8000"
Write-Host ""
Write-Host "Before first real run, review .env for JWT, Google, Telegram, and mail values that are still project-specific."
