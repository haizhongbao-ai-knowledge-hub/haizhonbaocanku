param(
    [string]$Title = "GPT handoff"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$inboxDir = Join-Path $repoRoot "inbox\gpt-handoffs"

New-Item -ItemType Directory -Force -Path $inboxDir | Out-Null

$content = Get-Clipboard -Raw
if ([string]::IsNullOrWhiteSpace($content)) {
    throw "Clipboard is empty. Copy the GPT handoff text first."
}

$safeTitle = $Title -replace '[\\/:*?"<>|]', '-'
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$filePath = Join-Path $inboxDir "$timestamp-$safeTitle.md"

@"
# $Title

Imported: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Source: ChatGPT

$content
"@ | Set-Content -LiteralPath $filePath -Encoding UTF8

Write-Output "Created $filePath"
Write-Output "Next: run scripts\Import-GptHandoffs.ps1"

