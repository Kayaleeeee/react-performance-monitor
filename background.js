let windowId = null;

chrome.action.onClicked.addListener(() => {
  chrome.windows.getAll({ populate: true }, (windows) => {
    const existingWindow = windows.find((win) => win.id === panelWindowId);

    if (existingWindow) {
      chrome.windows.update(existingWindow.id, { focused: true });
    } else {
      chrome.windows.create({
        url: chrome.runtime.getURL("panel.html"),
        type: "popup",
        width: 300,
        height: 400,
      });
    }
  });
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === panelWindowId) {
    panelWindowId = null;
  }
});
