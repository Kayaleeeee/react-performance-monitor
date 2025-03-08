const scriptInjectedMap = new Map(); // {[tabId]: panelWindowId}

// 이미 존재하는 tabId에 매핑되는 panelWindow가 있나?
// 있으면 update
// 없으면 create

const sendPanelMessage = (parentTabId, type, message) => {
  chrome.tabs.sendMessage(parentTabId, {
    type,
    message: message ?? null,
  });
  () => {
    if (chrome.runtime.lastError) {
      console.warn(
        `⚠️ content.js가 아직 실행되지 않음: ${chrome.runtime.lastError.message}`
      );
    } else {
      console.log(`📩 content.js로 ${type} 메시지 전송 완료`);
    }
  };
};

const createChromeWindow = (options) => {
  return new Promise((resolve, reject) => {
    chrome.windows.create(options, (newWindow) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(newWindow.id);
      }
    });
  });
};

chrome.action.onClicked.addListener(async (tab) => {
  const parentTabId = tab.id;

  // TODO: 있는 경우에 update 로직 추가

  const createdWindowId = await createChromeWindow({
    url: chrome.runtime.getURL("panel.html"),
    type: "panel",
    width: 300,
    height: 400,
  });

  if (!createdWindowId) return;

  scriptInjectedMap.set(parentTabId, createdWindowId);

  await chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content.js"],
    },
    () => {
      sendPanelMessage(parentTabId, "PANEL_OPEN", {
        parentTabId,
        url: tab.url,
      });
    }
  );
});

chrome.windows.onRemoved.addListener((windowId) => {
  console.log("🚨 창이 닫힘 감지됨 - windowId:", windowId, scriptInjectedMap);

  for (const [tabId, panelWindowId] of scriptInjectedMap.entries()) {
    if (panelWindowId === windowId) {
      console.log("✅ Panel 창이 닫힘 - 매핑된 Tab 정보 삭제", tabId);
      sendPanelMessage(tabId, "PANEL_CLOSE");
      scriptInjectedMap.delete(tabId);
      break;
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log("🚨 Parent Tab이 닫힘 감지 - Tab ID:", tabId);

  if (scriptInjectedMap.has(tabId)) {
    const panelWindowId = scriptInjectedMap.get(tabId);
    console.log("✅ Parent Tab이 닫힘 - 연결된 Panel 창도 닫기", panelWindowId);

    chrome.windows.remove(panelWindowId, () => {
      console.log("✅ Panel 창 닫힘 완료");
      scriptInjectedMap.delete(tabId);
    });
  }
});
