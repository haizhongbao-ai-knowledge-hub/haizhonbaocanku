param(
    [string]$RepoPath = "D:\Administrator\Documents\海中宝AI总文件",
    [string]$GitPath = "D:\Administrator\Documents\tools\Git\cmd\git.exe"
)

$ErrorActionPreference = "Continue"
$now = Get-Date
$logDir = Join-Path $RepoPath "sync_records"
$stamp = $now.ToString("yyyyMMdd-HHmmss")
$logPath = Join-Path $logDir "18点后上传同步复核_$stamp.md"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$lines = @()
$lines += "# 18点后上传同步复核"
$lines += ""
$lines += "生成时间：$($now.ToString('yyyy-MM-dd HH:mm:ss'))"
$lines += ""

if ($now.Hour -lt 18) {
    $lines += "状态：未到18:00，仅生成检查记录，不执行推送重试。"
    $lines += ""
} else {
    $lines += "状态：已到18:00后，执行复核和推送重试。"
    $lines += ""
}

$lines += "## 一、本地Git状态"
$status = & $GitPath -C $RepoPath status -sb 2>&1
$lines += '```text'
$lines += $status
$lines += '```'
$lines += ""

if ($now.Hour -ge 18) {
    $lines += "## 二、推送重试结果"
    $push = & $GitPath -C $RepoPath push 2>&1
    $exitCode = $LASTEXITCODE
    $lines += '```text'
    $lines += $push
    $lines += '```'
    $lines += ""
    if ($exitCode -eq 0) {
        $lines += "结论：推送成功。"
    } else {
        $lines += "结论：推送失败，继续保留为待重试。"
    }
} else {
    $lines += "## 二、推送重试结果"
    $lines += "未执行。"
}

$lines += ""
$lines += "## 三、规则"
$lines += ""
$lines += "- 不管失败原因是什么，每天18:00后必须重新审核。"
$lines += "- 涉及敏感资料时，仍需老板授权。"
$lines += "- 失败项不得伪装成已完成。"

Set-Content -LiteralPath $logPath -Value $lines -Encoding UTF8
Write-Output $logPath
