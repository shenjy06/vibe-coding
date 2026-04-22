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
