const markdown = document.getElementById('markdown');
const output = document.querySelector('.output');
const togglePreviewButton = document.getElementById('togglePreview');
const nextPageButton = document.getElementById('nextPage');
const previousPageButton = document.getElementById('previousPage');
const exportButton = document.getElementById('export');
const darkModeButton = document.getElementById('dark-mode');
const code = document.getElementById('code');
const baseCssInput = document.getElementById('base-css');

let currentPage = 0;

let pages = [];
let baseCss = '';

// Toggle preview mode on button click
togglePreviewButton.addEventListener('click', () => {
    if (markdown.style.display === 'block') {
        // replace the markdown input area with a div that contains the rendered markdown
        let markdownHeight = markdown.clientHeight;
        markdown.style.display = 'none';
        // insert div with rendered markdown in place of the textarea

        if (document.getElementById('markdown-preview')) {
            document.getElementById('markdown-preview').remove();
        }
        markdown.insertAdjacentHTML('afterend', `<div id="markdown-preview">${marked.parse(markdown.value)}</div>`);

        let preview = document.getElementById('markdown-preview');
        preview.style.height = markdownHeight + 'px';

        togglePreviewButton.textContent = 'Edit markdown';
    } else {
        markdown.style.display = 'block';
        
        if (document.getElementById("markdown-preview"))
            document.getElementById('markdown-preview').remove();
        togglePreviewButton.textContent = 'Preview markdown';
    }
});

// listener for keydown events in textareas
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('keydown', e => {
        if (e.key === 'Tab' && !e.shiftKey && textarea.id !== 'markdown') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
        // every new line should have the same indentation as the previous line
        if (e.key === 'Enter') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            let indentation = '';
            let i = start - 1;
            while (i >= 0 && value[i] !== '\n') {
                if (value[i] === '\t') {
                    indentation += '\t';
                } else {
                    indentation += ' ';
                }
                i--;
            }
            textarea.value = value.substring(0, start) + '\n' + indentation + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + indentation.length + 1;
        }

        if (textarea.id === 'code' || textarea.id === 'base-css') {
            let start, end;
            
            switch (e.key) {
                case '(':
                    e.preventDefault();
                    start = textarea.selectionStart;
                    end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + '()' + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                    break;
                
                case '{':
                    e.preventDefault();
                    start = textarea.selectionStart;
                    end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + '{}' + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                    break;

                case '[':
                    e.preventDefault();
                    start = textarea.selectionStart;
                    end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + '[]' + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                    break;

                case '"':
                    e.preventDefault();
                    start = textarea.selectionStart;
                    end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + '""' + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                    break;

                case "'":
                    e.preventDefault();
                    start = textarea.selectionStart;
                    end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + "''" + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                    break;
                case '<':
                    e.preventDefault();
                    start = textarea.selectionStart;
                    end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + '<></>' + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                    break;
            
                default:
                    break;
            }
        }
    });
});

function exportToJson() {
    let json = {
        pages: pages,
        css: baseCss
    };

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "presentation.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

exportButton.addEventListener('click', exportToJson);

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));

});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
}

window.addEventListener('beforeunload', function (e) {
    if (markdown.value.length > 0 || document.getElementById('code').value.length > 0 || document.getElementById('base-css').value.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

function showPage(pageIndex) {
    output.innerHTML = pages[pageIndex].code;
    markdown.value = pages[pageIndex].content;
    code.value = pages[pageIndex].code;
}

code.addEventListener("input", function() {
    output.innerHTML = code.value;
});

showPage(currentPage);

nextPageButton.addEventListener('click', () => {
    currentPage = Math.min(currentPage + 1, pages.length - 1);
    // save the current page's code

    pages[currentPage].code = input.value;
    pages[currentPage].content = markdown.value;
    showPage(currentPage);
});

previousPageButton.addEventListener('click', () => {
    currentPage = Math.max(currentPage - 1, 0);
    pages[currentPage].code = input.value;
    pages[currentPage].content = markdown.value;
    showPage(currentPage);
});

document.addEventListener("keydown", function(event) {
    if (event.target.tagName === "TEXTAREA") {
        return; // dont do anything inside the input thing
    }

    if (event.key === "ArrowRight") {
        currentPage = Math.min(currentPage + 1, pages.length - 1); // too lazy to add index checking inside the function lolz

        pages[currentPage].code = input.value;
        pages[currentPage].content = markdown.value;
        showPage(currentPage);
    } else if (event.key === "ArrowLeft") {
        currentPage = Math.max(currentPage - 1, 0);

        pages[currentPage].code = input.value;
        pages[currentPage].content = markdown.value;
        showPage(currentPage);
    }
});
