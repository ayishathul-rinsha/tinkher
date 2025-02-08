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
                    delete highlights[folder]; // Remove folder if empty
                }

                chrome.storage.local.set({ highlights }, () => {
                    sendResponse({ status: "success", message: "Highlight deleted!" });
                });
            }
        }

        return true; // Required for async `sendResponse`
    });
});
