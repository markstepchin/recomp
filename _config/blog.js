/**
 * Markdown blog posts: frontmatter -> page data, JSON-LD, list entries, and the build checks.
 * Used by eleventy.config.js, _includes/post.njk and _pages/*.11ty.js.
 */
import { TODO_COMMENT, markdown } from "./markdown.js";

export { TODO_COMMENT };
export const SITE_URL = "https://progressphotos.app";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/step-compare.webp?v=5`;

const AUTHOR = {
  "@type": "Person",
  "@id": `${SITE_URL}/about/#mark`,
  name: "Mark Stepchin",
  url: `${SITE_URL}/about/`,
  jobTitle: "Software engineer",
};
const PUBLISHER = { "@type": "Organization", name: "Recomp", url: `${SITE_URL}/` };

/**
 * Default end-of-article CTA. A post overrides any field with `cta:` in its frontmatter
 * (heading, text, location for data-cta-location), or hides it with `cta: false`.
 */
export const DEFAULT_CTA = {
  heading: "See the progress buried in your camera roll",
  text: "Compare progress photos on a before-and-after timeline, scroll to any date instantly, and align photos on the fly. Recomp never uploads your photos. It sends anonymous usage analytics and crash reports, with no account and no tracking.",
  location: "article_footer",
};

// ---------------------------------------------------------------- the checks

/** Visible markers that block publishing: exactly [TODO], [DRAFT], [TODO: …] or [DRAFT: …]. */
const BLOCKING_MARKER = /\[(TODO|DRAFT)(:[^\]]*)?\]/g;
/** Visible markers that only warn: [CONFIRM] or [CONFIRM: …]. */
const WARNING_MARKER = /\[CONFIRM(:[^\]]*)?\]/g;

const newlines = (text) => (text.match(/\n/g) ?? []).length;
const show = (text) => text.replace(/\s+/g, " ").slice(0, 80);

/**
 * Prose and raw HTML in a post body, from markdown-it tokens, as { text, html, line }
 * pieces (line is 0-based in the body). Code spans, fences and indented code are skipped.
 */
let parser;
function proseOf(body) {
  const pieces = [];
  let blockLine = 0;
  for (const token of (parser ??= markdown()).parse(body, {})) {
    if (token.map) blockLine = token.map[0];
    if (token.type === "html_block") pieces.push({ html: true, text: token.content, line: blockLine });
    if (token.type !== "inline") continue;
    let line = blockLine;
    for (const child of token.children ?? []) {
      if (child.type === "softbreak" || child.type === "hardbreak") line += 1;
      if (child.type === "text") pieces.push({ html: false, text: child.content, line });
      if (child.type === "html_inline") pieces.push({ html: true, text: child.content, line });
      if (child.type !== "softbreak" && child.type !== "hardbreak") line += newlines(child.content);
    }
  }
  return pieces;
}

/**
 * Check one post's Markdown body. A non-draft with a TODO comment, [TODO] or [DRAFT]
 * fails; [CONFIRM] only warns. Code is ignored. Returns { errors, warnings } as "file:line: text".
 */
export function checkPost(file, body, draft, bodyLineOffset = 0) {
  const errors = [];
  const warnings = [];
  for (const piece of proseOf(body)) {
    const at = (m) => `${file}:${piece.line + newlines(piece.text.slice(0, m.index)) + 1 + bodyLineOffset}: ${show(m[0])}`;
    if (!draft) {
      if (piece.html) for (const m of piece.text.matchAll(TODO_COMMENT)) errors.push(at(m));
      for (const m of piece.text.matchAll(BLOCKING_MARKER)) errors.push(at(m));
    }
    for (const m of piece.text.matchAll(WARNING_MARKER)) warnings.push(at(m) + (draft ? "" : " (non-draft)"));
  }
  return { errors, warnings };
}

/** Frontmatter keys a post may use. Anything else is a typo and fails the build. */
export const FRONTMATTER_KEYS = new Set([
  "title", "seo_title", "description", "published", "updated", "tested", "draft", "noindex",
  "og_image", "breadcrumb", "summary", "summary_heading", "card_blurb", "llms_blurb", "cta", "faq",
]);
const CTA_KEYS = new Set(["heading", "text", "location"]);

/** Top-level keys of a file's YAML frontmatter (comments and nested lines ignored). */
export function frontmatterKeys(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return [];
  return [...m[1].matchAll(/^([A-Za-z_][\w-]*)\s*:/gm)].map((k) => k[1]);
}

/**
 * Frontmatter checks for one post: unknown keys, cta shape, and a co-located og_image
 * that must exist. `raw` is the whole file, `data` the parsed frontmatter.
 */
export function checkFrontmatter(file, raw, data, exists) {
  const errors = [];
  for (const key of frontmatterKeys(raw)) {
    if (!FRONTMATTER_KEYS.has(key)) errors.push(`${file}: unknown frontmatter key "${key}" (allowed: ${[...FRONTMATTER_KEYS].join(", ")})`);
  }
  if (data.cta !== undefined && data.cta !== false) {
    if (typeof data.cta !== "object" || data.cta === null) errors.push(`${file}: cta must be a mapping or false`);
    else for (const key of Object.keys(data.cta)) if (!CTA_KEYS.has(key)) errors.push(`${file}: unknown cta key "${key}" (allowed: heading, text, location)`);
  }
  const og = data.og_image ? String(data.og_image) : "";
  if (og.startsWith("./") && !exists(og)) errors.push(`${file}: og_image ${og} not found next to the post`);
  return errors;
}

// ---------------------------------------------------------------- page data

export const isPostPath = (inputPath) => /(^|\/)blog\/[^/]+\/index\.md$/.test(inputPath);
export const slugOf = (inputPath) => inputPath.split("/").slice(-2, -1)[0];

const isoDate = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const d = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`date must be YYYY-MM-DD, got ${value}`);
  return d.toISOString().slice(0, 10);
};
const shortDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Normalize a post's frontmatter. `data` is the Eleventy data cascade for the page. */
export function postData(data) {
  const file = data.page.inputPath.replace(/^\.\//, "");
  for (const key of ["title", "description"]) if (!data[key]) throw new Error(`${file}: missing "${key}"`);
  const draft = data.draft === true;
  const published = isoDate(data.published);
  if (!draft && !published) throw new Error(`${file}: missing "published" (required unless draft: true)`);
  const updated = isoDate(data.updated);
  const slug = slugOf(file);
  const url = `${SITE_URL}/blog/${slug}/`;
  const og = data.og_image ? String(data.og_image) : null;
  const ogLocal = og && og.startsWith("./") ? og : null;
  return {
    file, slug, url, draft,
    noindex: draft || data.noindex === true,
    listed: !draft && data.noindex !== true,
    title: String(data.title),
    seoTitle: data.seo_title ? String(data.seo_title) : `${data.title} — Recomp`,
    description: String(data.description),
    published, updated,
    publishedShort: published ? shortDate(published) : null,
    tested: data.tested ? String(data.tested) : null,
    breadcrumb: data.breadcrumb ? String(data.breadcrumb) : null,
    summary: data.summary ? String(data.summary).trim() : null,
    summaryHeading: data.summary_heading ? String(data.summary_heading) : "Summary",
    cardBlurb: data.card_blurb ? String(data.card_blurb).trim() : String(data.description),
    llmsBlurb: data.llms_blurb ? String(data.llms_blurb).trim() : String(data.description),
    faq: Array.isArray(data.faq) ? data.faq : null,
    // Absolute URLs and /paths pass through. A co-located ./file becomes a 1200px WebP
    // named <name>-og.webp next to the post (written by the ogImage shortcode).
    ogSource: ogLocal,
    ogImage: !og
      ? DEFAULT_OG_IMAGE
      : ogLocal
        ? `${url}${ogLocal.slice(2).replace(/\.[^.]+$/, "")}-og.webp`
        : /^https?:\/\//.test(og)
          ? og
          : `${SITE_URL}/${og.replace(/^\//, "")}`,
    cta: data.cta === false ? null : { ...DEFAULT_CTA, ...(data.cta ?? {}) },
  };
}

export function jsonLd(post) {
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: AUTHOR,
    publisher: PUBLISHER,
    url: post.url,
    mainEntityOfPage: post.url,
    image: post.ogImage,
  };
  if (post.published) article.datePublished = post.published;
  if (post.updated || post.published) article.dateModified = post.updated || post.published;
  const out = !post.faq
    ? article
    : [
        article,
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map(({ q, a }) => ({
            "@type": "Question",
            name: String(q),
            acceptedAnswer: { "@type": "Answer", text: String(a) },
          })),
        },
      ];
  return JSON.stringify(out, null, 2).replace(/<\//g, "<\\/");
}

// ---------------------------------------------------------------- lists

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Newest first; drafts without a date last. */
export const sortPosts = (posts) =>
  [...posts].sort((a, b) => (b.published || "").localeCompare(a.published || "") || a.slug.localeCompare(b.slug));

/** Replace the text between `<!-- name:start -->` and `<!-- name:end -->`. */
export function replaceRegion(text, name, inner, file) {
  const re = new RegExp(`(^[ \\t]*<!-- ${name}:start -->)[\\s\\S]*?(^[ \\t]*<!-- ${name}:end -->)`, "m");
  if (!re.test(text)) throw new Error(`${file}: missing <!-- ${name}:start --> / <!-- ${name}:end --> markers`);
  return text.replace(re, (_, start, end) => `${start}\n${inner}${end}`);
}

export const sitemapEntries = (posts) =>
  posts
    .filter((p) => !p.noindex)
    .map((p) => {
      const lastmod = p.updated || p.published;
      return `  <url>\n    <loc>${p.url}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>\n`;
    })
    .join("");

export const indexCards = (posts) =>
  posts
    .filter((p) => p.listed)
    .map((p) =>
      [
        "            <article",
        '              class="rounded-card border border-card-border bg-card px-[1.4rem] py-[1.35rem]"',
        "            >",
        `              <p class="text-micro text-muted">${longDate(p.published)}</p>`,
        '              <h3 class="text-h3 font-bold tracking-h3 pt-2">',
        "                <a",
        '                  class="text-fg no-underline hover:underline focus-visible:underline"',
        `                  href="${p.slug}/"`,
        `                  >${escapeHtml(p.title)}</a`,
        "                >",
        "              </h3>",
        `              <p class="text-muted pt-2">${escapeHtml(p.cardBlurb)}</p>`,
        "            </article>",
        "",
      ].join("\n"),
    )
    .join("");

export const llmsLines = (posts) =>
  posts
    .filter((p) => p.listed)
    .map((p) => `- [${p.title}](${p.url}): ${p.llmsBlurb.replace(/\s+/g, " ")}\n`)
    .join("");
