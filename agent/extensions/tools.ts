/**
 * 全局工具开关扩展
 *
 * 提供 `/tools` 命令，用于交互式启用或禁用工具。
 * 工具选择保存在用户级 `tool-selection.json`，所有项目和会话共用。
 */

import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
	getAgentDir,
	getSettingsListTheme,
	type ExtensionAPI,
	type ExtensionContext,
	type ToolInfo,
} from "@earendil-works/pi-coding-agent";
import { Container, type SettingItem, SettingsList } from "@earendil-works/pi-tui";

interface ToolsState {
	version: 1;
	enabledTools: string[];
}

const STATE_PATH = join(getAgentDir(), "tool-selection.json");

function loadGlobalState(): ToolsState | undefined {
	let raw: string;
	try {
		raw = readFileSync(STATE_PATH, "utf8");
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
			return undefined;
		}
		throw error;
	}

	const parsed = JSON.parse(raw) as Partial<ToolsState>;
	if (!Array.isArray(parsed.enabledTools) || !parsed.enabledTools.every((name) => typeof name === "string")) {
		throw new Error(`无效的工具配置文件：${STATE_PATH}`);
	}

	return {
		version: 1,
		enabledTools: [...new Set(parsed.enabledTools)],
	};
}

function saveGlobalState(state: ToolsState): void {
	mkdirSync(dirname(STATE_PATH), { recursive: true });
	const temporaryPath = `${STATE_PATH}.${process.pid}.${Date.now()}.tmp`;

	try {
		writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, {
			encoding: "utf8",
			mode: 0o600,
		});
		renameSync(temporaryPath, STATE_PATH);
	} finally {
		rmSync(temporaryPath, { force: true });
	}
}

export default function toolsExtension(pi: ExtensionAPI) {
	let enabledTools = new Set<string>();
	let allTools: ToolInfo[] = [];

	function currentState(): ToolsState {
		return {
			version: 1,
			enabledTools: Array.from(enabledTools),
		};
	}

	function persistState(): void {
		const state = currentState();
		saveGlobalState(state);
		// 会话条目仅用于记录变更；恢复时始终以全局文件为准。
		pi.appendEntry<ToolsState>("tools-config", state);
	}

	function applyTools(): void {
		pi.setActiveTools(Array.from(enabledTools));
	}

	function restoreGlobalState(ctx: ExtensionContext): void {
		allTools = pi.getAllTools();

		try {
			const savedState = loadGlobalState();
			if (savedState) {
				enabledTools = new Set(savedState.enabledTools);
			} else {
				enabledTools = new Set(pi.getActiveTools());
				saveGlobalState(currentState());
			}
			applyTools();
		} catch (error) {
			enabledTools = new Set(pi.getActiveTools());
			const message = error instanceof Error ? error.message : String(error);
			ctx.ui.notify(`无法读取全局工具配置：${message}`, "error");
		}
	}

	pi.registerCommand("tools", {
		description: "全局启用或禁用工具",
		handler: async (_args, ctx) => {
			if (ctx.mode !== "tui") {
				ctx.ui.notify("/tools 仅支持 TUI 模式", "error");
				return;
			}

			// 每次打开面板都重新读取全局状态，以接收其他会话的修改。
			restoreGlobalState(ctx);

			await ctx.ui.custom((tui, theme, _kb, done) => {
				const items: SettingItem[] = allTools.map((tool) => ({
					id: tool.name,
					label: tool.name,
					currentValue: enabledTools.has(tool.name) ? "enabled" : "disabled",
					values: ["enabled", "disabled"],
				}));

				const container = new Container();
				container.addChild(
					new (class {
						render(_width: number) {
							return [theme.fg("accent", theme.bold("工具配置（全局）")), ""];
						}
						invalidate() {}
					})(),
				);

				const settingsList = new SettingsList(
					items,
					Math.min(items.length + 2, 15),
					getSettingsListTheme(),
					(id, newValue) => {
						if (newValue === "enabled") {
							enabledTools.add(id);
						} else {
							enabledTools.delete(id);
						}

						applyTools();
						try {
							persistState();
						} catch (error) {
							const message = error instanceof Error ? error.message : String(error);
							ctx.ui.notify(`无法保存全局工具配置：${message}`, "error");
						}
					},
					() => done(undefined),
				);

				container.addChild(settingsList);

				return {
					render(width: number) {
						return container.render(width);
					},
					invalidate() {
						container.invalidate();
					},
					handleInput(data: string) {
						settingsList.handleInput?.(data);
						tui.requestRender();
					},
				};
			});
		},
	});

	// 每个新建、恢复、派生或重载的会话都应用同一份全局选择。
	pi.on("session_start", async (_event, ctx) => {
		restoreGlobalState(ctx);
	});

	// 树导航后继续以全局状态为准，避免旧分支中的会话条目覆盖它。
	pi.on("session_tree", async (_event, ctx) => {
		restoreGlobalState(ctx);
	});
}
