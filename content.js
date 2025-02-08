// Capture the highlighted text on the page
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        const url = window.location.href; // Capture the current URL
        // Send the highlighted text and URL to the popup
        chrome.runtime.sendMessage({
            type: "highlight",
            text: selectedText,
            url: url
        });
    }
});
