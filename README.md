Review Maker

A simple WYSIWYG (What You See Is What You Get) editor built for generating Steam reviews. It supports headings, bold, italic, underline, strikethrough, blockquotes, lists, horizontal rules, spoiler tags—and, tables.

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


	•	Steam-Compatible Output: One-click conversion from HTML to bracket-based tags displayed in a <pre> block, ready for copy-paste.

Getting Started
	1.	Clone the repository or download the source files:

git clone https://github.com/yaskael/review-maker.git
cd review-maker
open index.html on your browser.


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
