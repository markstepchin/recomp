/**
 * Stamp partials/header.html and partials/footer.html into static pages,
 * and set each page's canonical and og:url from its path.
 * Cloudflare serves the HTML as-is, so the filled markup is what gets committed.
 * Edit the partials, then run `npm run build`.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SITE_URL = "https://progressphotos.app";

const root = new URL("..", import.meta.url).pathname;
const headerPartial = readFileSync(join(root, "partials/header.html"), "utf8").trim();
const footerPartial = readFileSync(join(root, "partials/footer.html"), "utf8").trim();
const themeBoot = readFileSync(join(root, "partials/theme-boot.html"), "utf8").trim();

const skip = new Set([
  "privacy.html",
  "support.html",
  "claude-version.html",
  "google6d053ef5debca997.html",
]);

function pages(dir = root) {
  const found = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "docs" || name === ".git") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "partials") continue;
      found.push(...pages(path));
      continue;
    }
    if (!name.endsWith(".html")) continue;
    const rel = relative(root, path);
    if (skip.has(rel)) continue;
    found.push(rel);
  }
  return found;
}

function urls(depth) {
  const up = "../".repeat(depth);
  return {
    home: depth === 0 ? "./" : up,
    blog: depth >= 2 ? "../" : `${up}blog/`,
    about: `${up}about/`,
    privacy: `${up}privacy/`,
    faq: `${up}faq/`,
    support: `${up}support/`,
    roadmap: `${up}roadmap/`,
    assets: `${up}assets/`,
  };
}

function render(partial, depth, current) {
  const map = urls(depth);
  let html = partial;
  for (const [key, href] of Object.entries(map)) {
    html = html.replaceAll(`{{${key}}}`, href);
  }
  for (const id of ["blog", "about", "privacy"]) {
    const active = current === id;
    html = html.replaceAll(
      `{{nav:${id}}}`,
      active
        ? "text-fg no-underline hover:underline"
        : "text-muted no-underline hover:text-fg hover:underline",
    );
    html = html.replaceAll(
      `{{aria:${id}}}`,
      active ? 'aria-current="page"' : "",
    );
  }
  return html
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

// Page-specific App Store campaign. The shared header partial has no query, and a later build would otherwise drop one pasted into a stamped header.
function withCampaign(html, campaign) {
  if (!campaign) return html;
  const base =
    "https://apps.apple.com/us/app/recomp-progress-photo-tracker/id6760444125";
  return html.replaceAll(`${base}"`, `${base}?ct=${campaign}"`);
}

function indentBlock(html, spaces) {
  const pad = " ".repeat(spaces);
  return html
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
}

function marked(kind, attrs, html, spaces) {
  const pad = " ".repeat(spaces);
  const attrText = Object.entries(attrs)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `${pad}<!-- chrome:${kind} ${attrText} -->\n${indentBlock(html, spaces)}\n${pad}<!-- /chrome:${kind} -->`;
}

function parseAttrs(raw) {
  const attrs = {};
  for (const match of raw.matchAll(/(\w+)="([^"]*)"/g)) attrs[match[1]] = match[2];
  return attrs;
}

function infer(html) {
  const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/);
  const currentMatch = header?.[0].match(/aria-current="page"[\s\S]*?>([^<]+)</);
  const current = currentMatch ? currentMatch[1].trim().toLowerCase() : "";
  const home = html.match(/aria-label="Footer"[\s\S]*?href="([^"]+)"/);
  const href = home?.[1] ?? "./";
  const depth = href.startsWith("../../") ? 2 : href.startsWith("../") ? 1 : 0;
  return { current, depth };
}

function publicUrl(rel) {
  const normalized = rel.split("\\").join("/");
  if (normalized === "partials/post.html") return `${SITE_URL}/blog/post-slug/`;
  let path = normalized;
  if (path.endsWith("/index.html")) path = path.slice(0, -"index.html".length);
  else if (path === "index.html") path = "";
  else path = path.replace(/\.html$/, "");
  if (path === "" || path === "/") return `${SITE_URL}/`;
  if (!path.endsWith("/")) path += "/";
  return `${SITE_URL}/${path}`;
}

const tag = (name) => new RegExp(`<${name}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, "gi");

function setAttr(markup, attr, value) {
  const quoted = new RegExp(`\\b${attr}\\s*=\\s*(["'])[^"']*\\1`, "i");
  if (quoted.test(markup)) {
    return markup.replace(quoted, (_, quote) => `${attr}=${quote}${value}${quote}`);
  }
  return markup.replace(/\/?>$/, (end) => ` ${attr}="${value}"${end}`);
}

function stampTheme(html) {
  const rendered = (spaces) => {
    const pad = " ".repeat(spaces);
    const body = themeBoot
      .split("\n")
      .map((line) => (line.length ? pad + line : line))
      .join("\n");
    return `${pad}<!-- chrome:theme -->\n${body}\n${pad}<!-- /chrome:theme -->`;
  };

  const existing = html.match(/^([ \t]*)<!-- chrome:theme -->/m);
  if (existing) {
    return html.replace(
      /^[ \t]*<!-- chrome:theme -->[\s\S]*?<!-- \/chrome:theme -->/m,
      rendered(existing[1].length),
    );
  }

  return html.replace(/<meta charset="utf-8"\s*\/?>/i, (meta, offset) => {
    const lineStart = html.lastIndexOf("\n", offset) + 1;
    const spaces = html.slice(lineStart, offset).match(/^[ \t]*/)[0].length;
    return `${meta}\n${rendered(spaces)}`;
  });
}

function stampHead(html, url) {
  let canonicals = 0;
  let next = html.replace(tag("link"), (el) => {
    if (!/\brel\s*=\s*["']canonical["']/i.test(el)) return el;
    canonicals += 1;
    return canonicals === 1 ? setAttr(el, "href", url) : "";
  });
  if (canonicals === 0) {
    next = next.replace(/<\/head>/i, `    <link rel="canonical" href="${url}" />\n  </head>`);
  }

  let ogUrls = 0;
  next = next.replace(tag("meta"), (el) => {
    if (!/\bproperty\s*=\s*["']og:url["']/i.test(el)) return el;
    ogUrls += 1;
    return ogUrls === 1 ? setAttr(el, "content", url) : "";
  });
  if (ogUrls === 0) {
    next = next.replace(
      /<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i,
      (el) => `${el}\n    <meta property="og:url" content="${url}" />`,
    );
  }
  return next;
}

function apply(html) {
  const inferred = infer(html);
  let next = html;

  next = next.replace(
    /^([ \t]*)<!-- chrome:header\b(.*?)-->([\s\S]*?)<!-- \/chrome:header -->/m,
    (match, spaces, attrSource) => {
      const attrs = parseAttrs(attrSource);
      const depth = Number(attrs.depth ?? inferred.depth);
      const current = attrs.current ?? inferred.current;
      const headerAttrs = { current, depth };
      if (attrs.campaign) headerAttrs.campaign = attrs.campaign;
      return marked(
        "header",
        headerAttrs,
        withCampaign(render(headerPartial, depth, current), attrs.campaign),
        spaces.length,
      );
    },
  );

  if (!next.includes("<!-- chrome:header")) {
    next = next.replace(/^[ \t]*<header class="site-header">[\s\S]*?<\/header>/m, (match) => {
      const spaces = match.match(/^[ \t]*/)[0].length;
      const depth = inferred.depth || 1;
      const current = inferred.current;
      return marked("header", { current, depth }, render(headerPartial, depth, current), spaces);
    });
  }

  next = next.replace(
    /^([ \t]*)<!-- chrome:footer\b(.*?)-->([\s\S]*?)<!-- \/chrome:footer -->/m,
    (match, spaces, attrSource) => {
      const attrs = parseAttrs(attrSource);
      const depth = Number(attrs.depth ?? inferred.depth);
      return marked("footer", { depth }, render(footerPartial, depth, ""), spaces.length);
    },
  );

  if (!next.includes("<!-- chrome:footer")) {
    next = next.replace(/^[ \t]*<footer class="site-footer[^"]*">[\s\S]*?<\/footer>/m, (match) => {
      const spaces = match.match(/^[ \t]*/)[0].length;
      return marked("footer", { depth: inferred.depth }, render(footerPartial, inferred.depth, ""), spaces);
    });
  }

  return next;
}

const targets = pages();
targets.push("partials/post.html");
let changed = 0;
for (const rel of targets) {
  const path = join(root, rel);
  let before;
  try {
    before = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  if (!before.includes("site-footer") && !before.includes("chrome:footer")) continue;
  const after = stampHead(stampTheme(apply(before)), publicUrl(rel));
  if (after !== before) {
    writeFileSync(path, after);
    changed += 1;
    console.log("updated", rel);
  }
}
console.log(`chrome applied (${changed} file${changed === 1 ? "" : "s"})`);
