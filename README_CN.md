# AIMate 中文说明文档

本项目基于 [Nimbalyst](https://nimbalyst.com) 进行二次开发，主开发分支为 `aimate-core`。

## 分支说明

| 分支 | 说明 |
| --- | --- |
| `main` | 与官方上游（upstream）保持同步的纯净分支，不包含任何二次开发修改 |
| `aimate-core` | 二次开发主分支，所有自定义功能在此分支上开发 |

## 远程仓库

| 远程名 | 地址 | 说明 |
| --- | --- | --- |
| `origin` | `https://github.com/clawgit-wy/AIMate.git` | 你自己的远程仓库 |
| `upstream` | `git@github.com:clawgit-wy/nimbalyst.git` | 官方上游仓库 |

## 日常维护流程

当官方上游有更新时，按以下步骤将更新合入你的二次开发分支：

```bash
# 步骤 1：切换到纯净的 main 分支
git checkout main

# 步骤 2：从官方（upstream）拉取最新的代码
git pull upstream main

# 步骤 3：把最新的官方代码推送到你自己的 main 仓库（保持云端同步）
git push origin main

# 步骤 4：切换回你的魔改主分支
git checkout aimate-core

# 步骤 5：使用变基，把官方的新更新"垫"到你的代码最底层
git rebase main
```

> ⚠️ **注意**：如果 `git rebase main` 过程中出现冲突，需要手动解决冲突后执行：
> ```bash
> git add <冲突文件>
> git rebase --continue
> ```
> 如果想放弃变基操作，可以执行 `git rebase --abort`。
