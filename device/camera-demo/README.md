# Camera Demo — 摄像头演示

调用电脑摄像头，实时预览画面，支持拍照和录像。

## 功能

- **实时预览**：通过 `getUserMedia` 获取摄像头视频流并实时显示
- **切换摄像头**：支持前后摄像头切换（适用于笔记本/手机）
- **拍照**：从视频流截帧生成 PNG 图片，点击可下载
- **录像**：使用 `MediaRecorder` 录制 WebM 视频，点击可下载
- **错误提示**：无摄像头、权限拒绝、设备占用等场景的友好提示

## 操作说明

| 按钮 | 功能 |
|------|------|
| 打开摄像头 | 请求摄像头权限并开始预览 |
| 切换摄像头 | 在前后摄像头之间切换（需设备有多个摄像头） |
| 拍照 | 截取当前画面保存为 PNG |
| 开始/停止录像 | 录制视频，停止后自动保存 |
| 关闭摄像头 | 释放摄像头资源 |

## 运行方式

```bash
# 直接在浏览器中打开
start game/camera-demo/index.html

# 或使用 HTTP 服务器（推荐，getUserMedia 需要 HTTPS 或 localhost）
python -m http.server 8000
# 然后访问 http://localhost:8000/game/camera-demo/index.html
```

> **注意**：`getUserMedia` 在浏览器安全策略下仅允许 `https://` 或 `localhost` 访问。直接双击打开 HTML 文件（`file://` 协议）在部分浏览器中可能无法使用。

## 技术栈

- `navigator.mediaDevices.getUserMedia` — 获取摄像头/麦克风流
- `MediaRecorder` — 录制媒体流
- `<canvas>` — 截帧生成图片
- `enumerateDevices` — 检测可用摄像头数量
- 纯 HTML/CSS/JS，零依赖
