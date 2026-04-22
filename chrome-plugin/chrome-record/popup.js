// popup.js

// 打开摄像头窗口
document.getElementById('btnCamera').addEventListener('click', () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('camera.html'),
    type: 'popup',
    width: 420,
    height: 500
  });
});

// ===== Tab 录制 =====
let tabRecorder = null;
let tabChunks = [];

document.getElementById('btnStartTab').addEventListener('click', async () => {
  try {
    // 使用 getDisplayMedia 方案 — 需要先打开一个 recorder 窗口
    const win = await chrome.windows.create({
      url: chrome.runtime.getURL('recorder.html'),
      type: 'popup',
      width: 400,
      height: 200,
      focused: true
    });
    document.getElementById('tabStatus').textContent = '已打开录制窗口，请选择要录制的标签页';
  } catch (err) {
    document.getElementById('tabStatus').textContent = '打开录制窗口失败: ' + err.message;
  }
});

document.getElementById('btnStopTab').addEventListener('click', () => {
  if (tabRecorder && tabRecorder.state !== 'inactive') {
    tabRecorder.stop();
  }
});

// ===== 摄像头录制 =====
let camRecorder = null;
let camChunks = [];

document.getElementById('btnStartCam').addEventListener('click', async () => {
  try {
    // 打开摄像头窗口并标记为录制模式
    const win = await chrome.windows.create({
      url: chrome.runtime.getURL('camera.html#record'),
      type: 'popup',
      width: 420,
      height: 500
    });
    document.getElementById('camStatus').textContent = '摄像头已打开，请在窗口中点击录制';
  } catch (err) {
    document.getElementById('camStatus').textContent = '打开失败: ' + err.message;
  }
});

document.getElementById('btnStopCam').addEventListener('click', () => {
  if (camRecorder && camRecorder.state !== 'inactive') {
    camRecorder.stop();
  }
});

// 监听来自 camera 窗口的消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'camRecordingStopped') {
    document.getElementById('camStatus').textContent = '录制已停止，视频已下载';
    document.getElementById('btnStopCam').disabled = true;
    document.getElementById('btnStartCam').disabled = false;
  }
  if (msg.action === 'tabRecordingStopped') {
    document.getElementById('tabStatus').textContent = '录制已停止，视频已下载';
    document.getElementById('btnStopTab').disabled = true;
    document.getElementById('btnStartTab').disabled = false;
  }
});
