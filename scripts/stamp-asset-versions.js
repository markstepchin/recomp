/**
 * Append a content hash to CSS and JS URLs in HTML.
 * Those files are not renamed, so the query string is the version.
 * `_headers` can then mark them immutable. Run after the CSS build.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const versioned = ["styles/output.css", "js/posthog.js", "js/theme.js"];

function hashFile(rel) {
  const digest = createHash("sha256").update(readFileSync(join(root, rel))).digest("hex");
  return digest.slice(0, 8);
}

const versions = Object.fromEntries(versioned.map((rel) => [rel, hashFile(rel)]));

function stamp(html) {
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

function pages(dir = root) {
  const found = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "docs" || name === ".git") continue;
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

let changed = 0;
for (const rel of pages()) {
  const path = join(root, rel);
  const before = readFileSync(path, "utf8");
  if (!versioned.some((file) => before.includes(file))) continue;
  const after = stamp(before);
  if (after !== before) {
    writeFileSync(path, after);
    changed += 1;
    console.log("versioned", rel);
  }
}

const hashes = versioned.map((rel) => `${rel}?v=${versions[rel]}`).join(", ");
console.log(`asset versions stamped (${changed} file${changed === 1 ? "" : "s"}): ${hashes}`);
