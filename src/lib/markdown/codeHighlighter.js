import Prism from "prismjs";
import cssPath from "./prism-ghcolors.css";

function normalizeCode(code) {
  return code.split("\r").join("");
}

function escapeHtml(text) {
  text = text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(" ").join("&nbsp;");
  return text;
}

const cssLinkTag = document.createElement("link");
cssLinkTag.rel = "stylesheet";
cssLinkTag.href = cssPath;
document.head.appendChild(cssLinkTag);

export default function highlight(code, language) {
  code = normalizeCode(code);

  function doHighlight() {
    if (language) {
      try {
        const name = language.trim().toLowerCase();
        console.log(Prism.languages)
        if (name in Prism.languages) {
          return Prism.highlight(code, Prism.languages[name], name);
        }
      } catch (e) {
        console.error(`Failed to highlight, language = ${language}`, e);
      }
    }

    return escapeHtml(code).split("\n").join("<br>");
  }

  // See src/assets/prism-tomorrow.url.css
  return `<div class="highlighted">${doHighlight()}</div>`;
}