# Pi Setting

记录我日常使用的 Pi 设置：插件组合、工具选择、界面习惯，以及上下文管理配置。

这套组合主要围绕代码定位与修改、外部资料检索和长会话展开：陌生代码库优先用 fast-context 做语义定位，精确文本搜索使用 `rg` / `anchor_grep`；文件修改使用行锚点工具；网络搜索、网页提取和研究汇总由 Parallel 提供，需要浏览器交互时使用 Playwright。Magic Context 负责当前会话的上下文压缩与恢复，不承担跨会话记忆。

## 配置特点

- **中文与主题**：中文界面搭配自定义深色主题 [`wallpaper-dark`](agent/themes/wallpaper-dark.json)，使用常规 TUI 模式。
- **图片粘贴**：[`keybindings.json`](agent/keybindings.json) 将剪贴板图片粘贴绑定为 `Alt+V`。
- **全局工具选择**：通过本地 `tools.ts` 扩展管理工具开关，选择保存在 [`tool-selection.json`](agent/tool-selection.json)，跨项目和会话共用；当前启用 `replace_match` 与 `tool_search`（MCP 工具经 `tool_search` 按需加载），不启用 SSH 工具。
- **思考与重试**：[`settings.json`](agent/settings.json) 中默认思考等级与 supergsd 子任务思考等级均为 `max`，显示思考内容，并启用自动重试。
- **上下文管理**：Magic Context 启用当前会话压缩、恢复和待办覆盖层，关闭持久记忆、自动记忆搜索与提升、Git 提交索引、dreamer、sidekick 和 embedding；另有[自定义行为说明](config/cortexkit/magic-context-compression-only.md)约束其使用范围。
- **代码原则**：[`APPEND_SYSTEM.md`](agent/APPEND_SYSTEM.md) 要求只实现当前需求、保持最小 diff、不做无关重构，并区分语义代码搜索与精确文本搜索。
- **开发记录边界**：README 可自行更新，该写进 `AGENTS.md` 的技术内容不写进 README；`AGENTS.md` 只记录已验证且长期有效的约束。

## Pi 插件

| 插件 | 版本 | 作用 |
|---|---|---|
| `pi-supergsd` | `0.2.10` | 提供开发工作流工具与 skills |
| `@juicesharp/rpiv-ask-user-question` | `2.12.0` | 通过选项、预览等方式向用户提出结构化问题 |
| `@juicesharp/rpiv-i18n` | `2.12.0` | 中文界面 |
| [`@parallel-web/pi-extension`](https://github.com/parallel-web/parallel-npm-packages/tree/main/packages/pi-extension) | `1.3.0` | `web_search` 搜索来源，`web_fetch` 提取网页，`web_research` 汇总研究并提供来源 |
| `pi-token-stats` | `0.1.1` | Token 用量统计 |
| `@ogulcancelik/pi-ssh-tools` | `0.1.6` | 提供 SSH 远程命令与文件操作工具；当前工具白名单未启用 |
| `pi-hashline-edit-pro` | `6.1.2` | 基于行锚点读取、搜索和编辑文件，支持局部替换与撤销修改 |
| `@cortexkit/pi-magic-context` | `0.44.4` | 当前会话的上下文压缩、恢复与待办覆盖层；本工作流不启用持久记忆 |

## 本地扩展

| 扩展 | 作用 |
|---|---|
| [`tools.ts`](agent/extensions/tools.ts) | 提供 `/tools` 全局工具开关，跨项目和会话保存工具选择 |

## MCP 服务

由 Pi 内置 MCP 接入（用户级 `~/.pi/agent/mcp.json`，示例见 [`mcp.example.json`](config/mcp/mcp.example.json)）：两个服务均以 `deferred` 暴露，工具由 `tool_search` 按需加载。

| 服务 | 版本 | 作用 |
|---|---|---|
| `@sammysnake/fast-context-mcp` | `1.3.2` | 按语义搜索代码库，定位相关文件和调用链 |
| `@playwright/mcp` | `0.0.82` | 浏览器自动化、网页交互与页面检查 |

## 目录结构

```text
pi-setting/
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
