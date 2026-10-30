// Unit tests for the Markdown blog pipeline (_config/blog.js, _config/markdown.js).
// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CTA, checkFrontmatter, checkPost, frontmatterKeys, indexCards, jsonLd, jsonLdBlocks, llmsLines, postData,
  sitemapEntries, sortPosts,
} from "../_config/blog.js";
import { IMG_CLASS, PHONE_FIGURE_CLASS, PHONE_SIZES, markdown } from "../_config/markdown.js";

const FILE = "blog/x/index.md";
const errorsOf = (body, draft = false) => checkPost(FILE, body, draft).errors;
const warningsOf = (body, draft = false) => checkPost(FILE, body, draft).warnings;

// ------------------------------------------------------------------ markers

test("[TODO] and [DRAFT] markers fail a non-draft, with or without a note", () => {
  for (const marker of ["[TODO]", "[DRAFT]", "[TODO: check this]", "[DRAFT:rewrite]"]) {
    assert.equal(errorsOf(`Some text ${marker} here.\n`).length, 1, marker);
  }
});

test("ordinary bracketed text passes: [Draft your plan], lowercase, no colon", () => {
  for (const text of ["[Draft your plan]", "[todo]", "[draft]", "[TODO list]", "[DRAFTS]", "[ TODO ]", "a [Draft your plan](https://x.y) link"]) {
    assert.deepEqual(errorsOf(`Text ${text} here.\n`), [], text);
  }
});

test("TODO comments fail in any case and across lines", () => {
  assert.equal(errorsOf("Para.\n\n<!-- TODO: link -->\n").length, 1);
  assert.equal(errorsOf("Para <!-- todo inline --> more.\n").length, 1);
  assert.equal(errorsOf("<!--\n  Todo: spans\n  lines\n-->\n").length, 1);
  assert.deepEqual(errorsOf("<!-- a normal comment -->\n"), []);
});

test("markers inside code fences, indented code and code spans are ignored", () => {
  const body = [
    "Intro.",
    "",
    "```html",
    "<!-- TODO: sample -->",
    "<p>[TODO] [DRAFT: x]</p>",
    "```",
    "",
    "    [TODO] indented code",
    "",
    "Inline `[TODO]` and `<!-- TODO -->` and `[CONFIRM]`.",
    "",
  ].join("\n");
  assert.deepEqual(errorsOf(body), []);
  assert.deepEqual(warningsOf(body), []);
});

test("errors carry the source line, offset by the frontmatter", () => {
  const body = "One.\n\nTwo\nthree [TODO: here].\n";
  assert.deepEqual(checkPost(FILE, body, false, 10).errors, [`${FILE}:14: [TODO: here]`]);
  assert.deepEqual(checkPost(FILE, "a\n\n<!--\nTODO\n-->\n", false).errors, [`${FILE}:3: <!-- TODO -->`]);
});

test("[CONFIRM] only warns; drafts may hold any marker", () => {
  assert.deepEqual(errorsOf("Check <mark>[CONFIRM: fact]</mark>.\n"), []);
  assert.equal(warningsOf("Check <mark>[CONFIRM: fact]</mark>.\n").length, 1);
  assert.deepEqual(errorsOf("[TODO] [DRAFT] <!-- TODO -->\n", true), []);
});

// ------------------------------------------------------------------ rendering

test("TODO comments are stripped from output, but not from code", () => {
  const html = markdown().render("A <!-- TODO x --> b\n\n<!--\ntodo\n-->\n\n`<!-- TODO keep -->`\n\n```\n<!-- TODO fence -->\n```\n");
  assert.doesNotMatch(html, /<!--/);
  assert.match(html, /&lt;!-- TODO keep --&gt;/);
  assert.match(html, /&lt;!-- TODO fence --&gt;/);
});

test("images render as figures; custom classes add to the defaults", () => {
  const html = markdown().render('![Alt](./a.png "Cap"){.shot}\n');
  assert.match(html, /^<figure class="m-0"><img /);
  assert.match(html, new RegExp(`class="${IMG_CLASS} shot"`));
  assert.match(html, /<figcaption [^>]*>Cap<\/figcaption><\/figure>/);
  assert.doesNotMatch(html, /sizes=/);
});

test("{.phone} makes a narrow phone-screenshot figure with matching sizes", () => {
  const html = markdown().render("![Phone](./p.png){.phone}\n");
  assert.ok(html.startsWith(`<figure class="${PHONE_FIGURE_CLASS}">`), html);
  assert.match(html, new RegExp(`class="${IMG_CLASS}"`));
  assert.ok(html.includes(`sizes="${PHONE_SIZES}"`));
  assert.doesNotMatch(html, /\bphone\b"/);
});

// ------------------------------------------------------------------ frontmatter

const data = (extra = {}) => ({
  page: { inputPath: "./blog/my-post/index.md" },
  title: "My post",
  description: "What it is about.",
  published: new Date("2026-05-01"),
  ...extra,
});

test("postData: defaults", () => {
  const p = postData(data());
  assert.equal(p.slug, "my-post");
  assert.equal(p.url, "https://progressphotos.app/blog/my-post/");
  assert.equal(p.published, "2026-05-01");
  assert.equal(p.seoTitle, "My post — Recomp");
  assert.equal(p.cardBlurb, "What it is about.");
  assert.equal(p.llmsBlurb, "What it is about.");
  assert.equal(p.summaryHeading, "Summary");
  assert.equal(p.draft, false);
  assert.equal(p.noindex, false);
  assert.equal(p.listed, true);
  assert.deepEqual(p.cta, DEFAULT_CTA);
  assert.match(p.ogImage, /^https:\/\/progressphotos\.app\/assets\//);
});

test("postData: the default CTA states the privacy line verbatim", () => {
  assert.ok(DEFAULT_CTA.text.endsWith(
    "Recomp never uploads your photos. It sends anonymous usage analytics and crash reports, with no account and no tracking.",
  ));
});

test("postData: cta override and cta: false", () => {
  assert.deepEqual(postData(data({ cta: { heading: "H" } })).cta, { ...DEFAULT_CTA, heading: "H" });
  assert.equal(postData(data({ cta: false })).cta, null);
});

test("postData: og_image resolution", () => {
  const local = postData(data({ og_image: "./hero.png" }));
  assert.equal(local.ogSource, "./hero.png");
  assert.equal(local.ogImage, "https://progressphotos.app/blog/my-post/hero-og.webp");
  assert.equal(postData(data({ og_image: "/assets/x.webp" })).ogImage, "https://progressphotos.app/assets/x.webp");
  assert.equal(postData(data({ og_image: "https://cdn.example/x.png" })).ogImage, "https://cdn.example/x.png");
});

test("postData: drafts and noindex are built but not listed", () => {
  const draft = postData(data({ draft: true, published: undefined }));
  assert.deepEqual([draft.draft, draft.noindex, draft.listed], [true, true, false]);
  const hidden = postData(data({ noindex: true }));
  assert.deepEqual([hidden.draft, hidden.noindex, hidden.listed], [false, true, false]);
});

test("postData: optional knobs for converted posts default to the generated output", () => {
  const p = postData(data());
  assert.equal(p.ogTitle, "My post");
  assert.equal(p.ogDescription, "What it is about.");
  assert.equal(p.ogImageAlt, null);
  assert.deepEqual([p.twitterText, p.articleDates, p.proseWrapper, p.handListed], [true, true, true, false]);
  assert.equal(p.byline, null);
  assert.equal(p.jsonLdOverride, null);
  assert.deepEqual(jsonLdBlocks(p), [jsonLd(p)]);
});

test("postData: optional knobs override", () => {
  const p = postData(data({
    og_title: "OG", og_description: "OG desc", og_image_alt: "Alt", twitter_text: false, article_dates: false,
    byline: "Published Oct 30, 2026.", prose_wrapper: false, hand_listed: true,
  }));
  assert.deepEqual(
    [p.ogTitle, p.ogDescription, p.ogImageAlt, p.twitterText, p.articleDates, p.byline, p.proseWrapper, p.handListed],
    ["OG", "OG desc", "Alt", false, false, "Published Oct 30, 2026.", false, true],
  );
  assert.equal(postData(data({ byline: false })).byline, false);
});

test("jsonLdBlocks: json_ld is used as-is, one block per item, with </ escaped", () => {
  const one = { "@context": "https://schema.org", "@type": "Article", headline: "a </script> b" };
  const two = { "@type": "FAQPage", mainEntity: [] };
  const single = jsonLdBlocks(postData(data({ json_ld: one })));
  assert.equal(single.length, 1);
  assert.deepEqual(JSON.parse(single[0]), one);
  assert.ok(!single[0].includes("</script>"));
  const list = jsonLdBlocks(postData(data({ json_ld: [one, two] })));
  assert.deepEqual(list.map((b) => JSON.parse(b)), [one, two]);
});

test("optional knobs are type-checked", () => {
  assert.match(checkFrontmatter(FILE, RAW, { twitter_text: "no" }, () => true)[0], /twitter_text must be true or false/);
  assert.match(checkFrontmatter(FILE, RAW, { hand_listed: 1 }, () => true)[0], /hand_listed must be true or false/);
  assert.match(checkFrontmatter(FILE, RAW, { byline: true }, () => true)[0], /byline must be text or false/);
  assert.match(checkFrontmatter(FILE, RAW, { json_ld: "x" }, () => true)[0], /json_ld must be/);
  assert.deepEqual(checkFrontmatter(FILE, RAW, { byline: false, json_ld: [{}], prose_wrapper: false }, () => true), []);
});

test("postData: required fields", () => {
  assert.throws(() => postData(data({ published: undefined })), /missing "published"/);
  assert.throws(() => postData(data({ title: "" })), /missing "title"/);
  assert.throws(() => postData(data({ description: undefined })), /missing "description"/);
});

const RAW = `---
title: T  # comment
description: >
  folded: not a key
cta:
  heading: H
faq:
  - q: a
    a: b
---
Body
`;

test("frontmatterKeys reads top-level keys only", () => {
  assert.deepEqual(frontmatterKeys(RAW), ["title", "description", "cta", "faq"]);
});

test("unknown frontmatter keys fail", () => {
  const raw = RAW.replace("title:", "titel:");
  const errors = checkFrontmatter(FILE, raw, {}, () => true);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /unknown frontmatter key "titel"/);
  assert.deepEqual(checkFrontmatter(FILE, RAW, { cta: { heading: "H" } }, () => true), []);
  assert.match(checkFrontmatter(FILE, RAW, { cta: { heading: "H", txt: "x" } }, () => true)[0], /unknown cta key "txt"/);
});

test("a co-located og_image must exist", () => {
  assert.match(checkFrontmatter(FILE, RAW, { og_image: "./missing.png" }, () => false)[0], /og_image \.\/missing\.png not found/);
  assert.deepEqual(checkFrontmatter(FILE, RAW, { og_image: "./hero.png" }, () => true), []);
  assert.deepEqual(checkFrontmatter(FILE, RAW, { og_image: "/assets/x.webp" }, () => false), []);
});

// ------------------------------------------------------------------ lists

const post = (slug, published, extra = {}) =>
  postData(data({ page: { inputPath: `./blog/${slug}/index.md` }, title: slug, published, ...extra }));

test("sortPosts: newest first, then slug; lists skip unlisted posts", () => {
  const posts = [
    post("b-old", new Date("2026-01-01")),
    post("z-new", new Date("2026-06-01")),
    post("a-new", new Date("2026-06-01")),
    post("draft", undefined, { draft: true }),
  ];
  const sorted = sortPosts(posts);
  assert.deepEqual(sorted.map((p) => p.slug), ["a-new", "z-new", "b-old", "draft"]);
  assert.deepEqual([...indexCards(sorted).matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ["a-new/", "z-new/", "b-old/"]);
  assert.equal(llmsLines(sorted).trim().split("\n").length, 3);
  assert.deepEqual(posts.map((p) => p.slug), ["b-old", "z-new", "a-new", "draft"], "input not mutated");
});

test("hand_listed posts are built but left out of /blog/ cards, llms.txt and the sitemap", () => {
  const posts = sortPosts([post("auto", new Date("2026-06-01")), post("by-hand", new Date("2026-07-01"), { hand_listed: true })]);
  assert.deepEqual([...indexCards(posts).matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ["auto/"]);
  assert.equal(llmsLines(posts).trim().split("\n").length, 1);
  assert.ok(!sitemapEntries(posts).includes("by-hand"));
  assert.ok(sitemapEntries(posts).includes("/blog/auto/"));
});
