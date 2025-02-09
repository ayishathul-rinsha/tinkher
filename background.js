// Listen for command events (e.g., keyboard shortcuts)
chrome.commands.onCommand.addListener(function(command) {
    if (command === "openFolder") {
      // Open the folder view (in a new tab or whatever method you choose)
      chrome.tabs.create({ url: "folderView.html" }); // Replace "folderView.html" with your folder view URL
    } else if (command === "saveHighlightToFolder") {
      // Save the current highlight to the folder
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0];
        // Execute content script to save the highlight
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: saveHighlight // This function will be defined next
        });
      });
    }
  });
  
  // Function to save the highlight on the page
  function saveHighlight() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      // Save the selected text to chrome storage or do whatever you want
      chrome.storage.local.set({ highlight: selectedText }, function() {
        console.log("Highlight saved!");
        // Optionally, notify the user (e.g., alert or log)
      });
    } else {
      console.log("No text selected!");
      // Optionally, notify the user about no selected text
    }
  }