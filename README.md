Review Maker

A simple WYSIWYG (What You See Is What You Get) editor built for generating Steam-style reviews with rich formatting options. It supports headings, bold, italic, underline, strikethrough, blockquotes, lists, horizontal rules, spoiler tags—and, in this environment, [table] syntax is recognized for displaying tables.

	Important: By default, official Steam comment/review sections do not support [table] tags. If you have confirmed your environment supports them (via mods, special forums, or custom parsing), tables will render as intended. Otherwise, [table], [tr], [td], and [th] tags may appear as literal text in a standard Steam review.

Features
	•	Live Editing: Type and style text in real-time within a contenteditable div.
	•	Advanced Formatting:
	•	Headings: [h1], [h2], [h3].
	•	Lists: [list] or [olist] with [*] items.
	•	Text Styles: Bold ([b]), italic ([i]), underline ([u]), strikethrough ([strike]).
	•	Quotes: [quote] ... [/quote].
	•	Horizontal Rule: [hr].
	•	Spoiler Tag: [spoiler] ... [/spoiler].
	•	Table Generation:
If your environment supports it, <table> elements will convert to:

[table]
    [tr]
        [th]Header[/th]
        [th]Header 2[/th]
    [/tr]
    [tr]
        [td]Cell 1[/td]
        [td]Cell 2[/td]
    [/tr]
[/table]


	•	Steam-Compatible Output: One-click conversion from HTML to bracket-based tags displayed in a <pre> block, ready for copy-paste.

Getting Started
	1.	Clone the repository or download the source files:

git clone https://github.com/<your-username>/review-maker.git
cd review-maker


	2.	Open index.html in your web browser:
	•	No build steps or compilation are required.
	•	All files (index.html, script.js, styles.css) can be hosted locally or on a simple web server.
	3.	Start Editing:
	•	Type in the editor (#editor area).
	•	Use the toolbar to apply formatting:
	•	Bold, Italic, Underline, Strikethrough
	•	Headings (H1, H2, H3)
	•	Unordered/Ordered Lists
	•	Blockquotes
	•	Horizontal Line
	•	Spoiler Tags
	•	Fill out the table form (rows, columns, optional header) to insert a table (if supported by your environment).
	4.	Generate Steam Format:
	•	Click “Generate Steam Format” to transform the HTML content into bracket-based tags (BBCode-like syntax).
	•	The formatted text will appear in the <pre id="output"> element.
	•	Copy the result into your target platform (Steam or other).

Usage Example
	1.	Type something like:

This is my new [spoiler]secret[/spoiler] build!

< Insert Table >


	2.	Add a table with 3 rows, 3 columns, and a header:
	•	Rows: 3
	•	Cols: 3
	•	Include Header: checked
	3.	The editor automatically inserts something like:

[table]
    [tr]
        [th]Header[/th]
        [th]Header[/th]
        [th]Header[/th]
    [/tr]
    [tr]
        [td]Cell[/td]
        [td]Cell[/td]
        [td]Cell[/td]
    [/tr]
    [tr]
        [td]Cell[/td]
        [td]Cell[/td]
        [td]Cell[/td]
    [/tr]
[/table]


	4.	Click “Generate Steam Format”. The final text (with your other formatting, headings, etc.) appears in a separate box for easy copying.

File Structure

review-maker/
├─ index.html      // Main HTML, includes the editor, toolbar, table form, etc.
├─ script.js       // Core logic for formatting commands and BBCode generation
├─ styles.css      // Basic styling for the editor layout & toolbar

Known Limitations
	•	Deprecation Warning: The editor relies on document.execCommand(...), which is deprecated but still widely supported in most modern browsers as of now.
	•	Complex HTML: Inserting external HTML with advanced nesting or special attributes might not fully convert into bracketed tags.

License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

Happy Reviewing!

If you have any questions or issues, please open an Issue on this GitHub repository.
