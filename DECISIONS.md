# Decisions

Use this file to record important project decisions so GPT and Codex do not repeat the same discussion.

## Decision Log

### 2026-07-26 - Use Markdown files as shared project memory

**Decision:** Keep project goals, tasks, rules, and handoffs in versioned Markdown files.

**Why:** ChatGPT and Codex histories are separate, and different computers may have different local state. A Git-synced project folder gives every tool the same source of truth.

**Impact:** Each session should update the project files after planning or execution.

### 2026-07-26 - Use three-party confirmation before Codex execution

**Decision:** For important work, use a three-party confirmation flow before Codex executes.

**Flow:**

1. 老板和 ChatGPT 讨论并确定工作方向。
2. ChatGPT 高效梳理出 Codex 能精准理解的大纲、注意要点、执行边界和风险。
3. Codex 收集交接内容，并按 Codex 执行体系做二次复核。
4. 老板把 Codex 复核结果再发给 ChatGPT 确认。
5. 三方确认后，Codex 进入执行。

**Why:** This reduces misunderstanding between planning and execution, keeps the boss in control, and lets ChatGPT focus on strategy while Codex focuses on implementation.

**Impact:** Important tasks should not jump directly from ChatGPT discussion into Codex execution unless the boss explicitly says the task is simple enough to skip the full confirmation loop.

### 2026-07-26 - Position 海中宝 AI as an enterprise AI operating system

**Decision:** The project direction is to build 海中宝's enterprise AI operating system, not a single isolated AI tool.

**Why:** The long-term goal is to combine GPT, Codex, RPA, and enterprise data into an assistant system that understands the business, supports老板 strategy, analyzes operations, executes repeatable work, and improves over time.

**Impact:** Development should start from small MVPs with clear business value, then expand into a larger enterprise AI brain.

### 2026-07-26 - Upgrade three-party synchronization to constitution-level rule

**Decision:** 海中宝 AI 项目采用“老板 + GPT + Codex”三方同步确认机制，并将其纳入宪法级规则。

**Why:** 重要事项如果只在老板和 GPT、老板和 Codex、或 GPT 和 Codex 之间单边确认，容易造成信息断层和错误执行。三方同步机制确保老板知道、GPT 理解、Codex 同步后再进入执行。

**Impact:** 后续所有重要项目必须建立同步确认记录。没有正式同步文件时，Codex 将任务标记为【待同步】或【待确认】，不得开发。

**Canonical files:**

- `architecture/海中宝AI大脑架构设计_V1.0_最终确认版.md`
- `architecture/海中宝GPT-Codex协同规则_V1.1_最终确认版.md`
- `sync_records/三方同步确认记录模板.md`

### 2026-07-27 - Central brain V2 first stage accepted

**Decision:** 海中宝AI中央大脑V2.0第一阶段验收通过。

**Confirmed by GPT:**

1. 第一批AI专家确定建设：AI-001 战略AI、AI-002 经营数据AI、AI-003 财务战略AI。
2. 暂不扩展更多AI。
3. 同步机制采用半自动三方同步机制V1.0。
4. ChatGPT项目资料接入分为一级和二级资料。
5. GitHub仍作为正式知识源。
6. 下一阶段重点进入老板经营日报MVP，同时完善老板驾驶舱V2。

**Impact:** Codex进入老板经营日报MVP和老板驾驶舱V2执行评估阶段。第一批AI专家进入岗位卡、输入输出模板和工作流程建设准备。

**Canonical files:**

- `sync_records/三方同步确认记录/2026-07-27_中央大脑V2第一阶段验收通过.md`
- `接入包_给GPT和Codex/04_ChatGPT项目资料接入清单.md`
- `00_海中宝AI治理总纲/07_运行制度/AI状态中心.md`

### 2026-07-28 - Adopt identity authentication and permission access V1.1

**Decision:** 老板确认中央大脑身份认证与权限接入方向，采用三层验证机制。

**Three layers:**

1. 接入文件验证：确认一键接入文件版本、更新时间和GitHub仓库地址。
2. 身份验证：当前阶段使用人员姓名/岗位或AI名称/服务岗位，并通过老板独立渠道确认口令。
3. 权限验证：根据岗位匹配可读取资料、可执行任务和是否需要老板确认。

**Important security rule:** Real passwords, tokens, verification codes, and credentials must not be stored in the GitHub repository. The repository records only fields, process, and permission rules.

**Impact:** New computers, GPT accounts, Codex accounts, and AI experts must follow the V1.1 access protocol before working with central-brain materials.

**Canonical files:**

- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑身份认证与权限接入协议_V1.1.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑身份认证体系升级报告.md`
- `海中宝AI一键接入大脑文件.md`
