# Codex 读取知识规则

Codex 每次处理海中宝 AI 自动化项目时，优先读取：

1. `KNOWLEDGE_HUB.md`
2. `architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md`
3. `architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md`
4. `knowledge-hub/CONFIRMED_KNOWLEDGE.md`
5. `knowledge-hub/UNCONFIRMED_IDEAS.md`
6. `PROJECT_BRIEF.md`
7. `TASKS.md`
8. `DECISIONS.md`
9. `HANDOFF.md`

## 宪法级规则

后续所有 AI 项目必须遵守两个最终确认版文件：

- `architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md`
- `architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md`

如果普通任务、聊天记录、临时想法与宪法级文件冲突，优先遵守宪法级文件，并向老板说明冲突。

## 三方同步判断

重要任务执行前，Codex 必须确认：

1. 老板是否已经确认方向？
2. GPT 是否已经形成正式执行说明？
3. Codex 是否已经收到正式同步文件？
4. Codex 是否已经输出理解确认？
5. 是否存在未确认事项影响执行？

如果任一项缺失，任务状态为【待同步】或【待确认】，不能开发。

## 执行前判断

如果任务来自已确认知识：

- 可以进入 Codex 二次复核。

如果任务来自未确认想法：

- 不能直接开发。
- 先列出待确认问题。
- 等老板和 GPT 确认后再执行。

如果任务来自聊天记录：

- 先分类。
- 再判断是否已确认。
- 再决定写入哪个项目文件。

## 异常处理

如果 Codex 发现技术无法实现、数据不足、成本过高、项目影响扩大，不得直接执行。

必须提交《项目异常说明》，说明问题、原因、影响、解决方案和建议。
