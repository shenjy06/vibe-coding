# Vibe Coding

纯前端浏览器小游戏合集与实用工具集。所有项目使用 HTML/CSS/JavaScript 实现，零外部依赖，打开即用。

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

### 2048

经典数字合并游戏。方向键或滑动操作，相同数字合并，目标达到 2048。

[进入游戏 →](game/2048/index.html)

### 扫雷

经典扫雷游戏。左键揭开格子，右键标记地雷。支持初级、中级、高级三种难度。

[进入游戏 →](game/minesweeper/index.html)

## 实用工具

### 图片压缩工具

在线图片压缩，支持调整质量、尺寸、输出格式（JPG/PNG/WebP）。

[使用工具 →](tools/image-compress/index.html)

### 证件照制作工具

一键生成证件照，支持多种尺寸（一寸、二寸、护照等），自定义背景色，排版打印。

[使用工具 →](tools/formal-image/index.html)

### JSON 格式化工具

JSON 格式化、压缩、校验，支持语法高亮和统计信息。

[使用工具 →](tools/json-formatter/index.html)

### Base64 编解码

文本和图片的 Base64 编码解码工具。

[使用工具 →](tools/base64/index.html)

### 正则表达式测试器

实时正则表达式测试，支持常用模板和匹配详情。

[使用工具 →](tools/regex-tester/index.html)

### 文本差异对比

两段文本的差异对比，高亮显示新增、删除和修改内容。

[使用工具 →](tools/text-diff/index.html)

### 二维码生成器

生成自定义二维码，支持调整颜色、大小、纠错级别。

[使用工具 →](tools/qrcode/index.html)

### 密码生成器

安全密码生成，支持自定义长度、字符类型、批量生成。

[使用工具 →](tools/password-gen/index.html)

### URL 编解码

URL 编码解码工具，支持 URL 解析和参数提取。

[使用工具 →](tools/url-codec/index.html)

### 颜色转换器

颜色格式转换（HEX/RGB/HSL/HSV/CMYK），调色板功能。

[使用工具 →](tools/color-converter/index.html)

### 图片格式转换

图片格式转换工具，支持 JPG/PNG/WebP/BMP 互转。

[使用工具 →](tools/image-convert/index.html)

### 图片裁剪工具

可视化图片裁剪，支持自由裁剪和固定比例裁剪。

[使用工具 →](tools/image-crop/index.html)

### 像素画编辑器

像素风格绘画工具，支持多种画笔工具和调色板。

[使用工具 →](tools/pixel-editor/index.html)

### 图片拼接工具

多图拼接工具，支持垂直、水平、网格拼接。

[使用工具 →](tools/image-merge/index.html)

### Markdown 编辑器

实时预览的 Markdown 编辑器，支持工具栏快捷插入。

[使用工具 →](tools/markdown-editor/index.html)

### CSS 渐变生成器

可视化 CSS 渐变生成，支持线性、径向、锥形渐变。

[使用工具 →](tools/gradient-gen/index.html)

### Flexbox/Grid 可视化

Flexbox 和 CSS Grid 布局可视化学习工具。

[使用工具 →](tools/css-layout/index.html)

### 代码格式化

代码格式化工具，支持 JavaScript/HTML/CSS/JSON。

[使用工具 →](tools/code-format/index.html)

## 运行方式

直接用浏览器打开 `game/<游戏名>/index.html` 或 `tools/<工具名>/index.html` 即可，无需安装依赖或启动服务器。

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
