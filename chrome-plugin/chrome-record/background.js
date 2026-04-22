// background.js — Service Worker

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        sendResponse({ success: false, error: '没有找到活动标签页' });
        return;
      }
      chrome.tabCapture.capture(
        { video: true, audio: true },
        (stream) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else if (!stream) {
            sendResponse({ success: false, error: '捕获失败，流为空' });
          } else {
            // 将 streamId 传给调用者
            sendResponse({ success: true, streamId: stream.id });
          }
        }
      );
    });
    return true; // 异步响应
  }

  if (message.action === 'getTabStream') {
    // 使用 chrome.desktopCapture 获取桌面流（tab capture 的替代方案）
    chrome.desktopCapture.chooseDesktopMedia(
      ['screen', 'window', 'tab'],
      sender.tab,
      (streamId) => {
        if (!streamId) {
          sendResponse({ success: false, error: '用户取消了选择' });
        } else {
          sendResponse({ success: true, streamId });
        }
      }
    );
    return true;
  }
});

// 点击插件图标时的行为由 popup.html 处理
