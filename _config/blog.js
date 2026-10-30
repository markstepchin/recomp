/**
 * Markdown blog posts: frontmatter -> page data, JSON-LD, list entries, and the one content check.
 * Used by eleventy.config.js, _includes/post.njk and _pages/*.11ty.js.
 */
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
  text: "Compare progress photos on a before-and-after timeline, scroll to any date instantly, and align photos on the fly. Recomp never uploads your photos or weight data.",
  location: "article_footer",
};

// ---------------------------------------------------------------- the check

/** `<!-- TODO … -->`, any case, across lines. Always stripped from output. */
export const TODO_COMMENT = /<!--\s*TODO\b[\s\S]*?-->/gi;
/** Visible markers that block publishing. */
const BLOCKING_MARKER = /\[\s*(TODO|DRAFT)\b[^\]]*\]/gi;
/** Visible markers that only warn. */
const WARNING_MARKER = /\[\s*CONFIRM\b[^\]]*\]/gi;

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/**
 * Check one post's Markdown body. A non-draft with a TODO comment, [TODO] or [DRAFT]
 * fails; [CONFIRM] only warns. Returns { errors, warnings } as "file:line: text".
 */
export function checkPost(file, body, draft, bodyLineOffset = 0) {
  const errors = [];
  const warnings = [];
  const at = (m) => `${file}:${lineOf(body, m.index) + bodyLineOffset}: ${m[0].replace(/\s+/g, " ").slice(0, 80)}`;
  if (!draft) {
    for (const m of body.matchAll(TODO_COMMENT)) errors.push(at(m));
    for (const m of body.matchAll(BLOCKING_MARKER)) errors.push(at(m));
  }
  for (const m of body.matchAll(WARNING_MARKER)) warnings.push(at(m) + (draft ? "" : " (non-draft)"));
  return { errors, warnings };
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
