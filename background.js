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

        // New action for sharing the folder
        else if (request.action === "shareFolder") {
            const { folder } = request;

            if (highlights[folder] && highlights[folder].length > 0) {
                let sharedContent = `Check out the highlights from the folder "${folder}":\n\n`;

                highlights[folder].forEach((highlight, index) => {
                    sharedContent += `${index + 1}. ${highlight.text} - ${highlight.url}\n`;
                });

                sendResponse({ status: "success", shareLink: sharedContent });
            } else {
                sendResponse({ status: "error", message: "Folder is empty or not found!" });
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


        return true; 
    });
});
