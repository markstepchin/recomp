// Tests for the app review template (blog/_templates/app-review.md) and its build check.
// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FRONTMATTER_KEYS, checkPost, checkTemplate, frontmatterKeys, isPostPath } from "../_config/blog.js";

const FILE = "blog/x/index.md";
const TEMPLATE = "blog/_templates/app-review.md";
const raw = readFileSync(TEMPLATE, "utf8");
const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");

const APP = { name: "App", developer_url: "https://example.com/" };
const GOOD_BODY = [
  "**Full disclosure: I build Recomp.** No ads.",
  "",
  "<!-- app-store-card -->",
  "",
  "Opening.",
  "",
  "## My verdict on App {#verdict}",
  "",
  "Verdict.",
].join("\n");
const good = { template: "app-review", summary: "A summary.", app_store: APP };
const errorsFor = (data, text = GOOD_BODY) => checkTemplate(FILE, data, text);

test("a complete non-draft app review passes", () => {
  assert.deepEqual(errorsFor(good), []);
});

test("posts without template, and drafts, are not checked", () => {
  assert.deepEqual(errorsFor({}, "Nothing here."), []);
  assert.deepEqual(errorsFor({ template: "app-review", draft: true }, "Nothing here."), []);
});

test("each missing part fails a non-draft app review", () => {
  const cases = [
    [{ ...good, summary: undefined }, GOOD_BODY, /summary/],
    [{ ...good, summary: "  \n" }, GOOD_BODY, /summary/],
    [good, GOOD_BODY.replace("**Full disclosure:", "Full disclosure:"), /disclosure/],
    [{ ...good, app_store: undefined }, GOOD_BODY, /app_store/],
    [good, GOOD_BODY.replace(" {#verdict}", ""), /verdict/],
  ];
  for (const [data, text, pattern] of cases) {
    const errors = errorsFor(data, text);
    assert.equal(errors.length, 1, String(pattern));
    assert.match(errors[0], pattern);
  }
  assert.equal(errorsFor({ template: "app-review" }, "Nothing.").length, 4);
});

test("an unknown template name fails, even on a draft", () => {
  assert.match(errorsFor({ template: "listicle", draft: true })[0], /unknown template "listicle"/);
});

test("the template is not a post, so it is never built, listed or guarded as one", () => {
  assert.equal(isPostPath(TEMPLATE), false);
  assert.equal(isPostPath(`./${TEMPLATE}`), false);
});

test("the template keeps the canonical order and opts in as a draft", () => {
  assert.match(raw, /^draft: true$/m);
  assert.match(raw, /^template: app-review$/m);
  assert.match(raw, /^ {2}developer_url: "https:\/\//m);
  const order = ["**Full disclosure:", "<!-- app-store-card -->", "<!-- TODO opening", "{#verdict}", "## FAQ {#faq}", "\n---\n", "Published:", "{#when-tested}", "Questions or corrections:"];
  let at = -1;
  for (const marker of order) {
    const next = body.indexOf(marker, at + 1);
    assert.ok(next > at, `${marker} out of order or missing`);
    at = next;
  }
  // Filled in and published, the skeleton passes the structure check; its TODOs still block it.
  assert.deepEqual(checkTemplate(FILE, { ...good, draft: false }, body), []);
  assert.ok(checkPost(FILE, body, false).errors.length > 0);
});

test("the template only uses known frontmatter keys (app_store comes with the app store card)", () => {
  const unknown = frontmatterKeys(raw).filter((key) => !FRONTMATTER_KEYS.has(key) && key !== "app_store");
  assert.deepEqual(unknown, []);
});
