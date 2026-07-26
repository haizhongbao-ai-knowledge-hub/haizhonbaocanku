param(
    [switch]$ArchiveOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$inboxDir = Join-Path $repoRoot "inbox\gpt-handoffs"
$archiveDir = Join-Path $repoRoot "archive\gpt-handoffs"
$requirementsPath = Join-Path $repoRoot "REQUIREMENTS_TABLE.md"
$handoffPath = Join-Path $repoRoot "HANDOFF.md"

New-Item -ItemType Directory -Force -Path $inboxDir | Out-Null
New-Item -ItemType Directory -Force -Path $archiveDir | Out-Null

$files = Get-ChildItem -LiteralPath $inboxDir -File | Where-Object { $_.Extension -in ".md", ".txt" }
if (-not $files) {
    Write-Output "No GPT handoff files found in $inboxDir"
    exit 0
}

function Get-NextRequirementId {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return "HZB-0001"
    }

    $content = Get-Content -LiteralPath $Path -Raw
    $matches = [regex]::Matches($content, 'HZB-(\d{4})')
    if ($matches.Count -eq 0) {
        return "HZB-0001"
    }

    $max = 0
    foreach ($match in $matches) {
        $num = [int]$match.Groups[1].Value
        if ($num -gt $max) {
            $max = $num
        }
    }

    return ("HZB-{0:D4}" -f ($max + 1))
}

function Get-FirstUsefulLine {
    param([string]$Text)

    $lines = $Text -split "`r?`n"
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -and -not $trimmed.StartsWith("#") -and -not $trimmed.StartsWith("Imported:") -and -not $trimmed.StartsWith("Source:")) {
            return $trimmed.Replace("|", "/")
        }
    }

    return "GPT handoff"
}

foreach ($file in $files) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $id = Get-NextRequirementId -Path $requirementsPath
    $date = Get-Date -Format "yyyy-MM-dd"
    $title = Get-FirstUsefulLine -Text $content

    $archiveFile = Join-Path $archiveDir "$id-$($file.Name)"
    Move-Item -LiteralPath $file.FullName -Destination $archiveFile

    if (-not $ArchiveOnly) {
        $row = "| $id | $date | ChatGPT | 待确认 | $title | 来自 GPT 交接内容 | 待 Codex 二次复核 | 中 | 整理到项目文件并拆解任务 | 待Codex复核 | $archiveFile | 待检查 | 确认是否执行 |"
        Add-Content -LiteralPath $requirementsPath -Value $row -Encoding UTF8
    }

    $handoffEntry = @"

### $date - $id

**From:** Import-GptHandoffs.ps1

**Summary:** Imported a ChatGPT handoff for Codex review.

**Changed files:**

- `REQUIREMENTS_TABLE.md`
- `$archiveFile`

**Open questions:**

- Does the boss confirm this handoff should enter execution?

**Next recommended step:** Codex should review `$archiveFile` and merge confirmed content into project files.
"@
    Add-Content -LiteralPath $handoffPath -Value $handoffEntry -Encoding UTF8

    Write-Output "Imported $id from $($file.Name)"
}
