# Chrome 插件 Hello World 从零开发教程

本文档手把手教你从零创建一个 Chrome 插件。最终效果：点击插件图标弹出窗口，点击按钮计数，数据持久化保存。

---

## Step 0：前置准备

- 安装 Chrome 浏览器（88+）
- 任意文本编辑器（VS Code、记事本均可）
- 无需安装任何工具或依赖

---

## Step 1：创建项目目录

在你喜欢的位置创建文件夹：

```
hello-world/
```

这个文件夹就是插件的根目录，所有文件都放在里面。

---

## Step 2：创建 manifest.json

在 `hello-world/` 下新建 `manifest.json`，这是 Chrome 插件的**唯一必需文件**，告诉 Chrome 这个插件叫什么、需要什么权限、入口在哪。

```json
{
  "manifest_version": 3,
  "name": "Hello World",
  "version": "1.0.0",
  "description": "第一个 Chrome 插件 — Hello World 示例",
  "action": {
    "default_popup": "popup.html"
  }
}
```

### 逐行解释

| 字段 | 含义 |
|------|------|
| `manifest_version` | 必须为 `3`，表示使用 Manifest V3 规范 |
| `name` | 插件名称，显示在扩展管理页面和商店 |
| `version` | 版本号，格式 `x.y.z`，每次发布需递增 |
| `description` | 插件描述 |
| `action` | 定义插件图标的行为 |
| `action.default_popup` | 点击图标时弹出的 HTML 页面 |

到这一步，一个最简插件就完成了。接下来创建弹窗页面。

---

## Step 3：创建 popup.html

在 `hello-world/` 下新建 `popup.html`，这就是点击插件图标后弹出的页面：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      width: 300px;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-align: center;
    }
    h1 { font-size: 20px; margin: 0 0 12px; }
    p { color: #666; font-size: 14px; margin: 0 0 16px; }
    #counter { font-size: 32px; font-weight: bold; color: #4285f4; margin: 8px 0; }
    button {
      padding: 8px 24px; font-size: 14px;
      border: none; border-radius: 4px; cursor: pointer; margin: 4px;
    }
    #btn-increment { background: #4285f4; color: #fff; }
    #btn-reset { background: #e0e0e0; color: #333; }
  </style>
</head>
<body>
  <h1>Hello, Chrome Extension!</h1>
  <p>点击按钮计数，关闭弹窗后数据仍然保留</p>
  <div id="counter">0</div>
  <button id="btn-increment">+1</button>
  <button id="btn-reset">重置</button>
  <script src="popup.js"></script>
</body>
</html>
```

### 关键点

- **宽度控制**：设置 `body` 宽度为 300px，弹窗大小由此决定
- **没有 `<head>` 里的 `<title>`**：popup 页面不显示浏览器标题栏，不需要
- **JS 通过 `<script>` 引入**：和普通网页一样

---

## Step 4：创建 popup.js

在 `hello-world/` 下新建 `popup.js`，实现计数逻辑和数据持久化：

```js
const counterEl = document.getElementById('counter');
const btnIncrement = document.getElementById('btn-increment');
const btnReset = document.getElementById('btn-reset');

// 从 storage 读取计数
chrome.storage.local.get({ count: 0 }).then(({ count }) => {
  counterEl.textContent = count;
});

// +1 按钮
btnIncrement.addEventListener('click', async () => {
  const { count = 0 } = await chrome.storage.local.get('count');
  const newCount = count + 1;
  await chrome.storage.local.set({ count: newCount });
  counterEl.textContent = newCount;
});

// 重置按钮
btnReset.addEventListener('click', async () => {
  await chrome.storage.local.set({ count: 0 });
  counterEl.textContent = 0;
});
```

### 关键 API 解释

```js
// 读取存储（带默认值）
await chrome.storage.local.get({ count: 0 })

// 写入存储
await chrome.storage.local.set({ count: 5 })
```

- `chrome.storage.local` — 插件本地存储，**不需要在 manifest 中声明权限**
- 数据在关闭弹窗、重启浏览器后仍然保留
- 也可以用 `chrome.storage.sync`，会通过 Google 账号同步到其他设备（需声明 `storage` 权限）

---

## Step 5：添加插件图标（可选但推荐）

Chrome 要求不同尺寸的图标：

```
hello-world/
└── icons/
    ├── icon16.png    # 16×16 — 扩展管理页面
    ├── icon48.png    # 48×48 — 扩展管理页面
    └── icon128.png   # 128×128 — Chrome 网上应用店
```

如果你暂时没有图标，可以从 `manifest.json` 中删除 `action.default_icon` 和 `icons` 字段，Chrome 会使用默认灰色拼图图标。

**快速生成方式**：用任意绘图工具创建 128×128 的 PNG，然后用在线工具缩放到 48 和 16。

---

## Step 6：加载插件到 Chrome

1. 打开 Chrome，在地址栏输入 `chrome://extensions/` 并回车
2. 打开右上角的 **开发者模式** 开关
3. 点击左上角的 **加载已解压的扩展程序**
4. 选择你的 `hello-world/` 文件夹
5. 插件加载成功，你会在扩展列表中看到 "Hello World"

```
┌─────────────────────────────────────────┐
│  chrome://extensions/                   │
│                                         │
│  [开发者模式]  [加载已解压的扩展程序]        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Hello World          v1.0.0   │    │
│  │  第一个 Chrome 插件              │    │
│  │  ID: abcdefghijklmnop          │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## Step 7：测试插件

1. 在 Chrome 工具栏找到插件图标（如果没有，点击拼图图标找到 "Hello World"，点击钉子固定到工具栏）
2. 点击图标，弹出窗口显示 "Hello, Chrome Extension!" 和计数器
3. 点击 **+1** 按钮，数字变为 1
4. 再点几次，数字递增
5. **关闭弹窗，再次打开** — 数字仍然保留（因为数据存在 `chrome.storage` 中）
6. 点击 **重置** 按钮，数字归零

---

## Step 8：修改代码后刷新

修改 `popup.html` 或 `popup.js` 后：

1. 回到 `chrome://extensions/`
2. 找到 "Hello World" 插件
3. 点击 **刷新** 按钮（圆形箭头图标）
4. 重新点击插件图标查看效果

不需要重启浏览器。

---

## 完整文件结构

```
hello-world/
├── manifest.json    # 插件配置（必需）
├── popup.html       # 弹窗页面
├── popup.js         # 弹窗逻辑
└── icons/           # 图标目录（可选）
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 进阶：添加 Service Worker

如果需要后台运行逻辑，添加 Service Worker。

**Step 1**：创建 `background.js`

```js
// 插件安装时触发
chrome.runtime.onInstalled.addListener(() => {
  console.log('Hello World 插件已安装');
});
```

**Step 2**：在 `manifest.json` 中注册

```json
{
  "manifest_version": 3,
  "name": "Hello World",
  "version": "1.0.0",
  "description": "第一个 Chrome 插件 — Hello World 示例",
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  }
}
```

**Step 3**：调试 Service Worker

在 `chrome://extensions/` 中，点击插件卡片上的 **检查视图 → Service Worker**，打开 DevTools 查看 `console.log` 输出。

---

## 进阶：添加 Content Script

如果需要操作网页内容，添加 Content Script。

**Step 1**：创建 `content.js`

```js
// 这个脚本会在匹配的网页中执行
document.body.style.border = '3px solid #4285f4';
console.log('Content Script 已注入');
```

**Step 2**：在 `manifest.json` 中声明

```json
{
  "manifest_version": 3,
  "name": "Hello World",
  "version": "1.0.0",
  "description": "第一个 Chrome 插件 — Hello World 示例",
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

**Step 3**：刷新插件，打开任意网页，你会看到页面边框变为蓝色。

`matches` 字段决定脚本注入哪些页面：

| 值 | 含义 |
|----|------|
| `<all_urls>` | 所有网页 |
| `https://*.google.com/*` | Google 所有子域名 |
| `https://example.com/page` | 精确匹配某个页面 |

---

## 常见问题

**Q：插件图标不显示？**
A：点击工具栏的拼图图标，在列表中找到你的插件，点击钉子固定到工具栏。

**Q：修改代码后没生效？**
A：去 `chrome://extensions/` 点击插件的刷新按钮。

**Q：`chrome.storage` 报错？**
A：`chrome.storage.local` 不需要声明权限即可使用。如果用 `chrome.storage.sync`，需要在 `manifest.json` 的 `permissions` 中添加 `"storage"`。

**Q：弹窗关闭后 JS 状态丢失？**
A：这是正常的。Popup 页面每次打开都是全新加载的，持久化数据必须用 `chrome.storage` 或 `chrome.runtime.sendMessage` 传给 Service Worker。

---

## 总结

| 概念 | 作用 |
|------|------|
| `manifest.json` | 插件身份证，告诉 Chrome 插件的基本信息 |
| `action.default_popup` | 点击图标弹出的页面 |
| `background.service_worker` | 后台运行的脚本，事件驱动 |
| `content_scripts` | 注入到网页中执行的脚本 |
| `chrome.storage.local` | 持久化本地存储 |
| `chrome.runtime.sendMessage` | 组件间通信 |

恭喜！你已经完成了第一个 Chrome 插件。
