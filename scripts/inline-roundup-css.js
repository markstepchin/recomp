/**
 * Inline styles/output.css into the roundup only.
 * The linked sheet is render-blocking; the LCP element is text in the first screen,
 * and a second request delays that paint. Other pages keep the shared stylesheet.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const pagePath = join(root, "blog/best-progress-photo-apps/index.html");
const css = readFileSync(join(root, "styles/output.css"), "utf8").replace(/<\/style/gi, "<\\/style");
const block = `<!-- Inlined so the shared stylesheet is not a second render-blocking request. -->\n    <style>${css}</style>`;
const link = `<link rel="stylesheet" href="../../styles/output.css" />`;

let html = readFileSync(pagePath, "utf8");
const marked = /<!-- Inlined so the shared stylesheet is not a second render-blocking request\. -->\s*<style>[\s\S]*?<\/style>/;

if (marked.test(html)) {
  html = html.replace(marked, block);
} else if (html.includes(link)) {
  html = html.replace(link, block);
} else {
  console.error("roundup stylesheet link not found");
  process.exit(1);
}

writeFileSync(pagePath, html);
console.log("inlined roundup css", css.length);
