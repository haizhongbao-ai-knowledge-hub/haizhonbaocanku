param(
    [string]$RepoPath = (Split-Path -Parent $PSScriptRoot),
    [switch]$SkipFetch
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Invoke-RepoGit {
    param([string[]]$GitArgs)

    $gitPath = "D:\Administrator\Documents\tools\Git\cmd\git.exe"
    if (Test-Path -LiteralPath $gitPath) {
        & $gitPath -C $RepoPath @GitArgs
    }
    else {
        & git -C $RepoPath @GitArgs
    }
}

function Convert-ToRows {
    param(
        [string[]]$Lines,
        [string]$EmptyMessage
    )

    if (-not $Lines -or $Lines.Count -eq 0) {
        return "| None | None | $EmptyMessage |"
    }

    $rows = foreach ($line in $Lines) {
        $safeLine = $line -replace "\|", "/"
        "| $safeLine | TBD | Codex should review impact scope |"
    }

    return $rows -join "`n"
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$noticeDir = Join-Path $RepoPath "sync_records"
$noticePath = Join-Path $noticeDir "AI_SYNC_NOTICE_$stamp.md"
$fetchStatus = "Skipped"

if (-not $SkipFetch) {
    try {
        Invoke-RepoGit @("fetch", "origin") | Out-Null
        $fetchStatus = "Success"
    }
    catch {
        $fetchStatus = "Failed: $($_.Exception.Message)"
    }
}

$localChanges = Invoke-RepoGit @("status", "--short")

try {
    $cloudChanges = Invoke-RepoGit @("diff", "--name-status", "HEAD..origin/main")
}
catch {
    $cloudChanges = @("Unable to compare HEAD..origin/main: $($_.Exception.Message)")
}

try {
    $localAheadChanges = Invoke-RepoGit @("diff", "--name-status", "origin/main..HEAD")
}
catch {
    $localAheadChanges = @("Unable to compare origin/main..HEAD: $($_.Exception.Message)")
}

$content = @"
# AI Sync Notice

Generated at: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Source: scripts/New-AiSyncNotice.ps1

GitHub check: $fetchStatus

## 1. Uncommitted workspace changes

| File | Change type | Note |
| --- | --- | --- |
$(Convert-ToRows -Lines $localChanges -EmptyMessage "Workspace is clean")

## 2. Cloud changes not yet in local HEAD

| File | Change type | Note |
| --- | --- | --- |
$(Convert-ToRows -Lines $cloudChanges -EmptyMessage "No cloud-ahead changes detected")

## 3. Local commits not yet in cloud

| File | Change type | Note |
| --- | --- | --- |
$(Convert-ToRows -Lines $localAheadChanges -EmptyMessage "No local-ahead commits detected")

## 4. AI impact

| AI | Impact | Must read |
| --- | --- | --- |
| GPT strategy assistant | May need to understand rule, status, or task changes | TBD |
| Codex execution assistant | Must review file, script, Git, or development impact | Yes |
| AI experts | Must read if role, permission, project status, or expert task changed | TBD |

## 5. Boss confirmation

TBD. Boss confirmation is required for constitution rules, permissions, project priority, business goals, cost, external systems, or sensitive data access.

## 6. Codex execution

TBD. Codex execution is required for repository edits, scripts, Git operations, development, templates, or reports.

## 7. Recommended next step

1. Codex reviews whether changes affect rules, permissions, tasks, or project status.
2. If important rules are affected, create a three-party sync record.
3. If changes are archival or formatting only, Codex can archive and report.
4. Update project status overview and handoff after completion.
"@

New-Item -ItemType Directory -Force -Path $noticeDir | Out-Null
Set-Content -LiteralPath $noticePath -Value $content -Encoding UTF8
Write-Output $noticePath
