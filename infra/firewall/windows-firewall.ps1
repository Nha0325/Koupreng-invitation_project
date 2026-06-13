#Requires -RunAsAdministrator

[CmdletBinding()]
param(
    [int]$SshPort = 22,
    [int]$HttpPort = 80,
    [int]$HttpsPort = 443,
    [int]$AppPort = 8080,
    [int]$ManagementPort = 8081,
    [string]$AllowedSshRemoteAddress = "Any",
    [string]$AllowedAppRemoteAddress = "LocalSubnet",
    [string]$AllowedMonitoringRemoteAddress = "LocalSubnet"
)

function Set-KouprengFirewallRule {
    param(
        [string]$Name,
        [string]$DisplayName,
        [int]$Port,
        [string]$RemoteAddress
    )

    $existingRule = Get-NetFirewallRule -Name $Name -ErrorAction SilentlyContinue
    if ($existingRule) {
        Remove-NetFirewallRule -Name $Name
    }

    New-NetFirewallRule `
        -Name $Name `
        -DisplayName $DisplayName `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort $Port `
        -RemoteAddress $RemoteAddress `
        -Profile Domain,Private,Public | Out-Null
}

Set-NetFirewallProfile -Profile Domain,Private,Public -DefaultInboundAction Block -DefaultOutboundAction Allow

Set-KouprengFirewallRule -Name "Koupreng-SSH" -DisplayName "Koupreng SSH" -Port $SshPort -RemoteAddress $AllowedSshRemoteAddress
Set-KouprengFirewallRule -Name "Koupreng-HTTP" -DisplayName "Koupreng HTTP" -Port $HttpPort -RemoteAddress "Any"
Set-KouprengFirewallRule -Name "Koupreng-HTTPS" -DisplayName "Koupreng HTTPS" -Port $HttpsPort -RemoteAddress "Any"
Set-KouprengFirewallRule -Name "Koupreng-App-Private" -DisplayName "Koupreng Backend Private" -Port $AppPort -RemoteAddress $AllowedAppRemoteAddress
Set-KouprengFirewallRule -Name "Koupreng-Monitoring" -DisplayName "Koupreng Monitoring" -Port $ManagementPort -RemoteAddress $AllowedMonitoringRemoteAddress

Get-NetFirewallRule -Name "Koupreng-*" | Get-NetFirewallPortFilter
