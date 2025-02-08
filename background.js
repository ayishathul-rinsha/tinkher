chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveHighlight") {
      chrome.storage.local.get(["folders"], function (data) {
        let folders = data.folders || {}; // Get existing folders or initialize empty
        let folderName = prompt("Enter folder name:");
  
        if (!folderName) return; // If no folder name entered, stop
  
        if (!folders[folderName]) {
          folders[folderName] = [];
        }
  
        folders[folderName].push({ text: request.text, url: request.url });
        chrome.storage.local.set({ folders: folders }, function () {
          console.log("Highlight saved to folder!");
        });
      });
    }
  });