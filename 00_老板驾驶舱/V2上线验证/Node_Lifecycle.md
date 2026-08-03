# Node Lifecycle

状态：【Draft】

## 一、节点统一生命周期

```text
Offline
↓
Boot（启动）
↓
QA Gate①
↓
Trial（试运行）
↓
QA Gate②
↓
Production（正式运行）
↓
QA Gate③
↓
Stable（稳定运行）
```

## 二、阶段说明

Boot：
仅允许读取、注册、身份认证、Heartbeat。

Trial：
允许执行真实任务，但必须经过V0审批。

Production：
通过验收后，Dispatcher可正常派单。

Stable：
连续稳定运行后进入长期运行状态。

## 三、当前状态

Draft（待讨论）。
