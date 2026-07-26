# Multi-Computer Sync Guide

这份文件说明如何在 2-3 台电脑上同步海中宝AI项目。

## 核心原则

- GitHub/Git 仓库是项目事实来源。
- ChatGPT 历史不是项目事实来源。
- Codex 本地会话不是项目事实来源。
- 每台电脑都打开同一个仓库，而不是各自维护一份散落文件。

## 第一台电脑

当前位置：

```text
D:\Administrator\Documents\海中宝AI总文件
```

待完成：

1. 配置 Git 用户名和邮箱。
2. 提交当前文件。
3. 创建 GitHub 远程仓库。
4. 推送到 GitHub。

命令模板：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

cd "D:\Administrator\Documents\海中宝AI总文件"
git commit -m "Initialize 海中宝AI project workspace"

git remote add origin https://github.com/你的账号/你的仓库名.git
git push -u origin main
```

## 第二、三台电脑

建议放在 D 盘同名目录。

```powershell
cd D:\
git clone https://github.com/你的账号/你的仓库名.git "海中宝AI总文件"
cd "D:\海中宝AI总文件"
```

如果那台电脑也要让 Codex 改文件、跑命令，就在那台电脑登录 Codex/ChatGPT 桌面端，并打开这个仓库。

如果那台电脑只用网页版 GPT 做规划，不一定需要安装 Codex；只要能看到 GitHub 或把内容写回项目文件即可。

## 日常同步

开始工作前：

```powershell
git pull
```

结束工作后：

```powershell
git status
git add .
git commit -m "Update project notes"
git push
```

## 融合 GPT 聊天大纲

1. 在 Chrome 打开 ChatGPT 的“海中宝AI”聊天。
2. 把昨天的项目大纲复制到 `GPT_OUTLINE_IMPORT.md`。
3. 让 Codex 整理：

```text
请把 GPT_OUTLINE_IMPORT.md 里的内容融合进 PROJECT_BRIEF.md、TASKS.md 和 DECISIONS.md。
```

4. Codex 整理后提交并推送。

