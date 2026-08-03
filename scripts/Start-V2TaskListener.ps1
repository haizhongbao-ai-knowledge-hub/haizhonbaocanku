[CmdletBinding()]
param(
    [string]$RepoPath = (Split-Path -Parent $PSScriptRoot),
    [int]$IntervalSeconds = 60,
    [int]$MaxScans = 0
)

$ErrorActionPreference = 'Stop'
$git = if (Test-Path 'D:\HZB_AI_Central_Brain\Git\cmd\git.exe') {
    'D:\HZB_AI_Central_Brain\Git\cmd\git.exe'
} else {
    (Get-Command git -ErrorAction Stop).Source
}

$queueRoot = Join-Path $RepoPath 'runtime\task_queue'
$queueDirs = Get-ChildItem -LiteralPath $queueRoot -Directory
$dispatchPath = ($queueDirs | Where-Object Name -like '02_*' | Select-Object -First 1).FullName
$runningPath = ($queueDirs | Where-Object Name -like '03_*' | Select-Object -First 1).FullName
$approvalPath = ($queueDirs | Where-Object Name -like '04_*' | Select-Object -First 1).FullName
$completedPath = ($queueDirs | Where-Object Name -like '05_*' | Select-Object -First 1).FullName
$claimsPath = Join-Path $queueRoot 'claims'
$claimLog = Join-Path $claimsPath 'V2_LISTENER.log'
$heartbeatPath = (Get-ChildItem -LiteralPath $RepoPath -Recurse -File -Filter 'V2_HEARTBEAT.md' | Select-Object -First 1).FullName
$fields = @{
    Status = ([string][char]0x72B6 + [char]0x6001)
    CurrentTask = ([string][char]0x5F53 + [char]0x524D + [char]0x4EFB + [char]0x52A1)
    CurrentTaskId = ([string][char]0x5F53 + [char]0x524D + [char]0x4EFB + [char]0x52A1 + [char]0x7F16 + [char]0x53F7)
    TaskStatus = ([string][char]0x4EFB + [char]0x52A1 + [char]0x72B6 + [char]0x6001)
    Progress = ([string][char]0x5B8C + [char]0x6210 + [char]0x8FDB + [char]0x5EA6)
    Lock = ([string][char]0x9501 + [char]0x5B9A + [char]0x6587 + [char]0x4EF6)
    Load = ([string][char]0x5F53 + [char]0x524D + [char]0x8D1F + [char]0x8F7D)
    LastUpdate = ([string][char]0x6700 + [char]0x540E + [char]0x66F4 + [char]0x65B0 + [char]0x65F6 + [char]0x95F4)
}
$mutex = [Threading.Mutex]::new($false, 'HZB-V2-TaskListener')
$hasMutex = $false

function Invoke-Git {
    param([Parameter(Mandatory)][string[]]$Arguments)
    & $git -c "safe.directory=$RepoPath" -C $RepoPath @Arguments
    if ($LASTEXITCODE -ne 0) { throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE" }
}

function Write-ListenerLog {
    param([string]$Message)
    New-Item -ItemType Directory -Force -Path $claimsPath | Out-Null
    Add-Content -LiteralPath $claimLog -Value ("{0} | {1}" -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz'), $Message) -Encoding UTF8
}

function Set-HeartbeatField {
    param([string]$Text, [string]$Field, [string]$Value)
    $pattern = "(?m)^\| $([regex]::Escape($Field)) \|.*$"
    $replacement = "| $Field | $Value |"
    if ([regex]::IsMatch($Text, $pattern)) {
        return [regex]::Replace($Text, $pattern, $replacement)
    }
    return $Text
}

function Update-Heartbeat {
    param([string]$TaskId)
    $text = Get-Content -LiteralPath $heartbeatPath -Raw -Encoding UTF8
    $now = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz')
    $text = Set-HeartbeatField $text $fields.Status 'Trial Running'
    $text = Set-HeartbeatField $text $fields.CurrentTask $TaskId
    $text = Set-HeartbeatField $text $fields.CurrentTaskId $TaskId
    $text = Set-HeartbeatField $text $fields.TaskStatus 'Picked'
    $text = Set-HeartbeatField $text $fields.Progress '0%'
    $text = Set-HeartbeatField $text $fields.Lock $TaskId
    $text = Set-HeartbeatField $text $fields.Load '1 task'
    $text = Set-HeartbeatField $text $fields.LastUpdate $now
    [IO.File]::WriteAllText($heartbeatPath, $text, [Text.UTF8Encoding]::new($false))
}

function Get-TaskId([string]$Path) {
    $text = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    if ($text -match '(?m)^\s*(TASK[-_]\d{8}[-_]\d{3,})\s*$') { return $Matches[1] }
    if ([IO.Path]::GetFileName($Path) -match '(TASK[-_]\d{8}[-_]\d{3,})') { return $Matches[1] }
    return $null
}

function Is-V2Task([string]$Path) {
    $text = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    return (($text -match '(?m)^\s*V2\s*$') -or
        ($text -match '(?m)^\s*V2 AI.*$'))
}

function HasTaskAnywhere([string]$TaskId) {
    Get-ChildItem -LiteralPath @(
        $runningPath,
        $approvalPath,
        $completedPath
    ) -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notlike '.gitkeep' -and (Get-TaskId $_.FullName) -eq $TaskId } |
        Select-Object -First 1
}

function Commit-And-Push([string]$TaskId) {
    Invoke-Git @('add', '-A', '--', 'runtime/task_queue')
    Invoke-Git @('add', '-u')
    & $git -c "safe.directory=$RepoPath" -C $RepoPath diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { return }
    Invoke-Git @('commit', '-m', "Pick $TaskId on V2")
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        & $git -c "safe.directory=$RepoPath" -C $RepoPath push origin main
        if ($LASTEXITCODE -eq 0) { return }
        if ($attempt -eq 3) { throw 'push failed after two automatic retries' }
        Invoke-Git @('pull', '--rebase', 'origin', 'main')
        if (Get-ChildItem -LiteralPath $dispatchPath -File | Where-Object { (Get-TaskId $_.FullName) -eq $TaskId }) { continue }
        return
    }
}

function Invoke-Scan {
    Write-Host ("[{0}] scan started" -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz'))
    Invoke-Git @('fetch', 'origin')
    $local = & $git -c "safe.directory=$RepoPath" -C $RepoPath rev-parse HEAD
    $remote = & $git -c "safe.directory=$RepoPath" -C $RepoPath rev-parse origin/main
    $dirty = (& $git -c "safe.directory=$RepoPath" -C $RepoPath status --porcelain)
    if ($dirty) { Write-Host 'skipped: worktree not clean'; return }
    if ($local -ne $remote) { Invoke-Git @('pull', '--ff-only', 'origin', 'main') }

    $active = Get-ChildItem -LiteralPath $runningPath -File -ErrorAction SilentlyContinue |
        Where-Object Name -notlike '.gitkeep'
    if ($active) { Write-Host 'skipped: active task exists'; return }

    foreach ($task in (Get-ChildItem -LiteralPath $dispatchPath -File -ErrorAction SilentlyContinue)) {
        $taskId = Get-TaskId $task.FullName
        if (-not $taskId -or $taskId -ne 'TASK-20260804-006') { continue }
        if (-not (Is-V2Task $task.FullName)) { Write-Host "$taskId skipped: node mismatch"; continue }
        if (HasTaskAnywhere $taskId) { Write-Host "$taskId skipped: task already recorded"; continue }

        $destination = Join-Path $runningPath $task.Name
        Move-Item -LiteralPath $task.FullName -Destination $destination
        Update-Heartbeat $taskId
        Write-ListenerLog "$taskId | CLAIMED | V2_NODE | moved to RUNNING"
        Commit-And-Push $taskId
        Write-Host "$taskId claimed; execution started"
        return
    }
    Write-Host 'no matching V2 task'
}

try {
    $hasMutex = $mutex.WaitOne(0)
    if (-not $hasMutex) { throw 'another V2 listener instance is already running' }
    if (-not (Test-Path $dispatchPath)) { throw "dispatch path missing: $dispatchPath" }
    if (-not (Test-Path $runningPath)) { throw "running path missing: $runningPath" }
    $scan = 0
    while ($MaxScans -eq 0 -or $scan -lt $MaxScans) {
        try {
            Invoke-Scan
        } catch {
            $message = $_.Exception.Message
            Write-ListenerLog ("ERROR | " + $message)
            Write-Host ("error: " + $message)
        }
        $scan++
        if ($MaxScans -ne 0 -and $scan -ge $MaxScans) { break }
        Start-Sleep -Seconds $IntervalSeconds
    }
} finally {
    if ($hasMutex) { $mutex.ReleaseMutex() | Out-Null }
    $mutex.Dispose()
}
