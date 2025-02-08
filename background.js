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

        else if (request.action === "shareHighlight") {
            const { folder, index } = request;

            if (highlights[folder] && highlights[folder][index]) {
                const highlight = highlights[folder][index];
                const highlightLink = `Check out this highlight: ${highlight.text} - ${highlight.url}`;
                sendResponse({ status: "success", shareLink: highlightLink });
            } else {
                sendResponse({ status: "error", message: "Highlight not found!" });
            }
        }

        // New action for renaming the folder
        else if (request.action === "renameFolder") {
            const { oldFolder, newFolder } = request;

            if (highlights[oldFolder]) {
                // Create new folder with the same highlights
                highlights[newFolder] = highlights[oldFolder];

                // Delete the old folder
                delete highlights[oldFolder];

                chrome.storage.local.set({ highlights }, () => {
                    sendResponse({ status: "success", message: `Folder renamed to ${newFolder}!` });
                });
            } else {
                sendResponse({ status: "error", message: "Old folder not found!" });
            }
        }


        return true; // Required for async `sendResponse`
    });
});
