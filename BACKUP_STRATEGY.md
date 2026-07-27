# 海中宝AI备份策略

状态：【启用】

目标：同时保留本地备份和云端仓库，避免办公室电脑故障、家里电脑故障或 GitHub 访问异常时找不到项目大脑和记忆。

## 一、备份位置

本地备份目录：

```text
D:\Administrator\Documents\海中宝AI备份
```

GitHub 仓库：

```text
https://github.com/haizhongbao-ai-knowledge-hub/haizhonbaocanku
```

## 二、本地备份类型

### 1. Git bundle

用途：完整保存 Git 历史，可以恢复整个仓库。

文件示例：

```text
海中宝AI总文件-YYYYMMDD-HHMMSS.bundle
```

恢复示例：

```powershell
git clone "D:\Administrator\Documents\海中宝AI备份\海中宝AI总文件-YYYYMMDD-HHMMSS.bundle" "D:\海中宝AI总文件-恢复"
```

### 2. Zip 压缩包

用途：方便直接打开查看文件，不依赖 Git 操作经验。

文件示例：

```text
海中宝AI总文件-YYYYMMDD-HHMMSS.zip
```

## 三、日常备份节奏

重要更新后：

1. 先提交 Git。
2. 再推送 GitHub。
3. 再生成本地 bundle 和 zip。

建议频率：

- 重大规则、宪法、治理体系更新后：立即备份。
- 普通文档更新后：每天结束前备份一次。
- 长期项目推进阶段：每周至少保留一个完整备份。

## 四、当前状态

办公室电脑已建立：

- 本地 Git 仓库
- GitHub 远程仓库
- 本地备份目录
- Git bundle 备份
- Zip 文件备份

如果 GitHub 推送失败，至少本地 Git 和本地备份仍可恢复项目。

如果办公室电脑出错，可以通过 GitHub 或备份文件恢复。

