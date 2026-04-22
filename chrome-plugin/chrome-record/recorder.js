// recorder.js — Tab 录制逻辑
const btnPickTab = document.getElementById('btnPickTab');
const btnStop = document.getElementById('btnStop');
const statusEl = document.getElementById('status');
const previewBox = document.getElementById('previewBox');
const previewVideo = document.getElementById('previewVideo');

let mediaRecorder = null;
let recordedChunks = [];
let capturedStream = null;

// 选择标签页并开始录制
btnPickTab.addEventListener('click', async () => {
  try {
    statusEl.textContent = '请选择要录制的标签页...';

    // 使用 getDisplayMedia — 用户可以选择特定标签页、窗口或整个屏幕
    capturedStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: 'browser', // 优先提示选择标签页
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      },
      audio: true
    });

    // 显示预览
    previewVideo.srcObject = capturedStream;
    previewBox.style.display = 'block';

    // 监听用户手动停止共享（如点击浏览器的"停止共享"按钮）
    capturedStream.getVideoTracks()[0].onended = () => {
      stopRecording();
    };

    // 开始录制
    recordedChunks = [];
    const mimeType = getSupportedMimeType();
    mediaRecorder = new MediaRecorder(capturedStream, { mimeType });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
      downloadBlob(blob, `tab-recording-${formatDate()}.webm`);

      statusEl.textContent = '录制完成，视频已下载！';
      previewBox.style.display = 'none';
      previewVideo.srcObject = null;

      btnPickTab.disabled = false;
      btnStop.disabled = true;

      // 通知 popup
      try {
        chrome.runtime.sendMessage({ action: 'tabRecordingStopped' });
      } catch (e) { /* popup 可能已关闭 */ }

      // 清理
      if (capturedStream) {
        capturedStream.getTracks().forEach(t => t.stop());
        capturedStream = null;
      }
    };

    mediaRecorder.start(1000); // 每秒生成一个 chunk
    statusEl.textContent = '正在录制...';
    btnPickTab.disabled = true;
    btnStop.disabled = false;

  } catch (err) {
    if (err.name === 'NotAllowedError') {
      statusEl.textContent = '用户取消了选择';
    } else {
      statusEl.textContent = '录制启动失败: ' + err.message;
    }
    console.error(err);
  }
});

// 停止录制
btnStop.addEventListener('click', stopRecording);

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  if (capturedStream) {
    capturedStream.getTracks().forEach(t => t.stop());
  }
}

// 工具函数
function getSupportedMimeType() {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return 'video/webm';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}
