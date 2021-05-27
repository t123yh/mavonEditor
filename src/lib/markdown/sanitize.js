
import { FilterXSS, escapeAttrValue } from "xss";

// Get the default white list
const xssWhiteList = require("xss/lib/default").whiteList;

// Disallow <audio> and <video> tags
delete xssWhiteList.audio;
delete xssWhiteList.video;

xssWhiteList.input = ["type", "disabled", "checked"];

// Allow "style" and "class" attributes
Object.keys(xssWhiteList).forEach(tag => {
  xssWhiteList[tag].push("style", "class");
});

// The "data-id" arrtibute is used for highlight and math rendering
xssWhiteList["span"].push("data-id");

function originalAttrValue(name, value) {
  return name + '="' + escapeAttrValue(value) + '"';
}

export default function sanitize(
  html,
  onTagAttr
) {
  const xss = new FilterXSS({
    whiteList: xssWhiteList,
    stripIgnoreTag: true,
    onTagAttr: (tag, name, value, isWhiteAttr) => {
      if (onTagAttr) {
        const result = onTagAttr(tag, name, value, escapeAttrValue);
        if (typeof result === "string") return result;
        else if (result === true) return originalAttrValue(name, value);
      }

      // Allow data URIs for <img>
      if (tag.toLowerCase() === "img" && name.toLowerCase() === "src" && value.startsWith("data:image/"))
        return originalAttrValue(name, value);
    }
  });

  const filteredHtml = xss.process(html);
  if (!filteredHtml) return "";

  return filteredHtml;
}