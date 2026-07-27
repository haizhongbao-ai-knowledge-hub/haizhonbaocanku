# 海中宝AI中央大脑运行协议 V1.0

状态：【验收通过后启用】

## 一、协议目的

本协议用于规范海中宝 AI 中央大脑的日常运行方式。

目标：

- 保证老板、GPT、Codex 在同一套项目事实来源下工作。
- 保证本地文件、GitHub 云仓库和 AI 接入文件持续同步。
- 保证重要事项执行前完成三方同步。

## 二、中央大脑组成

中央大脑由以下部分组成：

1. 本地项目文件夹：`D:\Administrator\Documents\海中宝AI总文件`
2. GitHub 云仓库：`https://github.com/haizhongbao-ai-knowledge-hub/haizhonbaocanku`
3. 一键接入文件：`海中宝AI一键接入大脑文件.md`
4. 项目状态总览：`海中宝AI项目状态总览.md`
5. 知识中枢：`KNOWLEDGE_HUB.md`
6. 宪法级规则文件
7. 老板驾驶舱
8. 三方同步记录

## 三、运行原则

### 1. 双中心原则

本地文件和 GitHub 云仓库共同组成双中心。

本地负责：

- 快速访问
- Codex 执行
- 文件维护
- 本地备份

GitHub 负责：

- 跨电脑同步
- 云端备份
- 多账号访问
- 恢复来源

### 2. 状态透明原则

老板可以随时询问项目状态。

任何类似“AI项目进展”“现在做到哪一步”“有哪些没完善”的问题，都应触发：

```text
海中宝AI项目状态汇报模式
```

### 3. 三方同步原则

重要事项必须保证：

```text
老板知道
GPT理解
Codex同步
```

否则不能执行。

## 四、日常运行流程

### 开始工作

Codex 先执行：

```powershell
git pull
```

然后读取：

- `海中宝AI项目状态总览.md`
- `KNOWLEDGE_HUB.md`
- `TASKS.md`
- `HANDOFF.md`

### 工作中

- GPT 负责战略分析和方案整理。
- Codex 负责文件维护、技术评估和执行。
- 老板负责确认方向和授权执行。

### 工作结束

Codex 执行：

```powershell
git status
git add .
git commit -m "Update 海中宝AI project"
git push
```

必要时生成本地备份。

## 五、验收状态

海中宝 AI 中央大脑 V1.0 基础架构已通过 GPT 验收。

确认通过：

- GitHub + 本地双中心方案
- 一键接入机制
- 状态总览作为项目入口
- 三方同步原则
- AI权限管理方向

