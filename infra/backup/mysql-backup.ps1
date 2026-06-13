[CmdletBinding()]
param(
    [string]$Database = $env:MYSQL_DATABASE,
    [string]$HostName = $env:MYSQL_HOST,
    [int]$Port = $(if ($env:MYSQL_PORT) { [int]$env:MYSQL_PORT } else { 3306 }),
    [string]$Username = $env:DB_USERNAME,
    [string]$Password = $env:DB_PASSWORD,
    [string]$BackupDir = $(Join-Path $PSScriptRoot "out"),
    [int]$RetentionDays = 30,
    [string]$SslMode = $(if ($env:MYSQL_SSL_MODE) { $env:MYSQL_SSL_MODE } else { "PREFERRED" })
)

if ((-not $HostName -or -not $Database) -and $env:DB_URL -match '^jdbc:mysql://([^/:?]+)(?::(\d+))?/([^?]+)') {
    $HostName = $Matches[1]
    if ($Matches[2]) {
        $Port = [int]$Matches[2]
    }
    $Database = $Matches[3]
}

if (-not $HostName) { throw "MYSQL_HOST or DB_URL is required." }
if (-not $Database) { throw "MYSQL_DATABASE or a database name in DB_URL is required." }
if (-not $Username) { throw "DB_USERNAME is required." }
if (-not $Password) { throw "DB_PASSWORD is required." }

New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dumpFile = Join-Path $BackupDir "koupreng-mysql-$timestamp.sql"
$archiveFile = Join-Path $BackupDir "koupreng-mysql-$timestamp.zip"
$defaultsFile = Join-Path ([System.IO.Path]::GetTempPath()) "koupreng-mysql-$([guid]::NewGuid()).cnf"

try {
    @"
[client]
user=$Username
password=$Password
host=$HostName
port=$Port
ssl-mode=$SslMode
"@ | Set-Content -Path $defaultsFile -Encoding ascii

    & mysqldump "--defaults-extra-file=$defaultsFile" `
        --single-transaction `
        --routines `
        --triggers `
        --events `
        --hex-blob `
        "--result-file=$dumpFile" `
        --databases $Database

    if ($LASTEXITCODE -ne 0) {
        throw "mysqldump failed with exit code $LASTEXITCODE."
    }

    Compress-Archive -Path $dumpFile -DestinationPath $archiveFile -Force
    Remove-Item -Path $dumpFile -Force

    Get-ChildItem -Path $BackupDir -Filter "koupreng-mysql-*.zip" |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
        Remove-Item -Force

    Write-Host "Backup written to $archiveFile"
}
finally {
    Remove-Item -Path $defaultsFile -Force -ErrorAction SilentlyContinue
}
