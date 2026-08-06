# V0 Connector Runbook

## 当前实现状态

已实现本地 Node.js 只读连接器。

当前不是远程 MCP 服务，也不是 HTTPS API 服务。

## 运行环境

- Node.js：可用。
- Python：当前环境不可用，`py` 不存在，`python.exe` 指向 WindowsApps 占位但无法执行。

## 本地测试

```powershell
node V0_PERSONAL_ASSISTANT\CONNECTOR\connector_test.js
```

预期输出：

```text
connector tests passed
```

## 只读工具

- `searchRepository`
- `listDirectory`
- `readFile`
- `getCurrentState`
- `getV0Context`
- `getRelatedDecisions`

## 身份

- `v0_assistant`
- `v0_strategy_ai`
- `finance_ai`
- `hr_ai`
- `data_ai`
- `executor_ai`

## 重要限制

- 尚未远程部署。
- 尚未提供 ChatGPT 手机端可直接调用的 MCP/API 地址。
- 尚未开放正式写入。
- 写入必须等只读链路通过真实手机端和电脑端测试后再开放。

