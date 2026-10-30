/**
 * Append a content hash to CSS and JS URLs in HTML.
 * Those files are not renamed, so the query string is the version.
 * `_headers` can then mark them immutable. Run after the CSS build.
 * Markdown posts are stamped by eleventy.config.js with `stamp()`, and the
 * build then runs `findMismatches()` against _site/ as well.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;

export const versioned = ["styles/output.css", "js/posthog.js", "js/theme.js"];

function hashFile(rel) {
  const digest = createHash("sha256").update(readFileSync(join(root, rel))).digest("hex");
  return digest.slice(0, 8);
}

/** Current hashes, read from disk each call so `npm run dev` picks up a rebuilt CSS file. */
export const currentVersions = () => Object.fromEntries(versioned.map((rel) => [rel, hashFile(rel)]));

export function stamp(html, versions = currentVersions()) {
  let next = html;
  for (const rel of versioned) {
    const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${escaped}(?:\\?v=[0-9a-f]+)?`, "g");
    next = next.replace(pattern, `${rel}?v=${versions[rel]}`);
  }
  return next;
}

const skip = new Set([
  "claude-version.html",
  "privacy.html",
  "support.html",
  "google6d053ef5debca997.html",
]);

const skipDirs = new Set(["node_modules", "docs", ".git", "_site"]);

function pages(dir = root) {
  const found = [];
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
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

// Every HTML href/src that points at these files must carry the current ?v=.
// Includes files the stamper skips, so a comment-only mention is ignored and a real tag is not.
const attrRefs = /\b(?:href|src)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;

function allHtml(base, dir = base) {
  const found = [];
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      found.push(...allHtml(base, path));
      continue;
    }
    if (name.endsWith(".html")) found.push(relative(base, path));
  }
  return found;
}

/** List `file: url` for every stale or missing ?v= in the HTML under `base`. */
export function findMismatches(base = root, versions = currentVersions()) {
  const mismatches = [];
  for (const rel of allHtml(base)) {
    const html = readFileSync(join(base, rel), "utf8");
    for (const match of html.matchAll(attrRefs)) {
      const url = match[1] || match[2];
      const bare = url.split("#")[0];
      const path = bare.split("?")[0];
      const asset = versioned.find((file) => path.endsWith(file));
      if (!asset) continue;
      const expected = `v=${versions[asset]}`;
      const query = bare.includes("?") ? bare.slice(bare.indexOf("?") + 1) : "";
      if (query !== expected) mismatches.push(`${rel}: ${url}`);
    }
  }
  return mismatches;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const versions = currentVersions();
  let changed = 0;
  for (const rel of pages()) {
    const path = join(root, rel);
    const before = readFileSync(path, "utf8");
    if (!versioned.some((file) => before.includes(file))) continue;
    const after = stamp(before, versions);
    if (after !== before) {
      writeFileSync(path, after);
      changed += 1;
      console.log("versioned", rel);
    }
  }

  const hashes = versioned.map((rel) => `${rel}?v=${versions[rel]}`).join(", ");
  console.log(`asset versions stamped (${changed} file${changed === 1 ? "" : "s"}): ${hashes}`);

  const mismatches = findMismatches(root, versions);
  if (mismatches.length) {
    console.error("asset version mismatch:");
    for (const line of mismatches) console.error("  " + line);
    process.exit(1);
  }
  console.log("asset versions match every HTML href/src");
}
