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
$dispatchPath = Join-Path $queueRoot '02_已派单'
$runningPath = Join-Path $queueRoot '03_执行中'
$claimsPath = Join-Path $queueRoot 'claims'
$claimLog = Join-Path $claimsPath 'V2_LISTENER.log'
$heartbeatPath = Join-Path $RepoPath '00_老板驾驶舱\AI节点总览\V2_HEARTBEAT.md'
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
    $text = Set-HeartbeatField $text '状态' 'Trial Running'
    $text = Set-HeartbeatField $text '当前任务' $TaskId
    $text = Set-HeartbeatField $text '当前任务编号' $TaskId
    $text = Set-HeartbeatField $text '任务状态' 'Picked'
    $text = Set-HeartbeatField $text '完成进度' '0%'
    $text = Set-HeartbeatField $text '锁定文件' $TaskId
    $text = Set-HeartbeatField $text '当前负载' '1 task'
    $text = Set-HeartbeatField $text '最后更新时间' $now
    [IO.File]::WriteAllText($heartbeatPath, $text, [Text.UTF8Encoding]::new($false))
}

function Get-TaskId([string]$Path) {
    $match = [regex]::Match((Get-Content -LiteralPath $Path -Raw -Encoding UTF8), '(?m)^TASK[-_]\d{8}[-_]\d{3,}$')
    if ($match.Success) { return $match.Value.Trim() }
    $nameMatch = [regex]::Match([IO.Path]::GetFileName($Path), 'TASK[-_]\d{8}[-_]\d{3,}')
    if ($nameMatch.Success) { return $nameMatch.Value }
    return $null
}

function Is-V2Task([string]$Path) {
    $text = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    return (($text -match '(?m)^执行节点\s*\r?\n\s*V2\s*$') -or
        ($text -match '(?m)^执行节点\s*\r?\n\s*V2 AI研发协同中心\s*$'))
}

function HasTaskAnywhere([string]$TaskId) {
    Get-ChildItem -LiteralPath @(
        (Join-Path $queueRoot '03_执行中'),
        (Join-Path $queueRoot '04_待审批'),
        (Join-Path $queueRoot '05_已完成')
    ) -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notlike '.gitkeep' -and (Get-TaskId $_.FullName) -eq $TaskId } |
        Select-Object -First 1
}

function Commit-And-Push([string]$TaskId) {
    Invoke-Git @('add', '--', 'runtime/task_queue', '00_老板驾驶舱/AI节点总览/V2_HEARTBEAT.md')
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
    if ($dirty) { Write-ListenerLog 'SKIP | worktree not clean'; Write-Host 'skipped: worktree not clean'; return }
    if ($local -ne $remote) { Invoke-Git @('pull', '--ff-only', 'origin', 'main') }

    $active = Get-ChildItem -LiteralPath $runningPath -File -ErrorAction SilentlyContinue |
        Where-Object Name -notlike '.gitkeep'
    if ($active) { Write-ListenerLog 'SKIP | V2 already has an executing task'; Write-Host 'skipped: active task exists'; return }

    foreach ($task in (Get-ChildItem -LiteralPath $dispatchPath -File -ErrorAction SilentlyContinue)) {
        $taskId = Get-TaskId $task.FullName
        if (-not $taskId -or $taskId -ne 'TASK-20260804-006') { continue }
        if (-not (Is-V2Task $task.FullName)) { Write-ListenerLog "$taskId | SKIP | node mismatch"; continue }
        if (HasTaskAnywhere $taskId) { Write-ListenerLog "$taskId | SKIP | task already recorded"; continue }

        $destination = Join-Path $runningPath $task.Name
        Move-Item -LiteralPath $task.FullName -Destination $destination
        Update-Heartbeat $taskId
        Write-ListenerLog "$taskId | CLAIMED | V2 AI研发协同中心 | moved to 03_执行中"
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
        try { Invoke-Scan } catch { Write-ListenerLog ("ERROR | " + $_.Exception.Message); Write-Host ("error: " + $_.Exception.Message) }
        $scan++
        if ($MaxScans -ne 0 -and $scan -ge $MaxScans) { break }
        Start-Sleep -Seconds $IntervalSeconds
    }
} finally {
    if ($hasMutex) { $mutex.ReleaseMutex() | Out-Null }
    $mutex.Dispose()
}
