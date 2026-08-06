# Cloud Integration Plan

## 当前状态

当前已完成本地基础结构和连接器骨架，尚未完成真实云端部署。

不能把当前状态描述为“手机端已实时连接中央仓库”。

## 推荐方案 A：MCP 仓库连接器

优先建设自定义 MCP 连接器，提供只读能力：

- `search_repository`
- `list_directory`
- `read_file`
- `get_current_state`
- `get_v0_context`
- `get_related_decisions`

后续再开放受控写入能力：

- `submit_memory_candidate`
- `approve_memory_candidate`
- `write_approved_memory`
- `append_decision_log`
- `update_current_context`

## 推荐方案 B：定期同步知识源

如果 MCP 暂时无法部署，则先把中央仓库定期同步为云端可读取知识源。

必须标明：

- 是否实时：否。
- 同步频率：待配置。
- 数据延迟：取决于同步频率。
- 写回限制：需要人工或受控脚本。
- 手机端可用性：取决于云端知识源入口。

## 阶段建议

1. 先完成只读。
2. 再完成候选沉淀。
3. 再完成确认后写入。
4. 最后做多 AI 权限读取。

