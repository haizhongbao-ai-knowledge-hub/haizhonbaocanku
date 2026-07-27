# 海中宝 AI 项目知识中枢

这是海中宝 AI 自动化项目的统一知识入口。

## 目标

让老板、GPT、Codex 在长期项目中共享同一套项目记忆，减少重复沟通，让重要结论、未确认想法、任务、决策和聊天材料都有固定存放位置。

## 重要边界

- Codex 可以读取本地项目文件。
- GPT 不能自动读取本地文件，除非老板把文件内容复制给 GPT，或把相关文件上传/放入 ChatGPT 项目资料。
- ChatGPT 聊天记录不是最终事实来源。
- 本知识中枢才是长期项目事实来源。

## 宪法级文件

后续所有 AI 项目必须遵守：

1. `architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md`
2. `architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md`

## 目录地图

| 类型 | 存放文件 | 用途 |
| --- | --- | --- |
| 已确认知识 | `knowledge-hub/CONFIRMED_KNOWLEDGE.md` | 老板已经确认、可长期引用的事实和原则 |
| 未确认想法 | `knowledge-hub/UNCONFIRMED_IDEAS.md` | 讨论中、待验证、待老板拍板的想法 |
| 聊天记录索引 | `knowledge-hub/CHAT_RECORDS_INDEX.md` | 记录每次重要聊天的来源、摘要和归档位置 |
| GPT 分类规则 | `knowledge-hub/GPT_CLASSIFICATION_PROMPT.md` | 复制给 GPT，让 GPT 按固定规则整理内容 |
| Codex 读取规则 | `knowledge-hub/CODEX_MEMORY_RULES.md` | Codex 每次工作前要如何读取知识 |
| AI大脑架构 | `architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md` | 海中宝 AI 企业大脑总体架构，宪法级文件 |
| GPT-Codex规则 | `architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md` | GPT、Codex、老板协同规则，宪法级文件 |
| 三方同步记录 | `sync_records/` | 重要事项进入执行前的三方同步确认记录 |
| 待完善事项 | `tasks/待完善事项清单.md` | 未最终确定事项、负责人、影响和提醒周期 |
| AI治理体系 | `00_海中宝AI治理总纲/` | AI宪法、组织体系、协同规则、驾驶舱、待完善事项 |
| 老板驾驶舱 | `老板驾驶舱.md` | 老板查看项目进展、风险和待决策事项 |
| 自动化项目目录 | `projects/海中宝AI自动化项目/` | 具体任务书、数据需求、执行记录和复盘 |
| 项目总纲 | `PROJECT_BRIEF.md` | 项目定位、阶段目标、角色分工 |
| 公司方向 | `COMPANY_DIRECTION.md` | 老板战略、公司方向、业务判断 |
| 自动化路线 | `AUTOMATION_ROADMAP.md` | 阶段路线、系统建设、自动化计划 |
| 需求执行表 | `REQUIREMENTS_TABLE.md` | 确认工作、优先级、状态、阻塞和支持需求 |
| 任务清单 | `TASKS.md` | 当前执行任务 |
| 决策记录 | `DECISIONS.md` | 已确认的重要决策 |
| GPT 原始导入 | `GPT_OUTLINE_IMPORT.md` | 从 GPT 聊天复制来的原始大纲和交接材料 |

## 使用规则

1. GPT 输出内容时，先分成“已确认”“未确认”“建议进入任务”“建议进入决策”“原始聊天记录”。
2. Codex 收到内容后，先写入知识中枢，再做二次复核。
3. 老板确认前，内容不能从“未确认想法”升级为“已确认知识”。
4. 重要任务进入执行前，必须走三方确认流程。
5. 架构类文档放入 `architecture/`。
6. 具体项目执行材料放入 `projects/海中宝AI自动化项目/`。
7. 如果临时讨论与宪法级文件冲突，优先遵守宪法级文件，并提醒老板确认。
8. 重要事项必须建立三方同步记录，确认老板、GPT、Codex 三方认知一致后才能执行。
9. 治理体系内容分为宪法层、组织体系层、协同规则层、驾驶舱层、待完善事项层。
