let currentPopup = null;

document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    showHighlightPopup(e, selection);
  }
});

function showHighlightPopup(event, text) {
  if (currentPopup) currentPopup.remove(); // Remove previous popup if it exists

  currentPopup = document.createElement('div');
  currentPopup.style.cssText = `
    position: absolute;
    top: ${event.pageY - 40}px;
    left: ${event.pageX}px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 8px;
    z-index: 10000;
    display: flex;
    gap: 8px;
    animation: fadeIn 0.2s ease;
  `;

  const saveButton = document.createElement('button');
  saveButton.textContent = '💾 Save';
  saveButton.style.cssText = `
    background: #6366f1;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;

  saveButton.addEventListener('click', () => {
    saveHighlight(text); // Save the highlight when button is clicked
    currentPopup.remove(); // Remove popup after save
  });

  // Handle clicks outside the popup to close it
  document.addEventListener('click', (e) => {
    if (!currentPopup.contains(e.target)) {
      currentPopup.remove();
    }
  }, { once: true });

  currentPopup.appendChild(saveButton);
  document.body.appendChild(currentPopup);
}

function saveHighlight(text) {
  // Get the current folder from storage
  chrome.storage.local.get(['defaultFolder'], function(result) {
    const folderName = result.defaultFolder || 'Unsorted'; // Default to 'Unsorted' folder if none exists

    // Send the highlight to background.js to store it in the selected folder
    chrome.runtime.sendMessage({
      type: 'NEW_HIGHLIGHT',
      text: text,
      url: window.location.href,
      timestamp: Date.now(),
      folderName: folderName
    });
  });
}