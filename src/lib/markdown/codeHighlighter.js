import Prism from "prismjs";
import Hljs from "highlight.js"

function normalizeCode(code) {
  return code.split("\r").join("");
}

function escapeHtml(text) {
  text = text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(" ").join("&nbsp;");
  return text;
}

export default function highlight(code, language) {
  code = normalizeCode(code);

  function doHighlight() {
    if (language) {
      try {
        const name = language.trim().toLowerCase();
        // if (name in Prism.languages) {
        //   console.log(Prism.highlight(code, Prism.languages[name], name));
        //   return Prism.highlight(code, Prism.languages[name], name);
        // }
        if (Hljs.getLanguage(name)) {
          // console.log(Hljs.highlight(code, {language: name}))
          return Hljs.highlight(code, {language: name}).value; // highlight(code, {language, ignoreIllegals})
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
