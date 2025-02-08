chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.storage.local.get(["highlights"], (result) => {
        let highlights = result.highlights || {};

        if (request.action === "saveHighlight") {
            const { text, url, folder } = request;

            if (!highlights[folder]) {
                highlights[folder] = [];
            }

            highlights[folder].push({ text, url });

            chrome.storage.local.set({ highlights }, () => {
                sendResponse({ status: "success", message: "Highlight saved!" });
            });
        } 
        
        else if (request.action === "getHighlights") {
            sendResponse({ highlights });
        } 
        
        else if (request.action === "deleteHighlight") {
            const { folder, index } = request;

            if (highlights[folder]) {
                highlights[folder].splice(index, 1);

                if (highlights[folder].length === 0) {
                    delete highlights[folder]; // Remove empty folders
                }

                chrome.storage.local.set({ highlights }, () => {
                    sendResponse({ status: "success", message: "Highlight deleted!" });
                });
            }
        }

        else if (request.action === "deleteFolder") {
            const { folder } = request;

            if (highlights[folder]) {
                delete highlights[folder]; // Delete entire folder

                chrome.storage.local.set({ highlights }, () => {
                    sendResponse({ status: "success", message: "Folder deleted!" });
                });
            }
        }

        return true; // Required for async `sendResponse`
    });
});
