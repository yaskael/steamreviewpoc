document.addEventListener("DOMContentLoaded", function () {
    updateActiveButtons();

    const editor = document.getElementById('editor');

    // Ensure new lines work properly inside the editor
    editor.addEventListener("keydown", function (event) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const parentElement = selection.getRangeAt(0).commonAncestorContainer.parentElement;

        if (event.key === "Enter") {
            // 1) If inside a list item, let the browser handle a new <li> (do NOT prevent default).
            if (parentElement.closest("li")) {
                // Do nothing special; let the default action occur.
                return;
            }

            // 2) SHIFT+Enter: Insert a <br> (soft break)
            if (event.shiftKey) {
                event.preventDefault();
                document.execCommand("insertHTML", false, "<br>");
            } 
            // 3) Normal Enter: Insert a new paragraph
            else {
                event.preventDefault();
                document.execCommand("insertHTML", false, "<p><br></p>");
            }
        }
    });
});

// Toggle text styles like bold, italic, underline, etc.
function toggleStyle(command) {
    // Fix the command for strikethrough
    if (command === 'strike') {
        command = 'strikeThrough';
    }

    try {
        document.execCommand(command, false, null);
        updateActiveButtons();
    } catch (error) {
        console.error(`Error applying style: ${command}`, error);
    }
}

// Update active button states based on the current text selection
function updateActiveButtons() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const parentElement = selection.getRangeAt(0).commonAncestorContainer.parentElement;

    // Reset all button states
    document.querySelectorAll(".toolbar button").forEach(btn => btn.classList.remove("active"));

    // Check for formatting states (special-case "strikeBtn" -> "strikeThrough")
    ["boldBtn", "italicBtn", "underlineBtn", "strikeBtn"].forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (!button) return;

        let queryCommand = buttonId.replace("Btn", ""); // e.g. boldBtn -> "bold"
        if (buttonId === "strikeBtn") {
            queryCommand = "strikeThrough"; // fix
        }

        if (document.queryCommandState(queryCommand)) {
            button.classList.add("active");
        }
    });

    // Header buttons
    ["h1", "h2", "h3"].forEach(tag => {
        const headerButton = document.querySelector(`[onclick="insertHeader(${tag.charAt(1)})"]`);
        if (headerButton) {
            headerButton.classList.toggle(
                "active",
                parentElement && parentElement.tagName.toLowerCase() === tag
            );
        }
    });

    // Quote button
    const quoteButton = document.getElementById('quoteBtn');
    if (quoteButton) {
        quoteButton.classList.toggle(
            "active",
            parentElement && parentElement.closest("blockquote")
        );
    }
}

// Insert a heading (H1, H2, H3) and toggle it
function insertHeader(level) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let parentElement = range.commonAncestorContainer.parentElement;

    // Remove existing header if already applied
    if (parentElement && ["H1", "H2", "H3"].includes(parentElement.tagName)) {
        const newText = document.createElement("span");
        newText.innerHTML = parentElement.innerHTML;
        parentElement.replaceWith(newText);
    } else {
        document.execCommand("formatBlock", false, `h${level}`);
    }

    updateActiveButtons();
}

// Insert a list (unordered or ordered) and toggle it
function insertList(type) {
    // type: 'ul' => insertUnorderedList, 'ol' => insertOrderedList
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
}

// Insert a horizontal line at the caret, and add a break after it
function insertLine() {
    // This inserts an HR at the current selection
    document.execCommand('insertHTML', false, '<hr><br>');
}

// Toggle quote formatting (applies/removes blockquote)
function insertQuote() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let parentElement = range.commonAncestorContainer.parentElement;

    // If already in a blockquote, unwrap it
    if (parentElement && parentElement.tagName === 'BLOCKQUOTE') {
        const newText = document.createElement("span");
        newText.innerHTML = parentElement.innerHTML;
        parentElement.replaceWith(newText);
    } else {
        // Otherwise, apply blockquote
        document.execCommand('formatBlock', false, 'blockquote');
    }

    updateActiveButtons();
}

// Wrap selected text with a custom tag (e.g., spoiler)
function wrapTextWithTag(openTag, closeTag) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return;

    // If the text is already wrapped, unwrap it
    if (selectedText.startsWith(openTag) && selectedText.endsWith(closeTag)) {
        const newText = selectedText.slice(openTag.length, -closeTag.length);
        document.execCommand("insertText", false, newText);
    } else {
        document.execCommand("insertHTML", false, openTag + selectedText + closeTag);
    }
}

// Convert editor content to Steam review format and show output
function generateSteamFormat() {
    const editorClone = document.getElementById('editor').cloneNode(true);

    // 1) Remove unwanted inline tags (<span>, <div>, <font>, <style>)
    editorClone.querySelectorAll("span, div, font, style").forEach(el => {
        el.replaceWith(el.innerText);
    });

    // 2) Convert all <table> elements into bracketed [table]/[tr]/[td]/[th]
    editorClone.querySelectorAll("table").forEach(table => {
        // Start building the bracketed table text
        let tableText = "[table]\n";
        
        // For each row <tr>, indent once (4 spaces) and wrap it in [tr]...[/tr]
        table.querySelectorAll("tr").forEach(tr => {
            tableText += "    [tr]\n";

            // For each cell, indent twice (8 spaces) and use [th] or [td]
            tr.querySelectorAll("th, td").forEach(cell => {
                const cellText = cell.innerText.trim();
                if (cell.tagName.toLowerCase() === "th") {
                    tableText += `        [th]${cellText}[/th]\n`;
                } else {
                    tableText += `        [td]${cellText}[/td]\n`;
                }
            });

            tableText += "    [/tr]\n";
        });

        tableText += "[/table]\n";
        
        // Replace the original <table> with our bracketed syntax
        table.outerHTML = tableText;
    });

    // 3) Convert lists (<ul>/<ol>) to [list]/[olist]
    editorClone.querySelectorAll("ul, ol").forEach(list => {
        const listType = list.tagName.toLowerCase() === "ul" ? "list" : "olist";
        let listItems = "";

        list.querySelectorAll("li").forEach(li => {
            const itemText = li.innerText.trim();
            if (itemText) {
                listItems += `[*]${itemText}\n`;
            }
        });

        list.outerHTML = `[${listType}]\n${listItems}[/${listType}]`;
    });

    // 4) Convert paragraphs <p> into blank lines (optional for spacing)
    editorClone.innerHTML = editorClone.innerHTML.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');

    // 5) Perform main HTML -> bracket replacements (headings, bold, italic, underline, etc.)
    let formattedText = editorClone.innerHTML

        // HEADINGS (handles <h1>, <h2>, <h3> with optional attributes)
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '[h1]$1[/h1]')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '[h2]$1[/h2]')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '[h3]$1[/h3]')

        // BOLD / ITALIC
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '[b]$1[/b]')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '[b]$1[/b]')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '[i]$1[/i]')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '[i]$1[/i]')

        // UNDERLINE (<u> or <u ...>)
        .replace(/<u[^>]*>(.*?)<\/u>/gi, '[u]$1[/u]')

        // STRIKETHROUGH (handle <strike>, <del>, <s>)
        .replace(/<(?:strike|s|del)(?:\s+[^>]*)?>(.*?)<\/(?:strike|s|del)>/gi, '[strike]$1[/strike]')

        // BLOCKQUOTE with possible attributes => [quote]
        .replace(/<blockquote[^>]*>/gi, '[quote]')
        .replace(/<\/blockquote[^>]*>/gi, '[/quote]')

        // <br> => newline
        .replace(/<br[^>]*>/gi, '\n')

        // <hr> => [hr] (captures <hr> or <hr /> with attributes)
        .replace(/<hr\b[^>]*\/?>/gi, '[hr]')

        // Non-breaking space => normal space
        .replace(/&nbsp;/gi, ' ')

        // Remove any remaining HTML tags
        .replace(/<[^>]+>/gi, '')

        // Trim extra whitespace
        .trim();

    // 6) Display the final text in <pre id="output">
    const outputEl = document.getElementById('output');
    outputEl.innerText = formattedText;
    outputEl.style.display = "block";
}

/**
 * INSERT TABLE FROM FORM
 * 
 * This function reads rows, cols, and optional "include header" from the form,
 * then inserts the generated table HTML at the caret in #editor.
 */
function insertTableFromForm() {
    const rows = parseInt(document.getElementById("table-rows").value, 10) || 2;
    const cols = parseInt(document.getElementById("table-cols").value, 10) || 2;
    const includeHeader = document.getElementById("table-header").checked;

    let tableHtml = '<table class="styled-table"><tbody>';

    // If user wants a header row
    if (includeHeader) {
        tableHtml += '<tr>';
        for (let c = 0; c < cols; c++) {
            tableHtml += '<th>Header</th>';
        }
        tableHtml += '</tr>';
    }

    // Add body rows
    for (let r = 0; r < rows; r++) {
        tableHtml += '<tr>';
        for (let c = 0; c < cols; c++) {
            tableHtml += '<td>Cell</td>';
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><br>';

    // Insert into the editor at the caret
    document.execCommand('insertHTML', false, tableHtml);
}