# Pi Workflow

我使用的 Pi 插件及其作用。

## Pi 插件

| 插件 | 版本 | 作用 |
|---|---|---|
| `pi-supergsd` | `0.2.10` | 提供开发工作流工具与 skills |
| `@juicesharp/rpiv-ask-user-question` | `2.11.0` | 通过选项、预览等方式向用户提出结构化问题 |
| `@juicesharp/rpiv-i18n` | `2.11.0` | 中文界面 |
| [`pi-search`](https://github.com/justhil/pi-search) | `7a0be135` | 网络搜索、文档检索和网页抓取 |
| `pi-token-stats` | `0.1.1` | Token 用量统计 |
| `pi-mcp-adapter` | `2.37.0` | 接入 MCP 服务，发现和调用外部工具 |
| `@ogulcancelik/pi-ssh-tools` | `0.1.6` | 通过 SSH 执行远程命令、编辑和写入文件 |
| `pi-hashline-edit-pro` | `4.4.1` | 基于行锚点读取、编辑、搜索文件，并支持撤销修改 |
| `@cortexkit/pi-magic-context` | `0.43.1` | 当前会话的上下文压缩与恢复；本工作流不启用持久记忆 |

## 本地扩展

| 扩展 | 作用 |
|---|---|
| [`tools.ts`](agent/extensions/tools.ts) | 提供 `/tools` 全局工具开关，跨项目和会话保存工具选择 |

## MCP 服务

| 服务 | 版本 | 作用 |
|---|---|---|
| `@sammysnake/fast-context-mcp` | `1.3.2` | 按语义搜索代码库，定位相关文件和调用链 |
| `@playwright/mcp` | `0.0.82` | 浏览器自动化、网页交互与页面检查 |
