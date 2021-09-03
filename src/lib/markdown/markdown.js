import MarkdownIt from "markdown-it";
import { v4 as uuid } from "uuid";

import MarkdownItMath from "markdown-it-math-loose";
import MarkdownItMergeCells from "markdown-it-merge-cells/src";
import MarkdonwItSub from "markdown-it-sub";
import MarkdonwItSup from "markdown-it-sup";
import MarkdonwItIns from "markdown-it-ins";
import MarkdonwItContainer from "markdown-it-container";
import MarkdownItMark from "markdown-it-mark";
import sanitize from './sanitize'
import renderMath from './mathjax'
import highlight from './codeHighlighter'

// [result, highlightPlaceholders, mathPlaceholders, findPlaceholderElement]
function renderMarkdown(
    text,
    onPatchRenderer
) {
    // Use a <span> placeholder for highlights and maths
    // They're replaced after HTML sanitation

    const highlightPlaceholders = [];
    const mathPlaceholders = [];

    function generatePlaceholder(id) {
        return `<span data-id=${id}></span>`;
    }

    function findPlaceholderElement(wrapperElement, id) {
        return wrapperElement.querySelector(`[data-id="${id}"]`);
    }

    function addHighlightPlaceholder(code, language) {
        const placeholder = {
            id: uuid(),
            code,
            language
        };

        highlightPlaceholders.push(placeholder);

        return generatePlaceholder(placeholder.id);
    }

    function addMathPlaceholder(code, display) {
        const placeholder = {
            id: uuid(),
            code,
            display
        };

        mathPlaceholders.push(placeholder);

        return generatePlaceholder(placeholder.id);
    }

    // Initialize renderer
    const renderer = new MarkdownIt({
        html: true,
        breaks: false,
        linkify: true,
        typographer: false,
        highlight: addHighlightPlaceholder
    });

    renderer.use(MarkdownItMath, {
        inlineOpen: "$",
        inlineClose: "$",
        blockOpen: "$$",
        blockClose: "$$",
        inlineRenderer: (code) => addMathPlaceholder(code, false),
        blockRenderer: (code) => addMathPlaceholder(code, true)
    });
    renderer.use(MarkdonwItIns);
    renderer.use(MarkdonwItSub);
    renderer.use(MarkdonwItSup);
    renderer.use(MarkdownItMark);
    renderer.use(MarkdonwItContainer, "hljs-left");
    renderer.use(MarkdonwItContainer, "hljs-right");
    renderer.use(MarkdonwItContainer, "hljs-center");

    if (onPatchRenderer) onPatchRenderer(renderer);

    return [renderer.render(text), highlightPlaceholders, mathPlaceholders, findPlaceholderElement];
}

function renderMarkdownPreview(value) {
    const [markdownResult, highlightPlaceholders, mathPlaceholders, findPlaceholderElement] = renderMarkdown(value);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = sanitize(markdownResult);
    highlightPlaceholders.forEach(item => {
        const element = findPlaceholderElement(wrapper, item.id);
        element.outerHTML = "[代码]";
    });

    mathPlaceholders.forEach(item => {
        const element = findPlaceholderElement(wrapper, item.id);
        element.outerHTML = "[公式]";
    });

    for (const pre of wrapper.querySelectorAll("img")) {
        pre.replaceWith("[图片]");
    }

    for (const tab of wrapper.querySelectorAll("table")) {
        tab.replaceWith("[表格]");
    }

    return wrapper.innerText;
}

function renderMarkdownHtml(value, noSanitize) {
    const [markdownResult, highlightPlaceholders, mathPlaceholders, findPlaceholderElement] = renderMarkdown(value);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = noSanitize ? markdownResult : sanitize(markdownResult);

    highlightPlaceholders.forEach(item => {
        const element = findPlaceholderElement(wrapper, item.id);
        element.outerHTML = highlight(item.code, item.language);
    });
    // Render maths
    mathPlaceholders.forEach(item => {
        const element = findPlaceholderElement(wrapper, item.id);
        element.parentNode.replaceChild(renderMath(item.code, item.display), element);
    });

    // Patch <a> tags for security reason
    Array.from(wrapper.getElementsByTagName("a")).forEach(a => {
        a.relList.add("noreferrer", "noreferrer");
        a.target = "_blank";
    });

    return wrapper.innerHTML;
}

export {renderMarkdownHtml, renderMarkdownPreview};