# 自动归档方案

目标：你在 ChatGPT 的“项目：海中宝AI自动化”里聊工作，确定后的内容能进入本项目仓库，让 Codex 后续知道重点并执行。

## 当前能稳定做到

### 方案 A：复制 GPT 交接内容，本地脚本归档

流程：

1. 你和 ChatGPT 聊项目。
2. 让 ChatGPT 按 `GPT_HANDOFF_TEMPLATE.md` 输出交接内容。
3. 你复制交接内容。
4. 在本项目运行 `scripts\New-GptHandoffFromClipboard.ps1`。
5. 脚本自动生成归档文件，并把任务写入 `REQUIREMENTS_TABLE.md`。

优点：

- 稳定
- 不需要账号额外授权
- 适合马上使用

缺点：

- 需要你复制一次

## 后续可升级

### 方案 B：云盘同步导入

让 GPT 输出内容到一个同步文件夹，Codex 读取该文件夹再归档。

需要支持：

- 选定 OneDrive、Google Drive 或 GitHub 作为同步入口
- 每台电脑配置同一个同步目录

### 方案 C：Chrome 浏览器读取

你打开 ChatGPT 项目页面后，让 Codex 读取当前页面并归档。

需要支持：

- 你打开正确聊天窗口
- 你明确授权 Codex 读取当前页面
- 页面内容足够可见或可复制

### 方案 D：自建自动化桥接

建立一个小型本地或云端接口，让 GPT 把确认后的任务发送到项目仓库。

需要支持：

- 明确使用 OpenAI API、GPT Actions、Webhook、GitHub API 或其他自动化平台
- 提供必要账号、权限和安全边界
- 处理密钥、登录、网络和同步问题

## 现阶段建议

先使用方案 A，把流程跑通。等项目大纲稳定后，再升级到方案 B 或 D。

