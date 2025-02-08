
let notesBox = document.createElement("div");
notesBox.id = "notes-box";
notesBox.innerHTML = `
    <div id="notes-header">📌 My Notes</div>
    <div id="notes-content">No highlights yet</div>
`;
document.body.appendChild(notesBox);


let style = document.createElement("style");
style.innerHTML = `
    #notes-box {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 250px;
        height: 300px;
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 10px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        overflow-y: auto;
    }
    #notes-header {
        font-weight: bold;
        padding-bottom: 5px;
        border-bottom: 2px solid #ddd;
        cursor: move;
    }
    #notes-content {
        margin-top: 10px;
        font-size: 14px;
    }
`;
document.head.appendChild(style);


function captureHighlight() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        const notesContent = document.getElementById("notes-content");
        notesContent.innerHTML += `<p>${selectedText}</p>`;
    }
}


document.addEventListener('mouseup', captureHighlight);
