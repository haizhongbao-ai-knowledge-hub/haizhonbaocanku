param(
    [Parameter(Mandatory = $true)]
    [string]$MeetingId,

    [Parameter(Mandatory = $true)]
    [string]$MeetingName,

    [string]$MeetingType = "General",
    [string]$Requester = "TBD",
    [string]$Question = "TBD",
    [string]$TemplateVersion = "V1.0",
    [string]$RepoPath = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($RepoPath)) {
    $RepoPath = Split-Path -Parent $PSScriptRoot
}

$projectsDir = Join-Path $RepoPath "projects"
$projectDir = Get-ChildItem -LiteralPath $projectsDir -Directory |
    Where-Object { $_.Name -like "AI*" } |
    Select-Object -First 1 -ExpandProperty FullName

if ([string]::IsNullOrWhiteSpace($projectDir)) {
    throw "AI committee project directory not found under projects."
}

$templateDir = Join-Path $projectDir "templates"
$versionedTemplateDir = Join-Path $templateDir $TemplateVersion
if (Test-Path -LiteralPath $versionedTemplateDir) {
    $templateDir = $versionedTemplateDir
}
$meetingRoot = Join-Path $projectDir "meetings"
$safeName = ($MeetingName -replace '[\\/:*?"<>|]', '_')
$meetingDir = Join-Path $meetingRoot ($MeetingId + "_" + $safeName)

New-Item -ItemType Directory -Force -Path $meetingDir | Out-Null

$templateSuffix = ([string][char]0x6A21) + ([string][char]0x677F)
$templates = Get-ChildItem -LiteralPath $templateDir -File -Filter "*.md" |
    Where-Object { $_.Name -ne "README.md" }

foreach ($template in $templates) {
    $targetName = $template.Name.Replace($templateSuffix, "")
    Copy-Item -LiteralPath $template.FullName -Destination (Join-Path $meetingDir $targetName) -Force
}

$info = @(
    "# Meeting Created",
    "",
    "MeetingId: $MeetingId",
    "",
    "MeetingName: $MeetingName",
    "",
    "MeetingType: $MeetingType",
    "",
    "Requester: $Requester",
    "",
    "CreatedAt: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))",
    "",
    "Status: Created, pending AI secretary review",
    "",
    "## Original Question",
    "",
    $Question,
    "",
    "## Required Files",
    "",
    "- 001",
    "- 002",
    "- 003",
    "- 004",
    "- 005",
    "- 006",
    "- 007"
)

Set-Content -LiteralPath (Join-Path $meetingDir "README.md") -Value $info -Encoding UTF8

Write-Output $meetingDir
