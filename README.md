# Vibe Coding

纯前端浏览器小游戏合集。所有游戏使用 HTML/CSS/JavaScript 实现，零外部依赖，打开即玩。

## 游戏列表

### Virtual Piano

基于 Web Audio API 的浏览器虚拟钢琴。加法合成引擎（基频 + 3 次谐波叠加）模拟真实钢琴音色，带低通滤波器。覆盖 2.5 个八度（C3 ~ E5），支持鼠标、触屏和键盘演奏。

[进入游戏 →](game/piano/index.html)

### 俄罗斯方块

经典俄罗斯方块。7 种标准方块，幽灵方块预览落点，下一个方块预览，等级加速，暂停/继续。

| 按键 | 功能 |
|------|------|
| ← → | 左右移动 |
| ↑ | 旋转 |
| ↓ | 加速下落 |
| Space | 硬降 |
| P | 暂停/继续 |

[进入游戏 →](game/tetris/index.html)

### 贪吃蛇

经典贪吃蛇。方向键控制移动，吃到食物得 1 分并增长，撞墙或撞自己则游戏结束。

[进入游戏 →](game/snake/index.html)

## 运行方式

直接用浏览器打开 `game/<游戏名>/index.html` 即可，无需安装依赖或启动服务器。

```bash
# Windows
start game/piano/index.html

# macOS
open game/piano/index.html

# Linux
xdg-open game/piano/index.html

# 或使用 HTTP 服务器
python -m http.server 8000
```

## 技术栈

- HTML5 Canvas — 游戏画面渲染
- Web Audio API — 音频合成（钢琴）
- CSS3 — 样式与动画
- JavaScript (ES6+) — 游戏逻辑
- 零第三方依赖

## License

[MIT](LICENSE)
