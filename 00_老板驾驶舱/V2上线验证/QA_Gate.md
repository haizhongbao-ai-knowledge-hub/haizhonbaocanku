# QA Gate

状态：【Draft】

## 一、用途

所有重要节点必须经过QA Gate。

## 二、QA Gate编号示例

```text
QA-GATE-001
```

## 三、标准输出字段

| 字段 | 说明 |
| --- | --- |
| QA编号 | 唯一编号 |
| Node | 节点名称 |
| Phase | 当前阶段 |
| Result | PASS / FAIL / CONDITIONAL |
| Risk | LOW / MEDIUM / HIGH |
| Next | 是否进入下一阶段 |

## 四、示例

| QA编号 | Node | Phase | Result | Risk | Next |
| --- | --- | --- | --- | --- | --- |
| QA-GATE-001 | V2 | Trial-1 | PASS | LOW | 进入Dispatcher验证 |

## 五、状态

Draft（待讨论）。
