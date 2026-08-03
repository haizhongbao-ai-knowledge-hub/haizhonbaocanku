# Decisions

Use this file to record important project decisions so GPT and Codex do not repeat the same discussion.

## Decision Log

### 2026-08-03 - Upgrade central brain governance to V2.1

**Decision:** 海中宝AI中央大脑进入V2.1治理升级，最高原则调整为“状态优先于知识、知识优先于讨论、讨论优先于开发、开发优先于执行”。

**Scope:** 本轮不是新增AI，不开发APP，不开发插件，而是建立统一项目状态中心、AI委员会运行机制、AI资产管理、重复议题识别、窗口职责体系、中央状态机和中央知识治理规范。

**Why:** 中央大脑文件数量已经增长，新GPT、新Codex、新电脑接入时需要更快识别当前状态，避免重复讨论、重复建文件和信息断层。

**Impact:** 以后任何AI第一步必须读取 `00_老板驾驶舱/00_中央项目索引.md` 和 `00_老板驾驶舱/01_项目状态中心.md`，再读取相关知识库和历史决策。

**Canonical files:**

- `00_老板驾驶舱/00_中央项目索引.md`
- `00_老板驾驶舱/01_项目状态中心.md`
- `00_海中宝AI治理总纲/07_运行制度/AI重复议题识别机制.md`
- `00_海中宝AI治理总纲/07_运行制度/中央状态机_State_Engine规范.md`
- `00_海中宝AI治理总纲/07_运行制度/中央知识治理规范V1.0.md`

### 2026-08-03 - Adopt V0-V1-V2 collaboration chain

**Decision:** 海中宝AI中央大脑采用V0-V1-V2高效协同链路，结构为“两层同步、一个归档”：中央协同收发区、中央任务中心、GitHub中央仓库。

**Confirmed roles:**

- 春晓V0：Owner和最终决策人，只负责决策、提问、审批和指挥。
- 伟强V1：财务总监和AI项目推进负责人，负责资料组织、经营数据协调和财务复核。
- V2 AI研发协同中心：Codex主执行、中央治理、GitHub维护、自动化开发和战略研究协同。

**Important boundary:** V0不再承担U盘搬运、文件归档、目录维护和GitHub提交等低价值操作。同步目录不是正式知识库，审批后才进入GitHub正式归档。

**Current implementation:** `D:\海中宝AI协同中心` 已在PC001建立本机目录结构；跨电脑自动同步需接入企业云盘、OneDrive或局域网共享后联测。

**Canonical files:**

- `00_老板驾驶舱/07_中央任务中心.md`
- `00_海中宝AI治理总纲/07_运行制度/V0-V2协同工作协议.md`
- `00_海中宝AI治理总纲/07_运行制度/中央接入协议_V3.0.md`
- `00_海中宝AI治理总纲/02_AI组织体系/V0老板岗位知识包.md`
- `00_海中宝AI治理总纲/02_AI组织体系/V1财务与项目推进岗位知识包.md`
- `00_海中宝AI治理总纲/02_AI组织体系/V2_AI研发协同中心岗位知识包.md`
- `knowledge-hub/finance/V1财务资料知识树_V1.0.md`
- `reviews/V0-V2同步测试报告_2026-08-03.md`

### 2026-08-03 - Fix P0 task execution queue

**Decision:** 当前P0任务执行顺序固定为P0-01、P0-02、P0-03，不允许新任务打断正在执行的中央大脑治理主线。

**Queue:**

1. P0-01：完成中央大脑V2.1治理升级。
2. P0-02：执行《V2接口与自动授权上线任务书 V1.1》，优先打通V0-V2同步、V2 Execution Mode、任务监听和结果回传。
3. P0-03：执行《AI任务智能调度中心建设任务书 V1.0》，建立统一任务调度、任务锁、分支隔离和节点负载管理。

**Important boundary:** P0-02和P0-03已纳入队列，但尚未直接启动。P0-03依赖P0-02至少完成V2接口基础上线。

**Impact:** V2接口打通后，大型任务优先转移到V2；V0本机Codex转为快速执行席。所有正式结果统一进入GitHub中央仓库。

**Canonical files:**

- `00_老板驾驶舱/08_P0任务队列.md`
- `tasks/P0任务队列/海中宝AI中央大脑_P0任务排队执行清单.md`
- `tasks/P0任务队列/海中宝AI中央大脑_V2接口与自动授权上线任务书_V1.1.md`
- `tasks/P0任务队列/海中宝AI中央大脑_AI任务智能调度中心建设任务书_V1.0.md`
- `reviews/P0任务队列纳入完成报告_2026-08-03.md`

### 2026-08-03 - Add V2 heartbeat and single task intake rule

**Decision:** V2正式上线后，不只是第二个Codex节点，而是“AI研发协同中心”。V2必须通过Heartbeat持续同步当前任务、下一任务、负载、阻碍、Git状态、待V0审批和待V1资料。

**Single intake:** V0确认后的正式文件只投递一次，进入 `D:\海中宝AI协同中心\00_统一任务入口\待识别`，由Dispatcher推荐分配给V0 Codex、V2 Codex、伟强V1或AI委员会。

**Dispatch mode:** 初期采用“推荐派单 + V0确认”。连续10个真实任务稳定后，低风险任务才允许自动派单。

**Expansion rule:** 后续V3-V6统一走：设备登记、中央入口、身份认证、岗位授权包、Execution Mode、节点上线确认、Dispatcher登记、Heartbeat上线、正式接任务。

**Boundary:** 禁止创建第二套中央大脑；禁止多个Codex自由并发修改中央仓库；所有正式结果统一由V2归档GitHub。

**Canonical files:**

- `00_老板驾驶舱/AI节点总览.md`
- `00_老板驾驶舱/AI节点总览/V2_HEARTBEAT.md`
- `00_老板驾驶舱/AI节点总览/V2启动状态报告模板.md`
- `00_老板驾驶舱/V2每日状态摘要模板.md`
- `00_海中宝AI治理总纲/07_运行制度/统一任务入口与推荐派单规则.md`
- `00_海中宝AI治理总纲/07_运行制度/V3-V6统一上线模板.md`

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

### 2026-07-28 - Build mobile central-brain access system V1.0

**Decision:** 老板确认执行海中宝AI中央大脑接入系统V1.0，建立移动接入入口系统。

**Principles:**

1. 不创建第二套中央大脑。
2. 不修改现有核心目录结构。
3. 不把所有知识复制到入口文件。
4. 入口文件不替代GitHub中央仓库。

**Impact:** New GPT, Codex, and AI assistants can start from one entrance file, then use the navigation map and permission table to find authorized files.

**Canonical files:**

- `接入包_给GPT和Codex/海中宝AI中央大脑一键接入入口.md`
- `接入包_给GPT和Codex/中央大脑导航地图.md`
- `00_海中宝AI治理总纲/07_运行制度/AI身份权限验证表.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑接入系统V1.0完成报告.md`

### 2026-07-28 - Upgrade AI identity, permission, and role management to V1.1

**Decision:** 建立《海中宝AI中央大脑 AI身份、权限与岗位管理体系 V1.1》，把新GPT、新Codex、新AI专家按企业数字员工管理。

**Principles:**

1. 不创建新的平行体系。
2. 合并进入 `00_海中宝AI治理总纲/07_运行制度/`。
3. 保持唯一事实来源。
4. AI不依赖聊天窗口记忆，正式文件才是事实。
5. P4不代表自动决策，老板仍是最终决策者。

**Impact:** New AI agents must have identity, role, permission, job scope, memory source, and collaboration rules before official work.

**Canonical files:**

- `00_海中宝AI治理总纲/07_运行制度/海中宝AI员工身份管理制度_V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI权限管理制度_V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/AI专家岗位说明书模板_V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI记忆来源管理制度_V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑AI身份权限体系V1.1完成报告.md`

### 2026-07-28 - Build seamless access and progressive authorization system V1.1

**Decision:** 建立海中宝AI中央大脑无缝接入与渐进式授权系统V1.1。

**Principles:**

1. 不依赖聊天记忆。
2. 新AI默认P0观察员状态。
3. 不一次开放全部权限。
4. 权限必须按岗位申请，并由老板确认。
5. Codex负责更新权限文件、同步GitHub并生成接入记录。

**Impact:** Any new GPT, Codex, or AI assistant can start from one entrance file, then gradually move from P0 to the authorized role.

**Canonical files:**

- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑启动加载协议_V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/AI接入状态中心_V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/AI身份申请表.md`
- `sync_records/AI接入同步记录模板.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑无缝接入系统V1.1完成报告.md`

### 2026-07-28 - Adopt agent one-click access protocol V2.0

**Decision:** 建立《海中宝AI中央大脑智能体一键接入协议 V2.0》，将V2.0入口作为所有AI智能体的唯一入口文件。

**Flow:** 识别 -> 接入中央大脑 -> 身份申请 -> 岗位匹配 -> 权限授权 -> 获取工作方向 -> 开始工作。

**Principles:**

1. 不是自动拥有全部权限。
2. 中央大脑根据岗位给权限。
3. 老板最终决策。
4. GPT负责思考。
5. Codex负责落地。

**Canonical files:**

- `接入包_给GPT和Codex/海中宝AI中央大脑智能体一键接入入口_V2.0.md`
- `接入包_给GPT和Codex/AI岗位选择表.md`
- `接入包_给GPT和Codex/AI权限自动匹配规则.md`
- `接入包_给GPT和Codex/AI接入完成确认模板.md`
- `00_海中宝AI治理总纲/07_运行制度/海中宝AI中央大脑智能体一键接入协议V2.0完成报告.md`

### 2026-07-28 - Add role authorization loading system V1.0

**Decision:** 完善中央大脑V2.0的岗位授权加载系统。

**Key principle:** 不授权GPT账号本身，而是授权智能体身份。同一个GPT账号可以根据入口文件、身份表、权限文件切换HR AI、产品AI、财务AI等不同岗位模式。

**Impact:** New AI agents now move through role authorization loading: identity recognition, role selection, permission request, boss authorization, knowledge loading, and role work mode.

**Canonical files:**

- `接入包_给GPT和Codex/AI岗位授权加载流程V1.0.md`
- `00_海中宝AI治理总纲/07_运行制度/AI岗位权限矩阵V1.0.md`
- `接入包_给GPT和Codex/AI接入完成确认模板_V2.0.md`

### 2026-07-29 - Create first real business agent HZB-HR-AI-001

**Decision:** 建立海中宝AI中央大脑第一个真实业务智能体：HZB-HR-AI-001 招聘AI。

**Goal:** 验证中央大脑岗位授权、知识加载、业务执行闭环。

**Scope:**

1. HR AI岗位定义。
2. HR知识库目录。
3. 招聘AI岗位授权加载流程。
4. 运营助理招聘AI MVP模板：岗位JD、人才画像、简历评分、BOSS沟通话术、面试问题库、候选人评价表。
5. 中央大脑状态、权限、导航同步。

**Security:** 当前只建立模板和知识结构，不保存真实候选人隐私、员工隐私或财务敏感数据。

**Canonical files:**

- `00_海中宝AI治理总纲/02_AI组织体系/HZB-HR-AI-001_招聘AI岗位定义.md`
- `knowledge-hub/department-knowledge/HR招聘AI/`
- `projects/HZB-HR-AI-001_招聘AI/`
- `sync_records/三方同步确认记录/2026-07-29_HZB-HR-AI-001招聘AI_MVP建设.md`

### 2026-07-29 - Create mobile/USB central-brain access package

**Decision:** 建立老板优盘/手机随身接入包。

**Rule:** 新GPT、新Codex、新AI专家第一次优先只给 `海中宝AI中央大脑智能体一键接入入口_V2.0.md`。第二批文件只在身份、岗位和权限确认后再给。

**Actual package folder:**

- `D:\Administrator\Documents\HZB_AI_Mobile_Access_Package`

**Repository guide:**

- `接入包_随身使用/`

### 2026-08-01 - Build AI committee V0.1 as file-based MVP

**Decision:** 建立《海中宝AI委员会会议系统 V0.1》，第一阶段采用 GPT + Codex + GitHub 中央文件模拟 AI 委员会，暂不开发 APP。

**Why:** 当前重点是验证 AI 组织协同流程，而不是先做复杂软件。文件型会议系统能先跑通问题整理、专家独立分析、综合建议、老板决策、执行记录和复盘沉淀。

**Principles:**

1. 不创建第二套中央大脑。
2. AI身份独立于设备、GPT账号和电脑。
3. 所有AI讨论必须形成结果，禁止无限聊天。
4. Codex只依据正式确认文件执行。

**Impact:** 新增 `projects/AI委员会/`，作为企业级AI决策会议系统入口。后续员工、老板或负责人提出问题时，可以进入AI委员会会议流程。

**Canonical files:**

- `projects/AI委员会/AI委员会系统规则_V0.1.md`
- `projects/AI委员会/templates/`
- `projects/AI委员会/roles/`
- `scripts/New-AICommitteeMeeting.ps1`

### 2026-08-01 - Deploy AI committee V1.0 initialization layer

**Decision:** 在 V0.1 文件会议系统基础上，执行《海中宝AI委员会V1.0初始化部署任务书》，补齐设备登记、AI身份卡、账号权限映射、中央同步规则和第一场测试会议。

**Why:** V0.1 证明会议文件系统可行；V1.0 需要让 AI 委员会具备组织资产、身份权限、同步归档和测试会议能力。

**Principles:**

1. 不创建第二套中央大脑。
2. 不保存真实密码。
3. 不自动获得Owner权限。
4. `PROJECT_STATUS.md` 只做兼容入口，唯一状态正文仍是 `海中宝AI项目状态总览.md`。

**Canonical files:**

- `projects/AI委员会/海中宝AI委员会V1.0初始化部署任务书.md`
- `00_海中宝AI治理总纲/07_运行制度/AI设备资产表.md`
- `00_海中宝AI治理总纲/07_运行制度/AI账号权限表.md`
- `00_海中宝AI治理总纲/07_运行制度/AI中央同步规则V1.0.md`
- `projects/AI委员会/AI角色身份卡/`
- `projects/AI委员会/meetings/HZB-AI-COMMITTEE-TEST-001_海中宝AI中央大脑下一阶段建设规划/`
