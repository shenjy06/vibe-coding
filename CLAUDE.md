# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

vibe-coding 是一个浏览器小游戏合集，所有游戏均使用纯 HTML/CSS/JavaScript 实现，零外部依赖。

## 运行方式

无需构建工具。直接在浏览器中打开 `game/<name>/index.html` 即可运行：

```bash
# Windows
start game/tetris/index.html

# 或用 HTTP 服务器
python -m http.server 8000
```

## 项目结构

```
game/
├── piano/     # 虚拟钢琴 — Web Audio API 加法合成引擎
├── snake/     # 贪吃蛇 — Canvas 2D 渲染，网格游戏循环
├── tetris/    # 俄罗斯方块 — Canvas 2D 渲染，requestAnimationFrame 游戏循环
└── <新游戏>/  # 每个游戏一个目录，包含 index.html + README.md
```

## 架构约定

- **单文件模式**：每个游戏的所有代码（HTML/CSS/JS）都在一个 `index.html` 文件中，不使用外部 JS/CSS 文件
- **纯原生**：不引入任何框架或库，使用原生 DOM API 和 Canvas API
- **中文界面**：UI 文本使用中文，代码变量/函数名使用英文
- **Canvas 渲染**：游戏画面通过 HTML5 Canvas 绘制（2D context）
- **游戏循环**：
  - Tetris 使用 `requestAnimationFrame` + 时间差控制下落速度
  - Snake 使用 `setInterval` 固定帧率（150ms）
- **输入处理**：统一通过 `document.addEventListener('keydown', ...)` 监听键盘事件

## 新增游戏模板

每个游戏目录需要：
1. `index.html` — 自包含的游戏文件
2. `README.md` — 中文说明（特性、操作说明、运行方式、技术栈）
