chrome.runtime.onInstalled.addListener(async () => {
  await chrome.action.openPopup();
});
