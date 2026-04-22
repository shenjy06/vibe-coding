// camera.js
const video = document.getElementById('videoFeed');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const sizeSlider = document.getElementById('sizeSlider');
const sizeLabel = document.getElementById('sizeLabel');
const btnSquare = document.getElementById('btnSquare');
const btnCircle = document.getElementById('btnCircle');
const btnRecord = document.getElementById('btnRecord');
const btnSnapshot = document.getElementById('btnSnapshot');
const statusBar = document.getElementById('statusBar');

let currentShape = 'square'; // 'square' | 'circle'
let currentSize = 300;
let animFrameId = null;
let mediaRecorder = null;
let recordedChunks = [];
let stream = null;

// 从 URL hash 判断是否处于录制模式
const autoRecord = location.hash === '#record';

// ===== 初始化摄像头 =====
async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true
    });
    video.srcObject = stream;
    await video.play();
    statusBar.textContent = '摄像头就绪';
    startRendering();

    if (autoRecord) {
      startRecording();
    }
  } catch (err) {
    statusBar.textContent = '摄像头启动失败: ' + err.message;
    console.error(err);
  }
}

// ===== 渲染循环 =====
function startRendering() {
  if (animFrameId) cancelAnimationFrame(animFrameId);

  function draw() {
    if (video.readyState >= 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentShape === 'circle') {
        drawCircle();
      } else {
        drawSquare();
      }
    }
    animFrameId = requestAnimationFrame(draw);
  }
  draw();
}

function drawSquare() {
  // 等比缩放视频到画布
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const scale = Math.max(canvas.width / vw, canvas.height / vh);
  const sw = canvas.width / scale;
  const sh = canvas.height / scale;
  const sx = (vw - sw) / 2;
  const sy = (vh - sh) / 2;

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
}

function drawCircle() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // 等比缩放
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const scale = Math.max(canvas.width / vw, canvas.height / vh);
  const sw = canvas.width / scale;
  const sh = canvas.height / scale;
  const sx = (vw - sw) / 2;
  const sy = (vh - sh) / 2;

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // 圆形边框
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ===== 形状切换 =====
btnSquare.addEventListener('click', () => {
  currentShape = 'square';
  btnSquare.classList.add('active');
  btnCircle.classList.remove('active');
});

btnCircle.addEventListener('click', () => {
  currentShape = 'circle';
  btnCircle.classList.add('active');
  btnSquare.classList.remove('active');
});

// ===== 大小调节 =====
sizeSlider.addEventListener('input', (e) => {
  currentSize = parseInt(e.target.value);
  sizeLabel.textContent = currentSize + 'px';
  canvas.width = currentSize;
  canvas.height = currentSize;
});

// ===== 录制 =====
function startRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') return;

  // 使用 canvas.captureStream() 获取渲染后的画面流
  const canvasStream = canvas.captureStream(30);

  // 合并音频（从摄像头流中取音频轨道）
  if (stream && stream.getAudioTracks().length > 0) {
    stream.getAudioTracks().forEach(track => {
      canvasStream.addTrack(track);
    });
  }

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(canvasStream, {
    mimeType: getSupportedMimeType()
  });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
    downloadBlob(blob, `camera-${Date.now()}.webm`);
    statusBar.textContent = '录制完成，视频已下载';
    btnRecord.classList.remove('recording');

    // 通知 popup
    try {
      chrome.runtime.sendMessage({ action: 'camRecordingStopped' });
    } catch (e) { /* popup 可能已关闭 */ }
  };

  mediaRecorder.start(100);
  statusBar.textContent = '正在录制...';
  btnRecord.classList.add('recording');
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

btnRecord.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording();
  } else {
    startRecording();
  }
});

// ===== 截图 =====
btnSnapshot.addEventListener('click', () => {
  canvas.toBlob((blob) => {
    downloadBlob(blob, `snapshot-${Date.now()}.png`);
    statusBar.textContent = '截图已保存';
    setTimeout(() => {
      statusBar.textContent = '摄像头就绪';
    }, 2000);
  }, 'image/png');
});

// ===== 工具函数 =====
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

// ===== 启动 =====
initCamera();
