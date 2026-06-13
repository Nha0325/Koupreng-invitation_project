[CmdletBinding()]
param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$SkipService,
    [switch]$SkipToolInstall,
    [switch]$SkipDatabaseSetup,
    [switch]$RunBackend,
    [switch]$RunFrontendUser,
    [switch]$RunFrontendAdmin,
    [switch]$NoInstall
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ProjectRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $ProjectRoot

$ApacheMavenVersion = "3.9.15"
$ToolPackages = @{
    Git = "Git.Git"
    JavaJdk25 = "EclipseAdoptium.Temurin.25.JDK"
    NodeJsLts = "OpenJS.NodeJS.LTS"
    MySqlServer = "Oracle.MySQL"
}

$script:Issues = @()
$script:Summary = [ordered]@{
    "Java" = "Skipped"
    "Node" = "Skipped"
    "npm" = "Skipped"
    "Git" = "Not checked"
    "Maven" = "Not checked"
    "MySQL" = "Skipped"
    "Database" = "Skipped"
    "Backend env" = "Not checked"
    "Frontend-user env" = "Not checked"
    "Frontend-admin env" = "Not checked"
    "Frontend-user dependencies" = "Skipped"
    "Frontend-admin dependencies" = "Skipped"
}

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host $Title -ForegroundColor Cyan
}

function Write-Info {
    param([string]$Message)

    Write-Host "  $Message"
}

function Write-WarnLine {
    param([string]$Message)

    Write-Host "  WARNING: $Message" -ForegroundColor Yellow
}

function Add-Issue {
    param(
        [string]$What,
        [string]$Why,
        [string]$Fix
    )

    $script:Issues += [pscustomobject]@{
        What = $What
        Why = $Why
        Fix = $Fix
    }
}

function Set-Summary {
    param(
        [string]$Name,
        [string]$Value
    )

    $script:Summary[$Name] = $Value
}

function Update-CurrentPath {
    $entries = New-Object System.Collections.Generic.List[string]
    foreach ($sourcePath in @(
        $env:Path,
        [Environment]::GetEnvironmentVariable("Path", "User"),
        [Environment]::GetEnvironmentVariable("Path", "Machine")
    )) {
        if ([string]::IsNullOrWhiteSpace($sourcePath)) {
            continue
        }

        foreach ($entry in ($sourcePath -split ";")) {
            if (-not [string]::IsNullOrWhiteSpace($entry) -and -not $entries.Contains($entry)) {
                [void]$entries.Add($entry)
            }
        }
    }

    $env:Path = $entries -join ";"
}

function Add-SessionPathEntry {
    param([string]$PathEntry)

    if ([string]::IsNullOrWhiteSpace($PathEntry) -or -not (Test-Path -LiteralPath $PathEntry)) {
        return
    }

    $entries = $env:Path -split ";"
    if ($entries -notcontains $PathEntry) {
        $env:Path = "$PathEntry;$env:Path"
    }
}

function Add-UserPathEntry {
    param([string]$PathEntry)

    if ([string]::IsNullOrWhiteSpace($PathEntry) -or -not (Test-Path -LiteralPath $PathEntry)) {
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

    Add-SessionPathEntry $PathEntry
}

function Get-CommandOutput {
    param(
        [string]$Command,
        [string[]]$Arguments = @()
    )

    $output = @()
    try {
        $output = & $Command @Arguments 2>&1
        return ($output | Out-String).Trim()
    }
    catch {
        if ($output) {
            return ($output | Out-String).Trim()
        }
        return $_.Exception.Message
    }
}

function Get-VersionFromText {
    param([string]$Text)

    $match = [regex]::Match($Text, '(\d+)(?:\.(\d+))?(?:\.(\d+))?')
    if (-not $match.Success) {
        return $null
    }

    $major = [int]$match.Groups[1].Value
    $minor = if ($match.Groups[2].Success) { [int]$match.Groups[2].Value } else { 0 }
    $patch = if ($match.Groups[3].Success) { [int]$match.Groups[3].Value } else { 0 }
    return [version]::new($major, $minor, $patch)
}

function Get-JavaMajorFromOutput {
    param([string]$Output)

    $match = [regex]::Match($Output, 'version "([^"]+)"')
    if ($match.Success) {
        $versionText = $match.Groups[1].Value
    }
    else {
        $versionText = $Output
    }

    $version = Get-VersionFromText $versionText
    if (-not $version) {
        return $null
    }

    if ($version.Major -eq 1 -and $version.Minor -gt 0) {
        return $version.Minor
    }

    return $version.Major
}

function Test-WinGetAvailable {
    return [bool](Get-Command winget -ErrorAction SilentlyContinue)
}

function Get-ManualInstallHint {
    param([string]$Tool)

    switch ($Tool) {
        "Git" { return "Install Git for Windows from https://git-scm.com/download/win, open a new PowerShell window, then rerun setup.ps1." }
        "JDK 25" { return "Install JDK 25 from https://adoptium.net/temurin/releases/?version=25, set JAVA_HOME to the JDK folder, open a new PowerShell window, then rerun setup.ps1." }
        "Node.js" { return "Install Node.js 20 LTS or newer from https://nodejs.org/en/download, open a new PowerShell window, then rerun setup.ps1." }
        "MySQL Server" { return "Install MySQL Server from https://dev.mysql.com/downloads/mysql/, configure the server, start MySQL, then rerun setup.ps1." }
        "Apache Maven" { return "Install Maven from https://maven.apache.org/download.cgi or rely on apps\\backend\\mvnw.cmd for backend commands." }
        default { return "Install $Tool manually, open a new PowerShell window, then rerun setup.ps1." }
    }
}

function Install-WinGetPackage {
    param(
        [string]$Id,
        [string]$Label
    )

    if ($SkipToolInstall -or $NoInstall) {
        Add-Issue $Label "$Label is missing and automatic tool installation is disabled." (Get-ManualInstallHint $Label)
        return $false
    }

    if (-not (Test-WinGetAvailable)) {
        Add-Issue $Label "WinGet was not found on this PC." "Install App Installer/WinGet from Microsoft Store, or install $Label manually. You can also rerun with -SkipToolInstall after installing tools."
        return $false
    }

    Write-Info "Trying to install $Label with WinGet..."
    & winget install --id $Id --exact --source winget --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
    if ($LASTEXITCODE -ne 0) {
        Add-Issue $Label "WinGet could not install $Label. This can happen without admin permission or when installer prompts are blocked." (Get-ManualInstallHint $Label)
        return $false
    }

    Update-CurrentPath
    return $true
}

function Invoke-NativeCommand {
    param(
        [scriptblock]$Command,
        [string]$FailureMessage
    )

    & $Command
    if ($LASTEXITCODE -ne $null -and $LASTEXITCODE -ne 0) {
        throw $FailureMessage
    }
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

function Initialize-EnvFile {
    param(
        [string]$ExamplePath,
        [string]$TargetPath,
        [string]$Label
    )

    if (Test-Path -LiteralPath $TargetPath) {
        Write-Info "$Label already exists"
        return "exists"
    }

    if (-not (Test-Path -LiteralPath $ExamplePath)) {
        Add-Issue $Label "Template file '$ExamplePath' was not found." "Restore the missing .env.example file, then rerun setup.ps1."
        return "missing template"
    }

    Copy-Item -LiteralPath $ExamplePath -Destination $TargetPath
    Write-Info "Created $Label from $ExamplePath"
    return "created"
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

    Set-Content -LiteralPath $EnvFilePath -Value $lines -Encoding UTF8
}

function Test-PlaceholderValue {
    param([string]$Value)

    return [string]::IsNullOrWhiteSpace($Value) -or ($Value -match 'change_me|replace_with|your_|change_this')
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

function Find-Jdk25Home {
    $candidateHomes = @()

    if ($env:JAVA_HOME) {
        $candidateHomes += $env:JAVA_HOME.TrimEnd("\")
    }

    $javacCommand = Get-Command javac -ErrorAction SilentlyContinue
    if ($javacCommand -and $javacCommand.Source) {
        $candidateHomes += Split-Path -Parent (Split-Path -Parent $javacCommand.Source)
    }

    $searchRoots = @(
        "C:\Program Files\Java",
        "C:\Program Files\Eclipse Adoptium",
        "C:\Program Files\Microsoft",
        "C:\Program Files\Zulu",
        "C:\Program Files\Amazon Corretto"
    )

    foreach ($root in $searchRoots) {
        if (Test-Path -LiteralPath $root) {
            $children = Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue
            $candidateHomes += $children | Select-Object -ExpandProperty FullName
            foreach ($child in $children) {
                $candidateHomes += Get-ChildItem -LiteralPath $child.FullName -Directory -ErrorAction SilentlyContinue |
                    Select-Object -ExpandProperty FullName
            }
        }
    }

    $candidateHomes = $candidateHomes | Where-Object { $_ } | Select-Object -Unique

    foreach ($candidateHome in $candidateHomes) {
        $javacPath = Join-Path $candidateHome "bin\javac.exe"
        if (-not (Test-Path -LiteralPath $javacPath)) {
            continue
        }

        $versionOutput = Get-CommandOutput $javacPath @("-version")
        $major = Get-JavaMajorFromOutput $versionOutput
        if ($major -eq 25) {
            return $candidateHome
        }
    }

    return $null
}

function Initialize-MavenToolchain {
    param([string]$JdkHome)

    $m2Directory = Join-Path $HOME ".m2"
    $toolchainsPath = Join-Path $m2Directory "toolchains.xml"

    if (-not (Test-Path -LiteralPath $m2Directory)) {
        New-Item -ItemType Directory -Path $m2Directory -Force | Out-Null
    }

    if (Test-Path -LiteralPath $toolchainsPath) {
        try {
            [xml]$xml = Get-Content -LiteralPath $toolchainsPath -Raw
        }
        catch {
            Add-Issue "Maven toolchains" "Could not parse '$toolchainsPath'." "Fix or rename that file, then rerun setup.ps1."
            return
        }
    }
    else {
        [xml]$xml = '<?xml version="1.0" encoding="UTF-8"?><toolchains></toolchains>'
    }

    $toolchainsNode = $xml.SelectSingleNode("/toolchains")
    if (-not $toolchainsNode) {
        Add-Issue "Maven toolchains" "'$toolchainsPath' does not contain a <toolchains> root element." "Fix or rename that file, then rerun setup.ps1."
        return
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

function Install-ApacheMaven {
    param([string]$Version = $ApacheMavenVersion)

    if ($SkipToolInstall -or $NoInstall) {
        Add-Issue "Apache Maven" "The mvn command is missing and automatic install is disabled." (Get-ManualInstallHint "Apache Maven")
        return $false
    }

    Write-Info "Trying to install Apache Maven $Version from Apache..."

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
        New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

        $zipPath = Join-Path $tempRoot "apache-maven-$Version-bin.zip"
        $shaPath = "$zipPath.sha512"
        $downloadCandidates = @(
            "https://dlcdn.apache.org/maven/maven-3/$Version/binaries/apache-maven-$Version-bin.zip",
            "https://archive.apache.org/dist/maven/maven-3/$Version/binaries/apache-maven-$Version-bin.zip"
        )

        $downloaded = $false
        foreach ($downloadUrl in $downloadCandidates) {
            try {
                Invoke-WebRequest -UseBasicParsing -Uri $downloadUrl -OutFile $zipPath
                Invoke-WebRequest -UseBasicParsing -Uri "$downloadUrl.sha512" -OutFile $shaPath
                $downloaded = $true
                break
            }
            catch {
                Write-WarnLine "Could not download from $downloadUrl"
            }
        }

        if (-not $downloaded) {
            Add-Issue "Apache Maven" "Could not download Apache Maven $Version from the Apache download or archive URLs." (Get-ManualInstallHint "Apache Maven")
            return $false
        }

        $expectedSha512 = ((Get-Content -LiteralPath $shaPath -Raw).Trim() -split "\s+")[0].ToUpperInvariant()
        $actualSha512 = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA512).Hash.ToUpperInvariant()
        if ($expectedSha512 -ne $actualSha512) {
            Add-Issue "Apache Maven" "Checksum verification failed for the downloaded Maven zip." "Delete the temporary Maven download folder under $tempRoot, then rerun setup.ps1."
            return $false
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

    return [bool](Get-Command mvn -ErrorAction SilentlyContinue)
}

function Find-MySqlExecutable {
    $mysqlCommand = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysqlCommand -and $mysqlCommand.Source) {
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

function Start-MySqlServiceIfPossible {
    $service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue |
        Sort-Object Name |
        Select-Object -First 1

    if (-not $service) {
        Add-Issue "MySQL service" "No MySQL Windows service was found. MySQL Workbench alone is not enough; MySQL Server must be installed and configured." "Install/configure MySQL Server, start it from Services or MySQL Installer, then rerun setup.ps1."
        return $false
    }

    if ($service.Status -ne "Running") {
        try {
            Write-Info "Trying to start MySQL service '$($service.Name)'..."
            Start-Service -Name $service.Name
            $service.WaitForStatus("Running", [timespan]::FromSeconds(20))
        }
        catch {
            Add-Issue "MySQL service" "MySQL service '$($service.Name)' exists but could not be started automatically." "Start MySQL manually from Services or MySQL Installer, then rerun setup.ps1."
            return $false
        }
    }

    Write-Info "MySQL service '$($service.Name)' is running"
    return $true
}

function ConvertFrom-JdbcMySqlUrl {
    param([string]$JdbcUrl)

    $match = [regex]::Match($JdbcUrl, '^jdbc:mysql://([^/:?]+)(?::(\d+))?/([^?]+)')
    if (-not $match.Success) {
        throw "Could not parse DB_URL '$JdbcUrl'. Expected jdbc:mysql://localhost:3306/koupreng_db?..."
    }

    return [pscustomobject]@{
        Host = $match.Groups[1].Value
        Port = if ($match.Groups[2].Success) { $match.Groups[2].Value } else { "3306" }
        Database = $match.Groups[3].Value
    }
}

function Invoke-MySqlSql {
    param(
        [string]$MySqlExecutable,
        [string]$HostName,
        [string]$Port,
        [string]$Username,
        [securestring]$Password,
        [string]$Sql,
        [string]$FailureMessage
    )

    $previousMySqlPassword = $env:MYSQL_PWD
    try {
        $env:MYSQL_PWD = Convert-SecureStringToPlainText $Password
        $output = & $MySqlExecutable "--host=$HostName" "--port=$Port" "--user=$Username" "--connect-timeout=5" "--execute=$Sql" 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0) {
            throw "$FailureMessage $($output.Trim())"
        }
    }
    finally {
        $env:MYSQL_PWD = $previousMySqlPassword
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

    if ($NoInstall) {
        Write-Info "Skipping $Label dependencies because -NoInstall was provided"
        Set-Summary "$Label dependencies" "Skipped by -NoInstall"
        return
    }

    $packageJsonPath = Join-Path $ProjectPath "package.json"
    if (-not (Test-PackageJsonHasDependencies $packageJsonPath)) {
        Write-Info "Skipping $Label because it has no npm dependencies"
        Set-Summary "$Label dependencies" "No dependencies"
        return
    }

    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Add-Issue "$Label dependencies" "npm was not found, so dependencies could not be installed." "Install Node.js 20 LTS or newer, open a new PowerShell window, then rerun setup.ps1."
        Set-Summary "$Label dependencies" "Failed"
        return
    }

    Push-Location $ProjectPath
    try {
        if ((Test-Path -LiteralPath ".\package-lock.json") -and -not (Test-Path -LiteralPath ".\node_modules")) {
            Write-Info "Running npm ci for $Label"
            Invoke-NativeCommand `
                -Command { npm ci --no-audit --no-fund } `
                -FailureMessage "npm ci failed for $Label. Delete node_modules and package-lock.json only if your team agrees, then run npm install."
        }
        else {
            Write-Info "Running npm install for $Label"
            Invoke-NativeCommand `
                -Command { npm install --no-audit --no-fund } `
                -FailureMessage "npm install failed for $Label. Stop any running dev server and rerun setup.ps1."
        }

        Set-Summary "$Label dependencies" "Ready"
    }
    catch {
        Add-Issue "$Label dependencies" $_.Exception.Message "Delete node_modules and package-lock.json only if your team agrees, then run npm install."
        Set-Summary "$Label dependencies" "Failed"
    }
    finally {
        Pop-Location
    }
}

function Start-DevCommand {
    param(
        [string]$Label,
        [string]$WorkingDirectory,
        [string]$Command
    )

    $escapedPath = $WorkingDirectory.Replace("'", "''")
    $escapedCommand = $Command.Replace("'", "''")
    Write-Info "Starting $Label in a new PowerShell window"
    Start-Process -FilePath "powershell.exe" -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-Command", "Set-Location -LiteralPath '$escapedPath'; $escapedCommand"
    )
}

Write-Host ""
Write-Host "Koupreng Windows Setup" -ForegroundColor Green

Write-Section "[1/8] Preparing env files"
try {
    $backendEnv = Join-Path $ProjectRoot "apps\backend\.env"
    $frontendUserEnv = Join-Path $ProjectRoot "apps\frontend-user\.env.local"
    $frontendAdminEnv = Join-Path $ProjectRoot "apps\frontend-admin\.env.local"

    Initialize-EnvFile `
        -ExamplePath (Join-Path $ProjectRoot "apps\backend\.env.example") `
        -TargetPath $backendEnv `
        -Label "apps\backend\.env" | Out-Null
    Initialize-EnvFile `
        -ExamplePath (Join-Path $ProjectRoot "apps\frontend-user\.env.example") `
        -TargetPath $frontendUserEnv `
        -Label "apps\frontend-user\.env.local" | Out-Null
    Initialize-EnvFile `
        -ExamplePath (Join-Path $ProjectRoot "apps\frontend-admin\.env.example") `
        -TargetPath $frontendAdminEnv `
        -Label "apps\frontend-admin\.env.local" | Out-Null

    if (Test-Path -LiteralPath $frontendUserEnv) {
        if (-not (Get-EnvValue $frontendUserEnv "VITE_API_URL")) {
            Set-EnvValue $frontendUserEnv "VITE_API_URL" "http://localhost:8080/api"
        }
        Set-Summary "Frontend-user env" "Ready"
    }

    if (Test-Path -LiteralPath $frontendAdminEnv) {
        if (-not (Get-EnvValue $frontendAdminEnv "VITE_API_URL")) {
            Set-EnvValue $frontendAdminEnv "VITE_API_URL" "http://localhost:8080/api"
        }
        Set-Summary "Frontend-admin env" "Ready"
    }

    if (Test-Path -LiteralPath $backendEnv) {
        $dbUrl = Get-EnvValue $backendEnv "DB_URL"
        if ([string]::IsNullOrWhiteSpace($dbUrl)) {
            Set-EnvValue $backendEnv "DB_URL" "jdbc:mysql://localhost:3306/koupreng_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Phnom_Penh&allowPublicKeyRetrieval=true"
        }
        elseif ($dbUrl -notmatch '^jdbc:mysql://') {
            Add-Issue "apps\backend\.env" "DB_URL is not a MySQL JDBC URL. This project now uses MySQL only." "Edit apps\backend\.env so DB_URL starts with jdbc:mysql://, then rerun setup.ps1."
        }

        if (-not (Get-EnvValue $backendEnv "DB_USERNAME")) {
            Set-EnvValue $backendEnv "DB_USERNAME" "root"
        }
        if (-not (Get-EnvValue $backendEnv "DB_PASSWORD")) {
            Set-EnvValue $backendEnv "DB_PASSWORD" "change_me"
        }
        Set-Summary "Backend env" "Ready"
    }

    foreach ($legacyFrontendEnv in @(
        (Join-Path $ProjectRoot "apps\frontend-user\.env"),
        (Join-Path $ProjectRoot "apps\frontend-admin\.env")
    )) {
        if (Test-Path -LiteralPath $legacyFrontendEnv) {
            Write-WarnLine "Legacy file '$legacyFrontendEnv' exists. Vite local setup now uses .env.local; this script will not delete your old file."
        }
    }
}
catch {
    Add-Issue "env files" $_.Exception.Message "Check .env.example files and rerun setup.ps1."
}

Write-Section "[2/8] Checking Windows tools"
try {
    Update-CurrentPath

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        [void](Install-WinGetPackage -Id $ToolPackages.Git -Label "Git")
        Update-CurrentPath
    }

    if (Get-Command git -ErrorAction SilentlyContinue) {
        Set-Summary "Git" (Get-CommandOutput "git" @("--version"))
        Write-Info $script:Summary["Git"]
    }
    else {
        Set-Summary "Git" "Missing"
        Add-Issue "Git" "git was not found." (Get-ManualInstallHint "Git")
    }

    if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
        [void](Install-ApacheMaven)
        Update-CurrentPath
    }

    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        $mavenVersionLine = ((Get-CommandOutput "mvn" @("-version")) -split "\r?\n")[0]
        Set-Summary "Maven" $mavenVersionLine
        Write-Info $mavenVersionLine
    }
    elseif (Test-Path -LiteralPath (Join-Path $ProjectRoot "apps\backend\mvnw.cmd")) {
        Set-Summary "Maven" "Global mvn missing; backend Maven wrapper is available"
        Write-WarnLine "Global mvn is missing, but apps\backend\mvnw.cmd is available."
    }
    else {
        Set-Summary "Maven" "Missing"
        Add-Issue "Apache Maven" "Neither mvn nor apps\backend\mvnw.cmd was found." (Get-ManualInstallHint "Apache Maven")
    }

    if (-not (Test-WinGetAvailable)) {
        Write-WarnLine "WinGet is not available. Automatic tool installation may not work on this PC."
    }
}
catch {
    Add-Issue "Windows tools" $_.Exception.Message "Install missing tools manually, then rerun setup.ps1 -SkipToolInstall."
}

Write-Section "[3/8] Checking Java"
if ($SkipBackend) {
    Set-Summary "Java" "Skipped by -SkipBackend"
    Write-Info "Skipping Java because -SkipBackend was provided"
}
else {
    try {
        $currentJava = if (Get-Command java -ErrorAction SilentlyContinue) { Get-CommandOutput "java" @("-version") } else { "<java not found>" }
        $currentJavaLine = (($currentJava -split "\r?\n") | Select-Object -First 1)
        $currentJavaHome = if ($env:JAVA_HOME) { $env:JAVA_HOME } else { "<not set>" }
        Write-Info "Current java: $currentJavaLine"
        Write-Info "Current JAVA_HOME: $currentJavaHome"

        $jdk25Home = Find-Jdk25Home
        if (-not $jdk25Home) {
            [void](Install-WinGetPackage -Id $ToolPackages.JavaJdk25 -Label "JDK 25")
            Update-CurrentPath
            $jdk25Home = Find-Jdk25Home
        }

        if (-not $jdk25Home) {
            Set-Summary "Java" "JDK 25 missing"
            Add-Issue "Java" "JDK 25 was not found. The backend pom.xml requires Java 25." "Install JDK 25 from https://adoptium.net/temurin/releases/?version=25, set JAVA_HOME to that JDK folder for your user, open a new PowerShell window, then rerun setup.ps1."
        }
        else {
            $env:JAVA_HOME = $jdk25Home
            Add-SessionPathEntry (Join-Path $jdk25Home "bin")
            $javaLine = ((Get-CommandOutput (Join-Path $jdk25Home "bin\java.exe") @("-version")) -split "\r?\n")[0]
            Write-Info "Using JAVA_HOME for this setup session: $jdk25Home"
            Write-Info $javaLine
            Initialize-MavenToolchain $jdk25Home
            Set-Summary "Java" $javaLine
        }
    }
    catch {
        Set-Summary "Java" "Failed"
        Add-Issue "Java" $_.Exception.Message "Install JDK 25 manually, set JAVA_HOME for your user, open a new PowerShell window, then rerun setup.ps1."
    }
}

Write-Section "[4/8] Checking Node and npm"
if ($SkipFrontend) {
    Set-Summary "Node" "Skipped by -SkipFrontend"
    Set-Summary "npm" "Skipped by -SkipFrontend"
    Write-Info "Skipping Node/npm because -SkipFrontend was provided"
}
else {
    try {
        if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
            [void](Install-WinGetPackage -Id $ToolPackages.NodeJsLts -Label "Node.js")
            Update-CurrentPath
        }

        if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
            Set-Summary "Node" "Missing"
            Add-Issue "Node.js" "node was not found." (Get-ManualInstallHint "Node.js")
        }
        else {
            $nodeRaw = Get-CommandOutput "node" @("--version")
            $nodeVersion = Get-VersionFromText $nodeRaw
            Write-Info "Node.js $nodeRaw"
            if (-not $nodeVersion -or $nodeVersion -lt [version]"20.19.0") {
                Set-Summary "Node" "Unsupported $nodeRaw"
                Add-Issue "Node.js" "Installed Node version is $nodeRaw. This project needs Node.js 20.19 or newer." (Get-ManualInstallHint "Node.js")
            }
            else {
                Set-Summary "Node" "Node.js $nodeRaw"
            }
        }

        if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
            Set-Summary "npm" "Missing"
            Add-Issue "npm" "npm was not found even though Node may be installed." "Reinstall Node.js with npm included, open a new PowerShell window, then rerun setup.ps1."
        }
        else {
            $npmVersion = Get-CommandOutput "npm" @("--version")
            Write-Info "npm $npmVersion"
            Set-Summary "npm" "npm $npmVersion"
        }
    }
    catch {
        Set-Summary "Node" "Failed"
        Set-Summary "npm" "Failed"
        Add-Issue "Node/npm" $_.Exception.Message "Install Node.js 20 LTS or newer with npm, open a new PowerShell window, then rerun setup.ps1."
    }
}

Write-Section "[5/8] Checking MySQL"
$mysqlExecutable = $null
if ($SkipBackend) {
    Set-Summary "MySQL" "Skipped by -SkipBackend"
    Write-Info "Skipping MySQL because -SkipBackend was provided"
}
else {
    try {
        $mysqlExecutable = Find-MySqlExecutable
        if (-not $mysqlExecutable) {
            [void](Install-WinGetPackage -Id $ToolPackages.MySqlServer -Label "MySQL Server")
            Update-CurrentPath
            $mysqlExecutable = Find-MySqlExecutable
        }

        if (-not $mysqlExecutable) {
            Set-Summary "MySQL" "Missing"
            Add-Issue "MySQL Server" "MySQL Server was not found. mysql.exe is not in PATH or the standard MySQL Server folders." "Install MySQL Server, then run setup.ps1 again."
        }
        else {
            Add-SessionPathEntry (Split-Path -Parent $mysqlExecutable)
            $mysqlVersion = Get-CommandOutput $mysqlExecutable @("--version")
            Write-Info $mysqlVersion
            [void](Start-MySqlServiceIfPossible)
            Set-Summary "MySQL" $mysqlVersion
        }
    }
    catch {
        Set-Summary "MySQL" "Failed"
        Add-Issue "MySQL" $_.Exception.Message "Install/configure MySQL Server, start it manually from Services or MySQL Installer, then rerun setup.ps1."
    }
}

Write-Section "[6/8] Creating MySQL database"
if ($SkipBackend) {
    Set-Summary "Database" "Skipped by -SkipBackend"
    Write-Info "Skipping database setup because -SkipBackend was provided"
}
elseif ($SkipDatabaseSetup) {
    Set-Summary "Database" "Skipped by -SkipDatabaseSetup"
    Write-Info "Skipping database setup because -SkipDatabaseSetup was provided"
}
else {
    try {
        if (-not $mysqlExecutable) {
            $mysqlExecutable = Find-MySqlExecutable
        }

        if (-not $mysqlExecutable) {
            Set-Summary "Database" "Skipped - MySQL missing"
            Add-Issue "Database" "Cannot create database because mysql.exe was not found." "Install MySQL Server, then rerun setup.ps1."
        }
        elseif (-not (Test-Path -LiteralPath $backendEnv)) {
            Set-Summary "Database" "Skipped - backend env missing"
            Add-Issue "Database" "apps\backend\.env does not exist." "Copy apps\backend\.env.example to apps\backend\.env, update DB credentials, then rerun setup.ps1."
        }
        else {
            $dbUrl = Get-EnvValue $backendEnv "DB_URL"
            $username = Get-EnvValue $backendEnv "DB_USERNAME"
            $password = Get-EnvValue $backendEnv "DB_PASSWORD"

            if ([string]::IsNullOrWhiteSpace($username)) {
                $username = "root"
                Set-EnvValue $backendEnv "DB_USERNAME" $username
            }

            if (Test-PlaceholderValue $password) {
                Write-Info "DB_PASSWORD is still a placeholder. Enter the local MySQL password for '$username'."
                Write-Info "Press Enter if your local MySQL user has an empty password."
                $securePassword = Read-Host "MySQL password" -AsSecureString
                $plainPassword = Convert-SecureStringToPlainText $securePassword
                Set-EnvValue $backendEnv "DB_PASSWORD" $plainPassword
                $password = $plainPassword
                $plainPassword = $null
            }

            $connection = ConvertFrom-JdbcMySqlUrl $dbUrl
            if ($connection.Database -notmatch '^[A-Za-z0-9_]+$') {
                throw "Database name '$($connection.Database)' is not supported by automatic setup. Use letters, numbers, and underscores."
            }

            $securePasswordForConnect = ConvertTo-SecureString -String $password -AsPlainText -Force

            Invoke-MySqlSql `
                -MySqlExecutable $mysqlExecutable `
                -HostName $connection.Host `
                -Port $connection.Port `
                -Username $username `
                -Password $securePasswordForConnect `
                -Sql "SELECT 1;" `
                -FailureMessage "Could not connect to MySQL using apps\backend\.env credentials."

            $createDatabaseSql = "CREATE DATABASE IF NOT EXISTS ``$($connection.Database)`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            Invoke-MySqlSql `
                -MySqlExecutable $mysqlExecutable `
                -HostName $connection.Host `
                -Port $connection.Port `
                -Username $username `
                -Password $securePasswordForConnect `
                -Sql $createDatabaseSql `
                -FailureMessage "Connected to MySQL, but could not create database '$($connection.Database)'."

            Write-Info "Database '$($connection.Database)' is ready"
            Set-Summary "Database" "Ready"
        }
    }
    catch {
        Set-Summary "Database" "Failed"
        Add-Issue "Database" $_.Exception.Message "Update apps\backend\.env with the correct DB_USERNAME and DB_PASSWORD, make sure MySQL is running, then rerun setup.ps1."
    }
}

Write-Section "[7/8] Installing frontend dependencies"
if ($SkipFrontend) {
    Set-Summary "Frontend-user dependencies" "Skipped by -SkipFrontend"
    Set-Summary "Frontend-admin dependencies" "Skipped by -SkipFrontend"
    Write-Info "Skipping frontend dependencies because -SkipFrontend was provided"
}
else {
    Install-NpmDependencies -ProjectPath (Join-Path $ProjectRoot "apps\frontend-user") -Label "Frontend-user"
    Install-NpmDependencies -ProjectPath (Join-Path $ProjectRoot "apps\frontend-admin") -Label "Frontend-admin"
}

if (-not $SkipService) {
    $servicePath = Join-Path $ProjectRoot "service"
    if (-not (Test-Path -LiteralPath $servicePath)) {
        Write-Info "No service folder exists in this checkout; skipping legacy service setup."
    }
}

Write-Section "[8/8] Setup complete"
Write-Host ""
Write-Host "Setup completed."
Write-Host ""
Write-Host "Summary:"
foreach ($key in $script:Summary.Keys) {
    Write-Host ("- {0}: {1}" -f $key, $script:Summary[$key])
}

if ($script:Issues.Count -gt 0) {
    Write-Host ""
    Write-Host "Some setup steps need manual action:" -ForegroundColor Yellow
    foreach ($issue in $script:Issues) {
        Write-Host ""
        Write-Host "- What failed: $($issue.What)"
        Write-Host "  Why: $($issue.Why)"
        Write-Host "  Manual fix: $($issue.Fix)"
    }

    Write-Host ""
    Write-Host "After fixing the issue, rerun:"
    Write-Host "powershell -ExecutionPolicy Bypass -File .\setup.ps1"
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start backend:"
Write-Host "   cd apps/backend"
Write-Host "   .\mvnw spring-boot:run"
Write-Host ""
Write-Host "2. Start frontend user:"
Write-Host "   cd apps/frontend-user"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Start frontend admin:"
Write-Host "   cd apps/frontend-admin"
Write-Host "   npm run dev"

if ($RunBackend) {
    Start-DevCommand -Label "backend" -WorkingDirectory (Join-Path $ProjectRoot "apps/backend") -Command ".\mvnw.cmd spring-boot:run"
}

if ($RunFrontendUser) {
    Start-DevCommand -Label "frontend user" -WorkingDirectory (Join-Path $ProjectRoot "apps/frontend-user") -Command "npm run dev"
}

if ($RunFrontendAdmin) {
    Start-DevCommand -Label "frontend admin" -WorkingDirectory (Join-Path $ProjectRoot "apps/frontend-admin") -Command "npm run dev"
}

if ($script:Issues.Count -gt 0) {
    exit 1
}
