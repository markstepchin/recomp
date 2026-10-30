/**
 * Compare what an old build served against _site/.
 *
 *   node scripts/diff-site.js <old-build-root> [new-root=_site]
 *
 * <old-build-root> is a checkout where the old `npm run build` ran in place (Cloudflare
 * served the repo root minus .assetsignore). Files present in both must be byte-identical
 * once ?v=<hash> query strings are normalized. Lists files that are no longer public and
 * files that are new. Exits 1 if any shared file differs.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const [oldRoot, newRoot = "_site"] = process.argv.slice(2);
if (!oldRoot) {
  console.error("usage: node scripts/diff-site.js <old-build-root> [new-root]");
  process.exit(2);
}

// What wrangler skipped in the old root: .assetsignore (simple gitignore subset) plus defaults.
const globToRegex = (glob) =>
  new RegExp(
    "^" +
      glob
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*\//g, "(?:.*/)?")
        .replace(/\*\*/g, ".*")
        .replace(/\*/g, "[^/]*") +
      "(?:/.*)?$",
  );
const patterns = [".assetsignore", "node_modules", ".git", ".wrangler", ".DS_Store"];
const ignoreFile = join(oldRoot, ".assetsignore");
if (existsSync(ignoreFile)) {
  for (const line of readFileSync(ignoreFile, "utf8").split("\n")) {
    const p = line.trim();
    if (p && !p.startsWith("#")) patterns.push(p);
  }
}
const rules = patterns.map((p) => (p.includes("/") ? globToRegex(p.replace(/^\//, "")) : new RegExp(`(^|/)${globToRegex(p).source.slice(1)}`)));
const ignored = (rel) => rules.some((re) => re.test(rel));

function walk(base, dir = base, skip = () => false) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const rel = relative(base, path);
    if (skip(rel)) continue;
    if (statSync(path).isDirectory()) out.push(...walk(base, path, skip));
    else out.push(rel);
  }
  return out;
}

const oldFiles = new Set(walk(oldRoot, oldRoot, ignored));
const newFiles = new Set(walk(newRoot));
const normalize = (buf) => buf.toString("latin1").replace(/\?v=[0-9a-f]+/g, "?v=HASH");

let identical = 0;
let sameAfterHash = 0;
const differ = [];
for (const rel of [...oldFiles].sort()) {
  if (!newFiles.has(rel)) continue;
  const a = readFileSync(join(oldRoot, rel));
  const b = readFileSync(join(newRoot, rel));
  if (a.equals(b)) identical += 1;
  else if (normalize(a) === normalize(b)) sameAfterHash += 1;
  else differ.push(rel);
}
const removed = [...oldFiles].filter((rel) => !newFiles.has(rel)).sort();
const added = [...newFiles].filter((rel) => !oldFiles.has(rel)).sort();

console.log(`shared files: ${identical + sameAfterHash + differ.length}`);
console.log(`  byte-identical: ${identical}`);
console.log(`  identical apart from ?v= hashes: ${sameAfterHash}`);
console.log(`  different: ${differ.length}`);
for (const rel of differ) console.log(`    ${rel}`);
console.log(`no longer public (only in old build): ${removed.length}`);
for (const rel of removed) console.log(`    ${rel}`);
console.log(`new in ${newRoot}: ${added.length}`);
for (const rel of added) console.log(`    ${rel}`);
process.exit(differ.length ? 1 : 0);
