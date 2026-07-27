# Multi-Computer Sync Guide

这份文件说明如何在 2-3 台电脑上同步海中宝AI项目。

## 当前云端仓库

GitHub 仓库：

```text
https://github.com/haizhongbao-ai-knowledge-hub/haizhonbaocanku
```

Clone 地址：

```text
https://github.com/haizhongbao-ai-knowledge-hub/haizhonbaocanku.git
```

## 核心原则

- GitHub/Git 仓库是项目事实来源。
- ChatGPT 历史不是项目事实来源。
- Codex 本地会话不是项目事实来源。
- 每台电脑都打开同一个仓库，而不是各自维护一份散落文件。
- GPT 或 Codex 要了解项目，必须能读取本仓库文件，或由老板复制/上传关键文件给它。

## 办公室电脑

当前位置：

```text
D:\Administrator\Documents\海中宝AI总文件
```

状态：

- 已完成本地 Git 初始化。
- 已完成首次提交。
- 已推送到 GitHub。
- `main` 已跟踪 `origin/main`。

日常开始工作前：

```powershell
cd "D:\Administrator\Documents\海中宝AI总文件"
git pull
```

日常结束工作后：

```powershell
git status
git add .
git commit -m "Update 海中宝AI project"
git push
```

## 家里电脑接入

建议放在 D 盘同名目录。

```powershell
cd D:\
git clone https://github.com/haizhongbao-ai-knowledge-hub/haizhonbaocanku.git "海中宝AI总文件"
cd "D:\海中宝AI总文件"
git status
```

如果家里电脑要让 Codex 改文件、跑命令，就在家里电脑登录 ChatGPT/Codex 桌面端，并让 Codex 打开：

```text
D:\海中宝AI总文件
```

## 同一个账号和不同账号

### 同一个 ChatGPT/Codex 账号

- 更容易看到同一套 ChatGPT 项目和聊天历史。
- 仍然需要通过 GitHub clone 本仓库，才能让家里电脑看到本地项目文件。

### 不同 ChatGPT/Codex 账号

- 不一定能看到原 ChatGPT 项目聊天历史。
- 只要能读取本仓库文件，也可以继续海中宝AI项目。
- 必须先让新账号读取 `KNOWLEDGE_HUB.md`、宪法级文件、`TASKS.md`、`HANDOFF.md`。

### 不同 GitHub 账号

如果家里电脑使用另一个 GitHub 账号，需要把那个 GitHub 账号加入仓库协作者，否则它不能访问私有仓库。

## GPT 读取方式

GPT 网页端不能自动读取本地文件。要让 GPT 了解项目，有三种方式：

1. 把关键文件上传到 ChatGPT 项目资料。
2. 把关键文件内容复制给 GPT。
3. 如果 GPT 所在环境支持访问 GitHub 仓库，则让它读取仓库文件。

优先给 GPT：

```text
KNOWLEDGE_HUB.md
architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md
architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md
knowledge-hub/CONFIRMED_KNOWLEDGE.md
knowledge-hub/GPT_CLASSIFICATION_PROMPT.md
老板驾驶舱.md
TASKS.md
HANDOFF.md
```

## Codex 读取方式

每台电脑上的 Codex 都应先读取：

```text
KNOWLEDGE_HUB.md
architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md
architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md
knowledge-hub/CONFIRMED_KNOWLEDGE.md
knowledge-hub/CODEX_MEMORY_RULES.md
TASKS.md
HANDOFF.md
老板驾驶舱.md
```

