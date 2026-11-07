// Tests for the review scorecard, the "How I tested" line, the Review JSON-LD and the
// live-link check (SPEC section 8). Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import matter from "gray-matter";
import nunjucks from "nunjucks";
import { checkFrontmatter, checkTemplate, jsonLd, jsonLdBlocks, postData } from "../_config/blog.js";
import { markdown } from "../_config/markdown.js";
import { checkInternalLinks, internalLinks } from "../_config/links.js";
import { SCORECARD_GROUPS, SCORECARD_IDS, checkHowTested, checkScorecard, howTestedData, scorecardData } from "../_config/scorecard.js";

const FILE = "blog/x/index.md";
const FIXTURE = "tests/fixtures/blog/example-review/index.md";
const fixture = matter(readFileSync(FIXTURE, "utf8"));
const RAW = readFileSync(FIXTURE, "utf8");

const allRows = (status = "has") =>
  Object.fromEntries(SCORECARD_IDS.map((id) => [id, status === "confirm" ? { status, fact: "[CONFIRM]" } : { status, fact: "A plain fact" }]));

// ------------------------------------------------------------------ 1. checkScorecard

test("checkScorecard: 35 valid rows pass; unknown, missing and bad rows fail", () => {
  assert.equal(SCORECARD_IDS.length, 35);
  assert.deepEqual(checkScorecard(FILE, allRows()), []);
  assert.deepEqual(checkScorecard(FILE, allRows("confirm")), []);
  assert.deepEqual(checkScorecard(FILE, undefined), []);
  const fails = (rows, pattern) => {
    const errors = checkScorecard(FILE, rows);
    assert.equal(errors.length, 1, `${pattern}: ${errors.join(" | ")}`);
    assert.match(errors[0], pattern);
  };
  fails({ ...allRows(), stars: { status: "has", fact: "x" } }, /unknown scorecard id "stars"/);
  const missing = allRows();
  delete missing.auto_align;
  fails(missing, /scorecard\.auto_align is required/);
  fails({ ...allRows(), auto_align: { status: "yes", fact: "x" } }, /status must be/);
  fails({ ...allRows(), auto_align: { status: "confirm", fact: "Has auto-align" } }, /fact must be "\[CONFIRM\]"/);
  fails({ ...allRows(), auto_align: { status: "has", fact: "[CONFIRM]" } }, /marker in a non-confirm fact/);
  fails({ ...allRows(), auto_align: { status: "has", fact: "Aligns faces \u2014 fast" } }, /em dash/);
  assert.match(checkScorecard(FILE, ["has"])[0], /must be a mapping/);
});

// ------------------------------------------------------------------ 2. scorecardData

test("scorecardData: drafts keep confirm rows; published pages drop them and count them", () => {
  const raw = { ...allRows("missing"), auto_align: { status: "confirm", fact: "[CONFIRM]" } };
  const draft = scorecardData(raw, { draft: true });
  assert.equal(draft.groups.flatMap((g) => g.rows).length, 35);
  assert.equal(draft.hidden, 0);
  assert.equal(draft.confirm, 1);
  const live = scorecardData(raw, { draft: false });
  assert.equal(live.groups.flatMap((g) => g.rows).length, 34);
  assert.equal(live.hidden, 1);
  assert.equal(live.groups[0].rows[0].statusLabel, "No");
});

test("scorecardData: a group with only confirm rows disappears on a published page", () => {
  const raw = allRows("has");
  const photos = SCORECARD_GROUPS.find((g) => g.id === "photos");
  for (const r of photos.rows) raw[r.id] = { status: "confirm", fact: "[CONFIRM]" };
  assert.ok(scorecardData(raw, { draft: true }).groups.some((g) => g.id === "photos"));
  assert.ok(!scorecardData(raw, { draft: false }).groups.some((g) => g.id === "photos"));
  assert.equal(scorecardData(undefined, { draft: false }), null);
});

test("scorecard omit drops only the listed rows; a missing row is still required", () => {
  const full = allRows("missing");
  full.auto_align = { status: "confirm", fact: "[CONFIRM]" };
  const fullRows = scorecardData(full, { draft: true }).groups.flatMap((g) => g.rows);
  assert.equal(fullRows.length, 35);

  const omitted = { ...full, omit: ["originals_untouched", "partial_checkin"] };
  delete omitted.originals_untouched;
  delete omitted.partial_checkin;
  assert.deepEqual(checkScorecard(FILE, omitted), []);
  const draft = scorecardData(omitted, { draft: true });
  const rows = draft.groups.flatMap((g) => g.rows);
  assert.deepEqual(
    rows.map((r) => r.id),
    fullRows.map((r) => r.id).filter((id) => id !== "originals_untouched" && id !== "partial_checkin"),
  );
  for (const row of rows) assert.deepEqual(row, fullRows.find((r) => r.id === row.id));
  assert.equal(draft.confirm, 1);
  assert.equal(draft.hidden, 0);
  const live = scorecardData(omitted, { draft: false });
  assert.equal(live.groups.flatMap((g) => g.rows).length, 32);
  assert.equal(live.hidden, 1);
  assert.equal(live.confirm, 1);
  assert.ok(live.groups.some((g) => g.id === "qol"));

  const noPhotos = { ...allRows("has"), omit: ["photo_focus"] };
  delete noPhotos.photo_focus;
  const dropped = scorecardData(noPhotos, { draft: true });
  assert.ok(!dropped.groups.some((g) => g.id === "photos"));
  assert.equal(dropped.groups.flatMap((g) => g.rows).length, 34);

  const stillRequired = { ...full, omit: ["originals_untouched"] };
  delete stillRequired.originals_untouched;
  delete stillRequired.partial_checkin;
  assert.match(checkScorecard(FILE, stillRequired).join("\n"), /scorecard\.partial_checkin is required/);
  assert.match(checkScorecard(FILE, { ...allRows(), omit: ["stars"] }).join("\n"), /scorecard\.omit has unknown id "stars"/);
  assert.match(checkScorecard(FILE, { ...allRows(), omit: ["auto_align"] }).join("\n"), /scorecard\.auto_align is set and also omitted/);
  const notAList = allRows();
  delete notAList.photo_focus;
  notAList.omit = "photo_focus";
  const notAListErrors = checkScorecard(FILE, notAList).join("\n");
  assert.match(notAListErrors, /scorecard\.omit must be a list/);
  assert.match(notAListErrors, /scorecard\.photo_focus is required/);

  // Eleventy's computed-data proxy returns array methods from an empty target.
  // Index reads still see the real ids. `.filter` on that proxy would not.
  const proxiedOmit = new Proxy(new Array(omitted.omit.length), {
    get(target, key) {
      if (Array.prototype.hasOwnProperty(key)) return target[key];
      return omitted.omit[key];
    },
  });
  const proxied = new Proxy(omitted, {
    get(target, key) {
      if (key === "omit") return proxiedOmit;
      return target[key];
    },
  });
  assert.deepEqual(proxiedOmit.filter(() => true), []);
  const viaProxy = scorecardData(proxied, { draft: true }).groups.flatMap((g) => g.rows);
  assert.deepEqual(viaProxy.map((r) => r.id), rows.map((r) => r.id));
  assert.equal(viaProxy.find((r) => r.id === "auto_align").status, "confirm");
});

// ------------------------------------------------------------------ 3. app_store.price

const APP = {
  id: 1, name: "App - Tracker", developer: "Dev", developer_url: "https://dev.example", rating: 4.7, rating_count: 10, min_ios: "18.0",
  url: "https://apps.apple.com/us/app/x/id1", icon: "/assets/app-icons/x.webp", checked: new Date("2026-11-01"), price: "0",
};
const priceErrors = (price) => checkFrontmatter(FILE, "---\napp_store:\n---\n", { app_store: { ...APP, price } }, () => true);

test("app_store.price: required, a plain number", () => {
  for (const ok of ["4.99", "0", 0]) assert.deepEqual(priceErrors(ok), [], String(ok));
  for (const bad of ["$4.99", "free", "[CONFIRM]", "4.999"]) assert.match(priceErrors(bad).join(" "), /price must be a plain number/, bad);
  const noPrice = { ...APP };
  delete noPrice.price;
  assert.match(checkFrontmatter(FILE, "", { app_store: noPrice }, () => true).join(" "), /app_store\.price is required/);
});

// ------------------------------------------------------------------ 4. how_tested / measurements

test("how_tested and measurements: unknown keys, bad dates and estimates fail", () => {
  const how = { device: "iPhone", ios: "26.1", app_version: "1.0", started: "2026-10-01", ended: "2026-10-20", checkins: "6" };
  assert.deepEqual(checkHowTested(FILE, how, { taps_per_checkin: "5", seconds_per_checkin: "" }), []);
  assert.match(checkHowTested(FILE, { ...how, phone: "x" }, undefined)[0], /unknown how_tested key "phone"/);
  assert.match(checkHowTested(FILE, how, { seconds: "30" })[0], /unknown measurements key "seconds"/);
  assert.match(checkHowTested(FILE, how, { seconds_per_checkin: "about 30" })[0], /never a range or "about"/);
  assert.match(checkHowTested(FILE, how, { seconds_per_checkin: "20-30" })[0], /never a range/);
  assert.match(checkHowTested(FILE, { ...how, started: "Oct 1" }, undefined)[0], /YYYY-MM-DD/);
  assert.match(checkHowTested(FILE, { ...how, ended: "2026-09-01" }, undefined)[0], /before/);
});

test("howTestedData: parts in order, [CONFIRM] while a required field is empty", () => {
  const full = howTestedData(
    { device: "iPhone 15", ios: "26.1", app_version: "3.2", started: "2026-10-01", ended: "2026-10-20", checkins: "6" },
    { taps_per_checkin: "5", seconds_per_checkin: "40", import_photo_count: "100", import_seconds: "12" },
    "Hevy",
  );
  assert.deepEqual(full.parts, ["iPhone 15", "iOS 26.1", "Hevy 3.2", "Oct 1 to Oct 20, 2026", "6 check-ins", "a check-in took 5 taps and 40 seconds", "importing 100 photos took 12 seconds"]);
  assert.equal(full.confirm, false);
  const empty = howTestedData({ device: "", ios: "", app_version: "", started: "", ended: "", checkins: "" }, {}, "Hevy");
  assert.deepEqual(empty.parts, []);
  assert.equal(empty.confirm, true);
});

// ------------------------------------------------------------------ 5. checkTemplate

test("checkTemplate: a published review needs a scorecard and how_tested.device", () => {
  const body = "**Full disclosure: I build Recomp.**\n\n## Verdict {#verdict}\n";
  const how = { device: "iPhone", ios: "26.1", app_version: "1.0", started: "2026-10-01", ended: "2026-10-20" };
  const good = { template: "app-review", summary: "S.", app_store: APP, scorecard: allRows(), published: new Date("2026-11-01"), how_tested: how };
  assert.deepEqual(checkTemplate(FILE, good, body), []);
  assert.match(checkTemplate(FILE, { ...good, scorecard: undefined }, body).join(" "), /scorecard/);
  assert.match(checkTemplate(FILE, { ...good, how_tested: { ...how, device: "" } }, body).join(" "), /how_tested\.device/);
});

// ------------------------------------------------------------------ 6. JSON-LD

const post = postData({ ...fixture.data, page: { inputPath: "./blog/example-review/index.md" } });

/** Port of /workspace/scorecard/jsonld/validate.py (the rules a review's JSON-LD must meet). */
function validateReview(doc) {
  const errors = [];
  const nodes = doc["@graph"] ?? [doc];
  const text = JSON.stringify(doc);
  const reviews = nodes.filter((n) => n["@type"] === "Review");
  if (reviews.length !== 1) return [`expected one Review, got ${reviews.length}`];
  const r = reviews[0];
  for (const key of ["itemReviewed", "author", "datePublished", "dateModified", "url", "publisher"]) if (!r[key]) errors.push(`Review.${key} missing`);
  if (r.datePublished && r.dateModified && r.dateModified < r.datePublished) errors.push("dateModified before datePublished");
  if (r.author?.["@type"] !== "Person" || !String(r.author?.["@id"]).endsWith("/about/#mark") || !r.author?.name || !String(r.author?.url).endsWith("/about/")) errors.push("author must be Person #mark");
  const app = r.itemReviewed ?? {};
  if (app["@type"] !== "SoftwareApplication") errors.push("itemReviewed must be a SoftwareApplication");
  if (!app.name) errors.push("app name missing");
  if (!/iOS/.test(app.operatingSystem ?? "")) errors.push("operatingSystem must name iOS");
  if (!["HealthApplication", "MultimediaApplication", "LifestyleApplication"].includes(app.applicationCategory)) errors.push("applicationCategory not in Google's list");
  if (!app.author?.name || !app.publisher?.name) errors.push("app author and publisher need names");
  if (app.offers && (!/^\d+(\.\d{1,2})?$/.test(String(app.offers.price)) || !/^[A-Z]{3}$/.test(app.offers.priceCurrency ?? ""))) errors.push("Offer price or currency");
  if (/"(reviewRating|aggregateRating)"/.test(text)) errors.push("has a rating");
  if (text.includes("\u2014")) errors.push("has an em dash");
  if (/\[(CONFIRM|TODO)/.test(text)) errors.push("has a [CONFIRM] or [TODO]");
  return errors;
}

test("jsonLd: an app review is one @graph of BlogPosting, Review and FAQPage, with no ratings", () => {
  const doc = JSON.parse(jsonLd(post));
  const graph = doc["@graph"];
  assert.deepEqual(graph.map((n) => n["@type"]), ["BlogPosting", "Review", "FAQPage"]);
  assert.deepEqual(validateReview(doc), []);
  const review = graph[1];
  assert.equal(review.author["@id"], "https://progressphotos.app/about/#mark");
  assert.equal(review.itemReviewed.offers.price, fixture.data.app_store.price);
  assert.equal(review.itemReviewed["@id"], graph[0].about["@id"]);
  assert.equal(review.reviewBody, "An example summary with Markdown, used as the Review's reviewBody.");
});

test("jsonLd: the validator port catches ratings, [CONFIRM] and a missing dateModified", () => {
  const doc = JSON.parse(jsonLd(post));
  doc["@graph"][1].reviewRating = { "@type": "Rating", ratingValue: 4 };
  doc["@graph"][1].itemReviewed.offers.price = "[CONFIRM]";
  delete doc["@graph"][1].dateModified;
  assert.equal(validateReview(doc).length, 4);
});

test("jsonLd: no Review node without app_store", () => {
  const data = { ...fixture.data, page: { inputPath: "./blog/example-review/index.md" } };
  delete data.app_store;
  const doc = JSON.parse(jsonLd(postData(data)));
  const types = (doc["@graph"] ?? (Array.isArray(doc) ? doc : [doc])).map((n) => n["@type"]);
  assert.ok(!types.includes("Review"));
  assert.ok(types.includes("BlogPosting"));
});

test("json_ld overrides: a Person author needs @id #mark", () => {
  const person = { "@type": "Person", name: "Mark Stepchin", url: "https://progressphotos.app/about/" };
  const errorsFor = (author) => checkFrontmatter(FILE, "", { json_ld: [{ "@type": "Article", author }] }, () => true);
  assert.match(errorsFor(person).join(" "), /needs "@id"/);
  assert.deepEqual(errorsFor({ ...person, "@id": "https://progressphotos.app/about/#mark" }), []);
});

// ------------------------------------------------------------------ 7. rendered HTML

function render(p, content) {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader("_includes"), { autoescape: true });
  const md = markdown();
  env.addFilter("md", (t) => md.render(String(t)).trim());
  env.addFilter("mdInline", (t) => md.renderInline(String(t)).trim());
  env.addFilter("jsonLdBlocks", (x) => jsonLdBlocks(x));
  env.addExtension("ogImage", {
    tags: ["ogImage"],
    parse(parser, nodes) {
      const tok = parser.nextToken();
      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);
      return new nodes.CallExtension(this, "run", args);
    },
    run: () => "https://progressphotos.app/og.png",
  });
  return env.render("post.njk", { post: p, content });
}

test("rendered review: table semantics, decorative icons, byline dates match the JSON-LD", () => {
  const html = render(post, "<p>Body.</p>\n<!-- scorecard -->\n");
  const table = html.slice(html.indexOf("<table"), html.indexOf("</table>"));
  assert.match(table, /<caption id="scorecard-caption"/);
  assert.equal((table.match(/<th scope="col"/g) ?? []).length, 2);
  assert.equal((table.match(/<th scope="rowgroup"/g) ?? []).length, post.scorecard.groups.length);
  assert.equal((table.match(/<th scope="row"/g) ?? []).length, 35);
  const svgs = table.match(/<svg[^>]*>/g) ?? [];
  assert.equal(svgs.length, 35);
  for (const svg of svgs) assert.match(svg, /aria-hidden="true"/);
  for (const status of ["has", "partial", "missing", "confirm"]) assert.match(table, new RegExp(`data-status="${status}"`));
  assert.ok(!/display:\s*(block|grid)/.test(table));
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const review = ld["@graph"].find((n) => n["@type"] === "Review");
  assert.match(html, new RegExp(`Published <time datetime="${review.datePublished}">`));
  assert.match(html, new RegExp(`Updated <time datetime="${review.dateModified}">`));
  assert.match(html, /id="how-i-tested"[\s\S]*?\[CONFIRM: device, iOS, app version, test dates\][\s\S]*?href="\/blog\/how-i-test-progress-photo-apps\/"/);
});

test("rendered review: omitted rows are absent and a complete review still has every row", () => {
  const data = { ...fixture.data, page: { inputPath: "./blog/example-review/index.md" } };
  const scorecard = { ...data.scorecard, omit: ["originals_untouched", "partial_checkin"] };
  delete scorecard.originals_untouched;
  delete scorecard.partial_checkin;
  const html = render(postData({ ...data, scorecard }), "<p>Body.</p>\n<!-- scorecard -->\n");
  const table = html.slice(html.indexOf("<table"), html.indexOf("</table>"));
  assert.equal((table.match(/<th scope="row"/g) ?? []).length, 33);
  assert.equal((table.match(/<svg[^>]*>/g) ?? []).length, 33);
  assert.ok(!table.includes("Leaves originals untouched in Photos"));
  assert.ok(!table.includes("Save a partial check-in"));
  assert.ok(!table.includes('id="sc-originals-untouched"'));
  assert.ok(!table.includes('id="sc-partial-checkin"'));
  assert.match(table, /id="sc-edit-date"/);
  assert.match(table, /id="sc-dark-mode"/);
  assert.match(table, /data-status="has"/);

  for (const file of ["blog/macrofactor-review/index.md", "blog/myfitnesspal-review/index.md"]) {
    const parsed = matter(readFileSync(file, "utf8"));
    assert.deepEqual(checkFrontmatter(file, readFileSync(file, "utf8"), parsed.data, () => true), [], file);
    const other = postData({ ...parsed.data, page: { inputPath: `./${file}` } });
    assert.deepEqual(other.scorecard.groups.flatMap((g) => g.rows).map((r) => r.id), SCORECARD_IDS, file);
    const otherHtml = render(other, "<p>Body.</p>\n<!-- scorecard -->\n");
    const otherTable = otherHtml.slice(otherHtml.indexOf("<table"), otherHtml.indexOf("</table>"));
    assert.equal((otherTable.match(/<th scope="row"/g) ?? []).length, 35, file);
    assert.match(otherTable, /Leaves originals untouched in Photos/);
    assert.match(otherTable, /Save a partial check-in/);
  }
});

const HEVY = "blog/hevy-review/index.md";
const HEVY_FACTS = {
  checkin_time: ["has", "Under a minute and a few taps"],
  weight_apple_health: ["has", "Weight from Apple Health"],
  align_in_compare: ["missing", "No alignment in the side-by-side view"],
  compare_speed: ["has", "Switch between several dates quickly"],
  compare_scale: ["missing", "Not confirmed"],
  bulk_import: ["missing", "No bulk import"],
  units: ["has", "Metric and imperial"],
  no_ads: ["has", "No ads"],
  edit_date: ["missing", "Can't edit a saved check-in's date"],
};

test("Hevy omits two rows, keeps the approved statuses, and has no separate verdict", () => {
  const raw = readFileSync(HEVY, "utf8");
  const parsed = matter(raw);
  assert.deepEqual(parsed.data.scorecard.omit, ["originals_untouched", "partial_checkin"]);
  assert.equal(parsed.data.scorecard.originals_untouched, undefined);
  assert.equal(parsed.data.scorecard.partial_checkin, undefined);
  assert.deepEqual(checkFrontmatter(HEVY, raw, parsed.data, () => true), []);
  const post = postData({ ...parsed.data, page: { inputPath: `./${HEVY}` } });
  const rows = post.scorecard.groups.flatMap((g) => g.rows);
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
  assert.deepEqual(rows.map((r) => r.id), SCORECARD_IDS.filter((id) => id !== "originals_untouched" && id !== "partial_checkin"));
  for (const [id, [status, fact]] of Object.entries(HEVY_FACTS)) {
    assert.equal(byId[id].status, status, id);
    assert.equal(byId[id].fact, fact, id);
  }
  assert.equal(byId.weight_quick_entry.status, "missing");
  assert.equal(byId.weight_quick_entry.fact, "Every weigh-in is typed in by hand");
  const html = render(post, "<p>Body.</p>\n<!-- scorecard -->\n");
  const table = html.slice(html.indexOf("<table"), html.indexOf("</table>"));
  assert.equal((table.match(/<th scope="row"/g) ?? []).length, 33);
  assert.ok(!table.includes("Leaves originals untouched"));
  assert.ok(!table.includes("Save a partial check-in"));
  assert.ok(!table.includes('id="sc-originals-untouched"'));
  assert.ok(!table.includes('id="sc-partial-checkin"'));
  assert.match(table, /No alignment in the side-by-side view/);
  assert.match(table, /Can&#39;t edit a saved check-in&#39;s date/);
  assert.match(table, /data-status="missing"/);
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
  assert.match(body, /## Built for workouts, not photos \{#design-tradeoffs\}/);
  assert.ok(!body.includes("{#verdict}"));
  assert.ok(!body.includes("My verdict on Hevy"));
  assert.match(body, /## FAQ \{#faq\}/);
  assert.match(body, /TODO\(feature-link\): link "auto-align"/);
  assert.match(body, /TODO\(feature-link\): link "timelapse"/);
});

test("rendered review: the scorecard goes at the marker, or after the body before the CTA", () => {
  const atMarker = render(post, "<p>Before.</p>\n<!-- scorecard -->\n<p>After.</p>");
  assert.ok(atMarker.indexOf("Before.") < atMarker.indexOf("scorecard-heading"));
  assert.ok(atMarker.indexOf("scorecard-heading") < atMarker.indexOf("After."));
  const noMarker = render(post, "<p>Body.</p>");
  assert.ok(noMarker.indexOf("Body.") < noMarker.indexOf("scorecard-heading"));
  assert.ok(noMarker.indexOf("scorecard-heading") < noMarker.indexOf("article-cta-heading"));
  const published = postData({ ...fixture.data, draft: false, page: { inputPath: "./blog/example-review/index.md" } });
  const live = render(published, "<p>Body.</p>");
  assert.ok(!live.includes('data-status="confirm"'));
  assert.match(live, /Rows I haven't checked yet are left out\./);
});

// ------------------------------------------------------------------ 8. live links

test("checkInternalLinks: a published page linking a draft or a missing page fails; drafts only warn", () => {
  const exists = (path) => ["/blog/live/", "/about/", "/assets/x.png"].includes(path);
  const pages = [
    { url: "/blog/live/", draft: false, html: '<a href="/blog/draft/">d</a> <a href="../../about/">a</a> <a href="/blog/gone/">g</a> <!-- <a href="/blog/draft/">later</a> --> <a href="#faq">f</a> <a href="https://example.com/">e</a>' },
    { url: "/blog/draft/", draft: true, html: '<a href="/blog/gone/">g</a>' },
  ];
  const { errors, warnings } = checkInternalLinks(pages, exists, ["/blog/draft/"]);
  assert.deepEqual(errors, ["/blog/live/: links /blog/draft/, which is a draft", "/blog/live/: links /blog/gone/, which is not on the site"]);
  assert.deepEqual(warnings, ["/blog/draft/: links /blog/gone/, which is not on the site"]);
  assert.deepEqual(internalLinks('<a href="https://progressphotos.app/faq/">x</a>', "/blog/a/").map((l) => l.path), ["/faq/"]);
  assert.deepEqual(internalLinks('<a class="x" href="/blog/draft/" data-draft-link>d</a> <a\n  data-draft-link\n  href="/blog/gone/">g</a>', "/blog/a/"), []);
});

test("the review fixture's frontmatter passes the checks", () => {
  assert.deepEqual(checkFrontmatter(FIXTURE, RAW, fixture.data, () => true), []);
});
