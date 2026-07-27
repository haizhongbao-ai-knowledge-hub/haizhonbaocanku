# 海中宝AI灾备恢复演练方案 V1.0

状态：【第一阶段启用，待演练】

## 一、目的

确保办公室电脑、家里电脑、云仓库或账号出现异常时，海中宝 AI 中央大脑可以恢复。

## 二、恢复来源

优先级：

1. GitHub 云仓库
2. 本地 Git 仓库
3. Git bundle 备份
4. Zip 文件备份
5. 一键接入大脑文件

## 三、场景一：办公室电脑坏掉

恢复步骤：

1. 在新电脑登录 GitHub。
2. 安装 Git / 打开 Codex。
3. 执行：

```powershell
cd D:\
git clone https://github.com/haizhongbao-ai-knowledge-hub/haizhonbaocanku.git "海中宝AI总文件"
cd "D:\海中宝AI总文件"
git status
```

4. 给 Codex 读取：

- `海中宝AI一键接入大脑文件.md`
- `海中宝AI项目状态总览.md`
- `KNOWLEDGE_HUB.md`
- `TASKS.md`
- `HANDOFF.md`

5. Codex 输出当前理解确认。

## 四、场景二：GitHub暂时无法访问

恢复步骤：

1. 使用本地备份目录：

```text
D:\Administrator\Documents\海中宝AI备份
```

2. 优先使用 `.bundle` 恢复 Git 仓库。

示例：

```powershell
git clone "D:\Administrator\Documents\海中宝AI备份\海中宝AI总文件-YYYYMMDD-HHMMSS.bundle" "D:\海中宝AI总文件-恢复"
```

3. 如果不懂 Git，直接解压 `.zip` 查看文件。

## 五、场景三：新GPT/Codex账号没有历史记忆

恢复步骤：

1. 上传或复制：

```text
海中宝AI一键接入大脑文件.md
```

2. 再提供：

```text
海中宝AI项目状态总览.md
```

3. 如果是 Codex，再让它 clone GitHub 仓库。

## 六、演练计划

建议每月演练一次。

第一次演练目标：

- 在家里电脑 clone 仓库。
- 让家里 Codex 读取接入包。
- 让家里 GPT 读取一键接入文件。
- 验证二者都能汇报同一份项目状态。

## 七、演练结果记录

演练后记录：

- 日期
- 使用电脑
- 使用账号
- 是否成功 clone
- 是否成功读取项目状态
- 是否能进入老板汇报模式
- 遇到问题
- 下一步修正

