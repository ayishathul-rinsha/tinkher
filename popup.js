document.addEventListener('DOMContentLoaded', initPopup);

async function initPopup() {
  setupEventListeners();
  await loadFolders();

  // Listen for changes in chrome.storage (folders)
  chrome.storage.onChanged.addListener(async (changes) => {
    if (changes.folders) {
      await loadFolders();
    }
  });

  // Listen for messages from background.js when a new highlight is added
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'HIGHLIGHT_ADDED') {
      loadFolders(); // Refresh popup when a new highlight is stored
    }
  });
}

async function loadFolders() {
  const { folders, defaultFolder } = await chrome.storage.local.get(['folders', 'defaultFolder']);
  const foldersContainer = document.getElementById('folders');
  const emptyState = document.getElementById('emptyState');

  if (folders && Object.keys(folders).length > 0) {
    emptyState.style.display = 'none';
    foldersContainer.innerHTML = Object.entries(folders)
      .map(([name, notes]) => `
        <div class="folder">
          <div class="folder-header">
            <div class="folder-title">${name}</div>
            <button class="set-default" data-folder="${name}">📌 Set Default</button>
          </div>
          <div class="folder-count">${notes.length} notes</div>
          <div class="notes" style="display: none;">
            ${notes.map(note => createNoteElement(note)).join('')}
          </div>
        </div>
      `).join('');

    setupFolderToggles(); // Ensure toggles work after loading folders

    // Attach event listeners to "Set Default" buttons
    document.querySelectorAll('.set-default').forEach(button => {
      button.addEventListener('click', () => setDefaultFolder(button.dataset.folder));
    });
  } else {
    foldersContainer.innerHTML = '';
    emptyState.style.display = 'block';
  }
}

async function setDefaultFolder(folderName) {
  await chrome.storage.local.set({ defaultFolder: folderName });
  alert('Default folder set to: '+folderName);
}

function createNoteElement(note) {
  return `
    <div class="note">
      <p class="note-text">${note.text}</p>
      <div class="note-meta">
        <a href="${note.url}" target="_blank" class="note-link">
          ${new URL(note.url).hostname}
        </a>
        <span>${new Date(note.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  `;
}

function setupFolderToggles() {
  document.querySelectorAll('.folder-header').forEach(header => {
    header.addEventListener('click', () => {
      const folder = header.parentElement;
      const notes = folder.querySelector('.notes'); // Correct selection
      notes.style.display = notes.style.display === 'block' ? 'none' : 'block';
    });
  });
}

async function createFolder() {
  const folderName = prompt('Enter folder name:');
  if (folderName) {
    const { folders = {} } = await chrome.storage.local.get('folders');
    if (!folders[folderName]) {
      folders[folderName] = [];
      await chrome.storage.local.set({ folders });
      await loadFolders();
    } else {
      alert('Folder already exists.');
    }
  }
}

function setupEventListeners() {
  document.getElementById('createFolder').addEventListener('click', createFolder);
}