# Pi Workflow

记录我日常使用的 Pi 编程工作流：插件组合、工具选择、界面习惯，以及上下文管理配置。

这套组合主要围绕代码定位与修改、外部资料检索和长会话展开：陌生代码库优先用 fast-context 做语义定位，精确文本搜索使用 `rg` / `anchor_grep`；文件修改使用行锚点工具；网络搜索、网页提取和研究汇总由 Parallel 提供，需要浏览器交互时使用 Playwright。Magic Context 负责当前会话的上下文压缩与恢复，不承担跨会话记忆。

## 配置特点

- **中文与主题**：中文界面搭配自定义深色主题 [`wallpaper-dark`](agent/themes/wallpaper-dark.json)，使用常规 TUI 模式。
- **图片粘贴**：[`keybindings.json`](agent/keybindings.json) 将剪贴板图片粘贴绑定为 `Alt+V`。
- **全局工具选择**：通过本地 `tools.ts` 扩展管理工具开关，选择保存在 [`tool-selection.json`](agent/tool-selection.json)，跨项目和会话共用。
- **思考与重试**：[`settings.json`](agent/settings.json) 中默认思考等级为 `xhigh`，显示思考内容，并启用自动重试。
- **上下文管理**：保留当前会话压缩与恢复，关闭持久记忆、自动记忆搜索与提升、Git 提交索引、dreamer、sidekick 和 embedding；另有[自定义行为说明](config/cortexkit/magic-context-compression-only.md)约束其使用范围。
- **代码原则**：[`APPEND_SYSTEM.md`](agent/APPEND_SYSTEM.md) 强调“少即是多、如无必要勿增实体”，优先修改现有代码，只实现当前需求，测试聚焦核心行为与必要回归。
- **开发记录边界**：仅在用户明确确认开发完成并要求时更新 README；长期有效的项目约束按需维护在 `AGENTS.md`，本轮待办使用任务列表，确需跨会话保存时才使用 Issue 或 `TODO.md`。
- **工作区回退**：`pi-workspace-history` 保存工作区快照，支持撤销、重做和手动检查点；历史导航可选择恢复文件或只回退对话，不回退 Git 提交历史。

## Pi 插件

| 插件 | 版本 | 作用 |
|---|---|---|
| `pi-supergsd` | `0.2.10` | 提供开发工作流工具与 skills |
| `@juicesharp/rpiv-ask-user-question` | `2.11.0` | 通过选项、预览等方式向用户提出结构化问题 |
| `@juicesharp/rpiv-i18n` | `2.11.0` | 中文界面 |
| [`@parallel-web/pi-extension`](https://github.com/parallel-web/parallel-npm-packages/tree/main/packages/pi-extension) | `1.3.0` | `web_search` 搜索来源，`web_fetch` 提取网页，`web_research` 汇总研究并提供来源 |
| `pi-token-stats` | `0.1.1` | Token 用量统计 |
| `pi-mcp-adapter` | `2.37.0` | 接入 MCP 服务，发现和调用外部工具 |
| `@ogulcancelik/pi-ssh-tools` | `0.1.6` | 通过 SSH 执行远程命令、编辑和写入文件 |
| `pi-hashline-edit-pro` | `4.4.1` | 基于行锚点读取、编辑、搜索文件，并支持撤销修改 |
| `@cortexkit/pi-magic-context` | `0.43.1` | 当前会话的上下文压缩与恢复；本工作流不启用持久记忆 |
| [`pi-workspace-history`](https://github.com/wcldyx/pi-workspace-history) | `0.4.3` | 工作区快照、撤销/重做和手动检查点，联动历史树导航 |

## 本地扩展

| 扩展 | 作用 |
|---|---|
| [`tools.ts`](agent/extensions/tools.ts) | 提供 `/tools` 全局工具开关，跨项目和会话保存工具选择 |

## MCP 服务

| 服务 | 版本 | 作用 |
|---|---|---|
| `@sammysnake/fast-context-mcp` | `1.3.2` | 按语义搜索代码库，定位相关文件和调用链 |
| `@playwright/mcp` | `0.0.82` | 浏览器自动化、网页交互与页面检查 |

## 目录结构

```text
pi-workflow/
├── README.md
├── .gitignore                       # 排除凭据、会话、缓存和依赖
├── agent/
│   ├── settings.json                # Pi 设置与插件版本
│   ├── keybindings.json             # 快捷键
│   ├── APPEND_SYSTEM.md             # 代码原则、开发记录边界与工具偏好
│   ├── tool-selection.json          # 全局工具选择
│   ├── extensions/
│   │   ├── tools.ts                 # 工具开关扩展
│   │   └── tools.LICENSE            # 上游 MIT 许可
│   └── themes/wallpaper-dark.json   # 自定义深色主题
└── config/
    ├── rpiv-i18n/locale.json         # 中文界面设置
    ├── cortexkit/
    │   ├── magic-context.jsonc      # 仅当前会话压缩的配置
    │   └── magic-context-compression-only.md # 自定义上下文管理规则
    └── mcp/mcp.example.json          # MCP 服务配置示例
```

## 分享范围

保留插件来源与版本、本地工具开关扩展、Pi 和插件的个性化配置，以及 MCP 配置示例。普通插件不复制安装目录。Parallel 使用 Pi 的认证存储或环境变量，不附带独立搜索配置文件。

不包含个人模型供应商配置、API Key、登录凭据、SSH 密钥、会话及其导出文件、工作区快照、日志、缓存、数据库、浏览器登录数据或已安装依赖。
