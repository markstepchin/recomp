// Tests for scripts/build-blog.js using tests/fixtures/example-post/index.md.
// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, BuildError } from "../scripts/build-blog.js";

const repo = new URL("..", import.meta.url).pathname;
const fixture = join(repo, "tests/fixtures/example-post");

function site({ draft = true, extra = "" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "blog-"));
  mkdirSync(join(root, "partials"));
  cpSync(join(repo, "partials/article.html"), join(root, "partials/article.html"));
  cpSync(fixture, join(root, "blog/example-post"), { recursive: true });
  const mdPath = join(root, "blog/example-post/index.md");
  let md = readFileSync(mdPath, "utf8");
  if (!draft) md = md.replace(/^draft: true.*$/m, "draft: false");
  writeFileSync(mdPath, md + extra);
  writeFileSync(join(root, "sitemap.xml"), "<urlset>\n  <!-- blog:start -->\n  <!-- blog:end -->\n</urlset>\n");
  writeFileSync(join(root, "blog/index.html"), "<div>\n<!-- posts:start -->\n<!-- posts:end -->\n</div>\n");
  writeFileSync(join(root, "llms.txt"), "# Recomp\n<!-- posts:start -->\n<!-- posts:end -->\n");
  return root;
}

const quiet = { log: () => {} };

test("draft builds with noindex and badge, strips TODO comments, stays out of lists", () => {
  const root = site();
  const { warnings } = build(root, quiet);
  const html = readFileSync(join(root, "blog/example-post/index.html"), "utf8");
  assert.match(html, /<meta name="robots" content="noindex" \/>/);
  assert.match(html, /\[DRAFT: noindex, not published\]/);
  assert.doesNotMatch(html, /<!--\s*TODO: link to future/);
  assert.match(html, /<code>&lt;!-- TODO: not a real TODO --&gt;<\/code>/);
  assert.match(html, /<h2 id="existing-anchor-id">Why this heading keeps its anchor<\/h2>/);
  assert.match(html, /<h3 id="a-subsection">/);
  assert.match(html, /<img src="\.\/example\.webp" alt="Co-located screenshot" class="block h-auto w-full rounded-card" loading="lazy" decoding="async">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/progressphotos\.app\/blog\/example-post\/example\.webp" \/>/);
  assert.match(html, /"datePublished": "2026-11-02"/);
  assert.match(html, /"dateModified": "2026-11-03"/);
  assert.match(html, /Published Nov 2, 2026\. Tested November 2026\./);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /\[CONFIRM: a fact to check\]/);
  assert.doesNotMatch(readFileSync(join(root, "sitemap.xml"), "utf8"), /example-post/);
  assert.doesNotMatch(readFileSync(join(root, "blog/index.html"), "utf8"), /example-post/);
  assert.doesNotMatch(readFileSync(join(root, "llms.txt"), "utf8"), /example-post/);
});

test("non-draft with a TODO comment fails the build with file and line", () => {
  const root = site({ draft: false });
  assert.throws(() => build(root, quiet), (err) => err instanceof BuildError && /blog\/example-post\/index\.md:\d+: unresolved TODO/.test(err.message));
});

test("non-draft without TODOs is indexed and listed; [CONFIRM] only warns", () => {
  const root = site({ draft: false });
  const mdPath = join(root, "blog/example-post/index.md");
  writeFileSync(mdPath, readFileSync(mdPath, "utf8").replace("<!-- TODO: link to future bulk import article -->\n", ""));
  const { warnings } = build(root, quiet);
  const html = readFileSync(join(root, "blog/example-post/index.html"), "utf8");
  assert.doesNotMatch(html, /noindex/);
  assert.doesNotMatch(html, /\[DRAFT/);
  assert.match(warnings[0], /\(non-draft\)/);
  assert.match(readFileSync(join(root, "sitemap.xml"), "utf8"), /<loc>https:\/\/progressphotos\.app\/blog\/example-post\/<\/loc>\n    <lastmod>2026-11-03<\/lastmod>/);
  assert.match(readFileSync(join(root, "blog/index.html"), "utf8"), /November 2, 2026[\s\S]*href="example-post\/"[\s\S]*Optional shorter blurb/);
  assert.match(readFileSync(join(root, "llms.txt"), "utf8"), /- \[Example Progress Photo Article\]\(https:\/\/progressphotos\.app\/blog\/example-post\/\)/);
});

test("unknown frontmatter key fails", () => {
  const root = site();
  const mdPath = join(root, "blog/example-post/index.md");
  writeFileSync(mdPath, readFileSync(mdPath, "utf8").replace("draft: true", "draft: true\ntittle: typo"));
  assert.throws(() => build(root, quiet), /unknown frontmatter key "tittle"/);
});
