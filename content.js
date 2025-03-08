setInterval(() => {
  if (performance.memory) {
    const memoryUsage = performance.memory;

    chrome.runtime.sendMessage({
      type: "MEMORY_UPDATE",
      usedJsHeapSize: `${memoryUsage.usedJSHeapSize / 1024 / 1024}`,
      totalJsHeapSize: `${memoryUsage.totalJSHeapSize / 1024 / 1024}`,
      jsHeapSizeLimit: `${memoryUsage.jsHeapSizeLimit / 1024 / 1024}`,
    });
  }
}, 1000);
