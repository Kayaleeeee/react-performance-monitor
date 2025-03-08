let parentUrl = "";

const convertSizeToMB = (value) => {
  return `${Number(value).toFixed(2)}MB`;
};

document.addEventListener("DOMContentLoaded", () => {
  const usedHeapEl = document.querySelector(".row.used .value");
  const totalHeapEl = document.querySelector(".row.total .value");
  const heapLimitEl = document.querySelector(".row.limit .value");
  const urlEl = document.getElementById("tabUrl");

  const renderEl = document.getElementById("renders");

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "MEMORY_UPDATE") {
      usedHeapEl.textContent = convertSizeToMB(message.usedJsHeapSize);
      totalHeapEl.textContent = convertSizeToMB(message.totalJsHeapSize);
      heapLimitEl.textContent = convertSizeToMB(message.jsHeapSizeLimit);
    }

    if (message.type === "PARENT_INFO") {
      urlEl.textContent = message.url;
    }
  });

  // 백그라운드에서 리렌더링 감지 데이터 받기
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "REACT_RENDER_UPDATE") {
      renderEl.textContent = message.count;
    }
  });
});
