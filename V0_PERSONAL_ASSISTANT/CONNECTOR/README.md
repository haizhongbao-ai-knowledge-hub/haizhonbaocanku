# Connector

这里是 V0 全能 AI 助理的云端对接骨架。

## 目标

- 只读访问中央仓库。
- 生成候选内容。
- 经 V0 确认后写入。
- 保留审计记录。
- 执行最小权限校验。

## 接口分层

### 只读

- `search_repository`
- `list_directory`
- `read_file`
- `get_current_state`
- `get_v0_context`
- `get_related_decisions`

### 候选

- `submit_memory_candidate`

### 确认后写入

- `approve_memory_candidate`
- `write_approved_memory`
- `append_decision_log`
- `update_current_context`

## 约束

- 不允许越权读取。
- 不允许覆盖未知内容。
- 不允许跳过确认直接写入正式区。
- 必须记录路径、时间、来源、确认人。

