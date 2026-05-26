[CmdletBinding()]
param(
    [string]$ConnectionString = $env:POSTGRES_URL,
    [string]$Username = $env:DB_USERNAME,
    [string]$Password = $env:DB_PASSWORD,
    [string]$BackupDir = $(Join-Path $PSScriptRoot "out"),
    [int]$RetentionDays = 30
)

if (-not $ConnectionString -and $env:DB_URL -match '^jdbc:postgresql://(.+)$') {
    $ConnectionString = "postgresql://$($Matches[1])"
}

if (-not $ConnectionString) { throw "POSTGRES_URL or PostgreSQL DB_URL is required." }
if (-not $Username) { throw "DB_USERNAME is required." }
if (-not $Password) { throw "DB_PASSWORD is required." }

New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dumpFile = Join-Path $BackupDir "koupreng-postgres-$timestamp.dump"
$previousPassword = $env:PGPASSWORD

try {
    $env:PGPASSWORD = $Password

    & pg_dump "--dbname=$ConnectionString" "--username=$Username" --format=custom "--file=$dumpFile"
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump failed with exit code $LASTEXITCODE."
    }

    Get-ChildItem -Path $BackupDir -Filter "koupreng-postgres-*.dump" |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
        Remove-Item -Force

    Write-Host "Backup written to $dumpFile"
}
finally {
    $env:PGPASSWORD = $previousPassword
}
