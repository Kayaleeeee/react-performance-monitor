document.addEventListener("DOMContentLoaded", () => {
  const usedHeapEl = document.querySelector(".row.used .value");
  const totalHeapEl = document.querySelector(".row.total .value");
  const heapLimitEl = document.querySelector(".row.limit .value");

  const renderEl = document.getElementById("renders");

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "MEMORY_UPDATE") {
      console.log(usedHeapEl);
      usedHeapEl.textContent = `${message.usedJsHeapSize.toFixed(2)} MB`;
      totalHeapEl.textContent = `${message.totalJsHeapSize.toFixed(2)} MB`;
      heapLimitEl.textContent = `${message.jsHeapSizeLimit.toFixed(2)} MB`;
    }
  });

  // 백그라운드에서 리렌더링 감지 데이터 받기
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "REACT_RENDER_UPDATE") {
      renderEl.textContent = message.count;
    }
  });
});
