document.addEventListener("DOMContentLoaded", () => {
    const foldersContainer = document.getElementById("folders");
    const addFolderBtn = document.getElementById("addFolder");
    const modeToggle = document.getElementById("modeToggle");
    const folderContents = document.getElementById("folder-contents");
    const highlightedTextContainer = document.getElementById("highlighted-text"); // Container for highlighted text

    let folders = JSON.parse(localStorage.getItem("folders")) || [];
    let highlightedNotes = [];

    // Listen for messages from content.js to capture highlighted text
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'highlight') {
            const newNote = {
                text: message.text,
                url: message.url
            };
            highlightedNotes.push(newNote);
            renderHighlightedNotes(); // Re-render highlighted notes
        }
    });

    // Function to render folders in the popup
    function renderFolders() {
        foldersContainer.innerHTML = "";  // Clear any existing folders
        folders.forEach((folder, index) => {
            const folderDiv = document.createElement("div");
            folderDiv.classList.add("folder");
            folderDiv.innerHTML = `
                <span>${folder.name}</span>
                <button class="icon-btn delete" title="Delete">🗑️</button>
                <button class="icon-btn plus" title="Add Note">➕</button>
                <button class="icon-btn view" title="View Notes">👀</button>
            `;

            // Attach event listeners programmatically
            const addNoteBtn = folderDiv.querySelector(".plus");
            addNoteBtn.addEventListener("click", () => addNoteToFolder(index));

            const viewNotesBtn = folderDiv.querySelector(".view");
            viewNotesBtn.addEventListener("click", () => viewFolder(index));

            const deleteBtn = folderDiv.querySelector(".delete");
            deleteBtn.addEventListener("click", () => deleteFolder(index));

            foldersContainer.appendChild(folderDiv);
        });
    }

    // Function to view notes in a folder
    function viewFolder(folderIndex) {
        const folder = folders[folderIndex];
        folderContents.innerHTML = ""; // Clear current contents

        if (folder.notes && folder.notes.length > 0) {
            const folderTitle = document.createElement("h2");
            folderTitle.textContent = `Notes in "${folder.name}"`;

            const notesList = document.createElement("ul");
            folder.notes.forEach(note => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${note.text}</strong><br><a href="${note.url}" target="_blank">${note.url}</a>`;
                notesList.appendChild(li);
            });

            folderContents.appendChild(folderTitle);
            folderContents.appendChild(notesList);
        } else {
            folderContents.innerHTML = `No notes in "${folder.name}".`;
        }
    }

    // Function to add the highlighted note to the selected folder
    function addNoteToFolder(folderIndex) {
        const folder = folders[folderIndex];
        if (highlightedNotes.length > 0) {
            folder.notes = folder.notes || [];
            highlightedNotes.forEach(note => folder.notes.push(note));
            localStorage.setItem("folders", JSON.stringify(folders));
            renderFolders(); // Re-render folder list to reflect changes
            highlightedNotes = []; // Clear the list of highlighted notes
            renderHighlightedNotes(); // Clear the notes list in the popup
        } else {
            alert("No highlighted text to add.");
        }
    }

    // Function to delete folder
    function deleteFolder(index) {
        if (confirm("Are you sure you want to delete this folder?")) {
            folders.splice(index, 1);
            localStorage.setItem("folders", JSON.stringify(folders));
            renderFolders();
            folderContents.innerHTML = ""; // Clear folder contents if folder is deleted
        }
    }

    // Function to render highlighted notes in the popup
    function renderHighlightedNotes() {
        highlightedTextContainer.innerHTML = "";
        if (highlightedNotes.length > 0) {
            highlightedNotes.forEach(note => {
                const noteElement = document.createElement("div");
                noteElement.classList.add("highlighted-note");
                noteElement.innerHTML = `
                    <strong>${note.text}</strong><br>
                    <a href="${note.url}" target="_blank">${note.url}</a>
                `;
                highlightedTextContainer.appendChild(noteElement);
            });
        } else {
            highlightedTextContainer.innerHTML = "No highlights yet.";
        }
    }

    // Function to add a new folder
    function addFolder() {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
            folders.push({ name: folderName, notes: [] });
            localStorage.setItem("folders", JSON.stringify(folders));
            renderFolders();
        }
    }

    // Handle dark mode toggle
    modeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark", modeToggle.checked);
        localStorage.setItem("darkMode", modeToggle.checked);
    });

    if (localStorage.getItem("darkMode") === "true") {
        modeToggle.checked = true;
        document.body.classList.add("dark");
    }

    // Event listeners
    addFolderBtn.addEventListener("click", addFolder);

    // Initial render of folders and notes
    renderFolders();
    renderHighlightedNotes(); // Initially render highlighted notes
});
