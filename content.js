if (window.isContentScriptInjected) {
  console.warn("⚠️ content.js가 이미 실행되어 있음.");
} else {
  window.isContentScriptInjected = true;

  let isPanelActive = false;
  let parentUrl = "";
  let memoryInterval = null;

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "PANEL_OPEN") {
      console.log("✅ 패널이 열림, 메모리 데이터 전송 시작");

      isPanelActive = true;
      parentUrl = message.message.url;
      startMemoryTracking();
      sendParentTabInfo();
    }

    if (message.type === "PANEL_CLOSE") {
      console.log("❌ 패널이 닫힘, 메모리 데이터 전송 중지");

      isPanelActive = false;
      stopMemoryTracking();
    }
  });

  function sendParentTabInfo() {
    if (isPanelActive && parentUrl) {
      setTimeout(
        () =>
          chrome.runtime.sendMessage({
            type: "PARENT_INFO",
            url: parentUrl,
          }),
        100
      );
    }
  }

  function startMemoryTracking() {
    if (!memoryInterval && isPanelActive) {
      memoryInterval = setInterval(() => {
        if (performance.memory) {
          chrome.runtime.sendMessage({
            type: "MEMORY_UPDATE",
            usedJsHeapSize: `${
              performance.memory.usedJSHeapSize / 1024 / 1024
            }`,
            totalJsHeapSize: `${
              performance.memory.totalJSHeapSize / 1024 / 1024
            }`,
            jsHeapSizeLimit: `${
              performance.memory.jsHeapSizeLimit / 1024 / 1024
            }`,
          });
        }
      }, 1000);
    }
  }

  function stopMemoryTracking() {
    if (memoryInterval) {
      clearInterval(memoryInterval);
      memoryInterval = null;
    }
  }
}
