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

---

## 项目简介

[Nimbalyst](https://nimbalyst.com) 是一款免费、本地的交互式可视化编辑器与会话管理器，帮助开发者在使用 Codex、Claude Code、Opencode（alpha）、Copilot（alpha） 时最大化速度、带宽和上下文能力，通过可视化方式协作处理文件、会话和任务：

- 与编程 Agent 在 Markdown、模型图、流程图、CSV、Excalidraw、数据模型和代码中进行可视化迭代。以红/绿所见即所得的方式审批 Agent 的更改，编辑、批注。
- 在看板中并行管理多个会话。搜索、恢复会话，将会话关联到文件、文件关联到会话。面向开发者，我们还提供 Git 管理、AI 提交、工作流和工作树功能。
- 管理任务。跟踪你的计划、Bug、待办事项等。让 Agent 编辑任务和项目、添加、移动和执行它们。人类也可以查看和编辑。
- 扩展 Nimbalyst。构建你自己的自定义编辑器和可视化界面，与 Nimbalyst 的其余部分及你的 Agent 集成。
- 移动应用。随时随地启动、管理和回复你的 Codex 和 Claude Code 会话。

![Version](https://img.shields.io/github/v/release/nimbalyst/nimbalyst)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)

## 功能特性

**可视化编辑器：** 内置所见即所得编辑器，你和编程 Agent 在此可视化协作。以红/绿差异方式审批 Agent 更改，编辑、批注和迭代。

- Markdown
- 带批注的模型图
- Mermaid 流程图
- Excalidraw 画板
- CSV 表格
- 数据模型
- Monaco 代码编辑器

![Nimbalyst files and editors](./.github/assets/nimbalyst-hero-files-dev-dark.png)

**会话管理：** 在 UI 中跨并行会话管理编程 Agent 的工作

- 将会话关联到文件，将文件关联到会话
- 在会话中打开文件，按会话分组已处理的文件
- 并行运行会话
- 搜索和恢复会话
- 在看板中管理

![Nimbalyst session kanban](./.github/assets/sessions-kanban-dark.webp)

**任务跟踪：** 跟踪你的计划、Bug、功能需求、待办事项等

- 让 Agent 编辑任务、添加、移动和执行它们
- 人类也可以查看和编辑

**面向开发者**

- 管理 Git 状态
- 使用 AI 进行 Git 提交
- 使用内嵌的 Ghostty 终端
- 利用工作树（Worktree）

![Nimbalyst developer view](./.github/assets/developers-dark.webp)

**移动应用**

- 会话仪表板：查看哪些 Agent 需要你的关注，哪些仍在工作中
- 通过文本或语音回复问题，Agent 立即恢复工作
- 可视化差异审查：滑动查看更改，点击审批
- 排队下一个任务：保持流水线满载，不让 Agent 闲置
- 推送通知：Agent 会在需要你时通知你

**开放式存储** — 内容和状态以 Markdown 存储，工作流使用斜杠命令，普通文件存储在磁盘或 Git 中。

**扩展系统**

- 可插拔的编辑器支持任何文件类型。每个编辑器（包括内置编辑器）都通过相同的 `EditorHost` 契约运行，因此自定义编辑器是一等公民。
- 当前的扩展包括 Astro 网站编辑器、可视化 Git 日志、思维导图、幻灯片和 3D 对象编辑器。

![Nimbalyst extension marketplace](./.github/assets/extension-marketplace-dark.png)

**支持的编程 Agent**

- Codex
- Claude Code
- Opencode（alpha）
- Copilot（alpha）

## 快速上手

1. **创建或打开文档** — 点击 "New" 或按 `Cmd/Ctrl+N`
2. **用 Markdown 编写** — 在所见即所得编辑器中编写/编辑
3. **使用 AI 助手** — 让 AI 研究、编辑文档、跨文件工作
4. **接受/拒绝 AI 更改** — 逐步审阅 AI 建议的编辑，接受或拒绝
5. **在 Agent 管理器中工作** — 切换到 Agent 管理器视图，并行运行多个 Agent 会话
6. **搜索/恢复会话** — 搜索并恢复会话，管理你的工作

## 自动更新

Nimbalyst 会自动检查更新，并在有新版本时通知你。你也可以通过 Help → Check for Updates 手动检查。

默认情况下，全新安装使用 **稳定版** 发布渠道，仅接收已发布的版本。如果你想获取抢先体验版本，请在 **Settings → Advanced → Release Channel** 下切换到 **alpha** 渠道。Alpha 版本较为粗糙，可能会出现问题；随时可以切回稳定版。

## 遥测

Nimbalyst 向 PostHog 发送**匿名使用分析数据**，以便我们了解应用的使用情况并优先改进。我们绝不收集：

- 用户名、电子邮件或 IP 地址（不收集个人身份信息）
- 文件内容或文件路径（仅使用分类桶）
- API 密钥或身份验证令牌
- 文档、会话或聊天内容

使用随机生成的匿名 ID 来关联同一安装的事件。你可以随时在 **Settings → Advanced → Analytics** 中选择退出。

有关我们发送的每个事件及其属性的完整列表，请参阅 [POSTHOG_EVENTS.md](./docs/POSTHOG_EVENTS.md)。有关我们的分析代码遵循的隐私规则，请参阅 [ANALYTICS_GUIDE.md](./docs/ANALYTICS_GUIDE.md)。

## 从源码构建

Nimbalyst 是一个使用 npm workspaces 的 TypeScript / Electron 单体仓库。

```bash
# 安装依赖（需要 npm 7+）
npm install

# 以开发模式启动 Electron 应用
cd packages/electron && npm run dev

# 构建本地 Mac 二进制文件
cd packages/electron && npm run build:mac:local
```

主要工作空间：

- `packages/ios` — 原生 iOS 应用（SwiftUI）
- `packages/electron` — 桌面应用（Electron）
- `packages/runtime` — 跨平台运行时服务（AI、同步、Lexical 编辑器）
- `packages/extension-sdk` — 扩展开发套件
- `packages/extensions` — 内置扩展
- `packages/collabv3` — 协作服务器（AGPL-3.0；见下方许可证）

有关更深入的架构和贡献者指南，请参阅 [CLAUDE.md](./CLAUDE.md) 和 [`docs/`](./docs) 下的文档。有关贡献规则、DCO 签名要求以及 `packages/collabv3/` 的特殊规定，请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 社区

- [文档](https://docs.nimbalyst.com/) — 观看视频和阅读文档
- [Discord](https://discord.gg/FgD9S2MCYB) — 加入讨论
- [官网](https://nimbalyst.com) — 了解更多关于 Nimbalyst 的信息

## 许可证

Nimbalyst 采用**双重许可**：

- 本仓库默认采用 **MIT 许可证** — 详见 [LICENSE](./LICENSE)。
- [`packages/collabv3/`](./packages/collabv3/) 的内容（多租户协作服务器）采用 **GNU Affero General Public License v3.0** 许可，或者，你也可以选择从 Nimbalyst Inc. 获取单独的商业许可证 — 详见 [`packages/collabv3/LICENSE`](./packages/collabv3/LICENSE)。

有关双重许可结构的说明和联系方式，请参阅 [LICENSING.md](./LICENSING.md)。

## 致谢

构建使用：
- [Electron](https://electronjs.org/)
- [Lexical](https://lexical.dev/) by Meta
- [React](https://reactjs.org/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Excalidraw](https://excalidraw.com/)
