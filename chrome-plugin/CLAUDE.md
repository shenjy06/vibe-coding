# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

chrome-plugin 是 Chrome 浏览器扩展合集，所有插件基于 Manifest V3 开发，使用纯 HTML/CSS/JavaScript 实现。

## 运行方式

所有插件均通过 Chrome "加载已解压的扩展程序" 方式运行，无需构建工具：

```bash
# 1. 打开 Chrome，地址栏输入
chrome://extensions/

# 2. 开启右上角「开发者模式」

# 3. 点击「加载已解压的扩展程序」，选择对应插件目录
```

## 项目结构

```
chrome-plugin/
├── CLAUDE.md           # 本文件 — Chrome 插件开发指南
├── chrome-record/      # 摄像头录像 + Tab 录制插件
│   ├── manifest.json   # Manifest V3 配置
│   ├── background.js   # Service Worker（后台）
│   ├── popup.*         # 插件弹窗（action popup）
│   ├── camera.*        # 摄像头窗口
│   ├── recorder.*      # Tab 录制窗口
│   └── icons/          # 图标（16/48/128px PNG）
└── <新插件>/           # 每个插件一个目录
```

## 新增插件模板

每个插件目录必须包含：
1. `manifest.json` — Manifest V3 配置文件
2. `README.md` — 中文说明（功能、安装、使用、技术栈）
3. `icons/` — 插件图标（至少包含 16px、48px、128px 三个尺寸的 PNG）

## Manifest V3 核心约定

### manifest.json 基础结构

```json
{
  "manifest_version": 3,
  "name": "插件名称",
  "version": "1.0.0",
  "description": "插件描述",
  "permissions": [],
  "action": {
    "default_popup": "popup.html",
    "default_icon": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" }
  },
  "background": {
    "service_worker": "background.js"
  },
  "icons": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" }
}
```

### 关键概念

| 概念 | 说明 |
|------|------|
| **Service Worker** | V3 用 Service Worker 替代 V2 的 background page，事件驱动，不能访问 DOM |
| **Action Popup** | 点击插件图标弹出的页面，关闭后状态丢失 |
| **Content Script** | 注入到网页中运行的脚本，可访问有限 DOM API |
| **Permissions** | 权限声明，按需申请（`tabCapture`、`storage`、`activeTab` 等） |

### V2 → V3 迁移要点

- `background.scripts` → `background.service_worker`
- `browser_action` / `page_action` → `action`
- `chrome.browserAction` → `chrome.action`
- 不再支持持久化后台页面，改用事件驱动
- `XMLHttpRequest` → `fetch`（Service Worker 中无 XHR）

## 常用 API 速查

### 插件内部通信

```js
// Popup/Content Script → Service Worker
chrome.runtime.sendMessage({ type: 'ACTION', data: payload }, (response) => {});

// Service Worker 监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {});

// Content Script ↔ Service Worker 长连接
const port = chrome.runtime.connect({ name: 'channel' });
```

### 标签页操作

```js
// 获取当前标签页
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// 执行 Content Script
chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
```

### 存储

```js
// 本地存储（无需权限）
await chrome.storage.local.set({ key: value });
const { key } = await chrome.storage.local.get('key');

// 监听变化
chrome.storage.onChanged.addListener((changes, area) => {});
```

### 媒体捕获

```js
// Tab 录制（需 tabCapture 权限）
const stream = await chrome.tabCapture.capture({ audio: true, video: true });

// 用户选择标签页录制（无需特殊权限，弹出系统选择器）
const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

// 摄像头
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
```

## 开发调试

```bash
# Popup 调试
# 右键插件图标 → 「审查弹出内容」，打开 DevTools

# Service Worker 调试
# chrome://extensions/ → 对应插件的「检查视图」链接

# Content Script 调试
# 在目标网页的 DevTools Sources → Content Scripts 面板

# 修改代码后
# chrome://extensions/ → 点击插件的刷新按钮（无需重启浏览器）
```

## 打包发布

```bash
# 本地打包
# chrome://extensions/ → 点击「打包扩展程序」→ 选择插件目录
# 生成 .crx 和 .pem 文件

# 注意
# - .pem 私钥是更新插件的凭证，必须妥善保管
# - .pem 不得提交到版本库（已在 .gitignore 中排除）
# - 首次打包生成 .pem，后续更新使用同一个 .pem
```

## 代码规范

- **单文件模式**：每个页面（popup、camera 等）由独立的 `.html` + `.css` + `.js` 组成，CSS 和 JS 通过 `<link>` / `<script>` 引入
- **纯原生**：不引入任何框架或库，使用原生 DOM API
- **中文界面**：UI 文本使用中文，代码变量/函数名使用英文
- **消息通信**：组件间通过 `chrome.runtime.sendMessage` 通信，不使用全局变量共享状态

## 官方文档

| 主题 | 链接 |
|------|------|
| 开发入门 | https://developer.chrome.com/docs/extensions/get-started |
| Manifest V3 参考 | https://developer.chrome.com/docs/extensions/reference/api |
| Manifest V3 概念 | https://developer.chrome.com/docs/extensions/develop |
| Service Worker | https://developer.chrome.com/docs/extensions/develop/concepts/service-workers |
| Content Scripts | https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts |
| 消息通信 | https://developer.chrome.com/docs/extensions/develop/concepts/messaging |
| Permissions | https://developer.chrome.com/docs/extensions/develop/concepts/permissions |
| Storage API | https://developer.chrome.com/docs/extensions/reference/api/storage |
| Tab Capture API | https://developer.chrome.com/docs/extensions/reference/api/tabCapture |
| Scripting API | https://developer.chrome.com/docs/extensions/reference/api/scripting |
| 打包发布 | https://developer.chrome.com/docs/extensions/get-started/tutorial/publish |
| V2 → V3 迁移 | https://developer.chrome.com/docs/extensions/develop/migrate |
| 示例代码 | https://developer.chrome.com/docs/extensions/samples |
