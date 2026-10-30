/**
 * Build blog articles from Markdown.
 *
 * Each `blog/<slug>/index.md` (frontmatter + Markdown) is rendered into
 * `blog/<slug>/index.html` with `partials/article.html`. Folders without
 * `index.md` are hand-written HTML and are left alone, so posts can move over
 * one at a time. apply-chrome.js then stamps the header/footer and canonical,
 * and stamp-asset-versions.js adds the ?v= hashes, exactly as for other pages.
 *
 * Also regenerates, between marker comments only:
 *   sitemap.xml      <!-- blog:start --> … <!-- blog:end -->
 *   blog/index.html  <!-- posts:start --> … <!-- posts:end -->
 *   llms.txt         <!-- posts:start --> … <!-- posts:end -->
 *
 * Rules:
 *   - `<!-- TODO … -->` comments are always stripped from the output.
 *   - A non-draft article that still contains a TODO comment fails the build.
 *   - Visible [CONFIRM …] / [TODO …] / [DRAFT …] markers only warn.
 *   - Headings keep explicit ids: `## Heading {#existing-id}`.
 *   - Images sit next to index.md: `![alt](./photo.webp)`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";

export const SITE_URL = "https://progressphotos.app";
const DEFAULT_OG_IMAGE = "https://progressphotos.app/assets/step-compare.webp?v=5";
const AUTHOR = {
  "@type": "Person",
  "@id": "https://progressphotos.app/about/#mark",
  name: "Mark Stepchin",
  url: "https://progressphotos.app/about/",
  jobTitle: "Software engineer",
};
const PUBLISHER = { "@type": "Organization", name: "Recomp", url: "https://progressphotos.app/" };

const KEYS = new Set([
  "title", "seo_title", "description", "published", "updated", "tested", "draft", "noindex",
  "listed", "og_image", "breadcrumb", "summary", "summary_heading", "card_blurb", "llms_blurb", "faq",
]);

const TODO_COMMENT = /<!--\s*TODO[\s\S]*?-->/g;
const VISIBLE_MARKER = /\[(CONFIRM|TODO|DRAFT)\b[^\]]*\]/g;
const DRAFT_BADGE =
  '<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[DRAFT: noindex, not published]</mark>';

export class BuildError extends Error {}

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function md() {
  const it = new MarkdownIt({ html: true, linkify: false, typographer: false });
  it.use(markdownItAttrs, { allowedAttributes: ["id", "class"] });
  // Markdown images are below the article title, so load them lazily.
  const image = it.renderer.rules.image;
  it.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (!token.attrGet("loading")) token.attrSet("loading", "lazy");
    if (!token.attrGet("decoding")) token.attrSet("decoding", "async");
    return image(tokens, idx, options, env, self);
  };
  // Strip TODO comments at the token level, so a TODO shown in a code span is left alone.
  for (const rule of ["html_block", "html_inline"]) {
    const original = it.renderer.rules[rule];
    it.renderer.rules[rule] = (tokens, idx, ...rest) => {
      tokens[idx].content = tokens[idx].content.replace(TODO_COMMENT, "");
      if (tokens[idx].content.trim() === "") return "";
      return original(tokens, idx, ...rest);
    };
  }
  return it;
}

/** Lines in the Markdown source that hold a TODO comment outside code. */
function todoLines(source) {
  const lines = [];
  let fenced = false;
  source.split("\n").forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced) return;
    const outsideCode = line.replace(/`[^`]*`/g, "");
    if (/<!--\s*TODO/.test(outsideCode)) lines.push(i + 1);
  });
  return lines;
}

function isoDate(value, key, file) {
  if (value === undefined || value === null || value === "") return null;
  const d = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new BuildError(`${file}: "${key}" must be YYYY-MM-DD`);
  return d.toISOString().slice(0, 10);
}

const shortDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Parse and validate one index.md. `root` is the site root, `rel` like blog/<slug>/index.md. */
export function loadPost(root, rel) {
  const file = rel;
  const raw = readFileSync(join(root, rel), "utf8");
  const { data, content } = matter(raw);
  const bodyOffset = raw.slice(0, raw.length - content.length).split("\n").length - 1;
  for (const key of Object.keys(data)) {
    if (!KEYS.has(key)) throw new BuildError(`${file}: unknown frontmatter key "${key}"`);
  }
  const draft = data.draft === true;
  for (const key of ["title", "description"]) {
    if (!data[key]) throw new BuildError(`${file}: missing "${key}"`);
  }
  const published = isoDate(data.published, "published", file);
  if (!draft && !published) throw new BuildError(`${file}: missing "published" (required unless draft: true)`);
  const updated = isoDate(data.updated, "updated", file);
  const slug = rel.split("/").slice(-2, -1)[0];
  const url = `${SITE_URL}/blog/${slug}/`;

  let ogImage = DEFAULT_OG_IMAGE;
  if (data.og_image) {
    const og = String(data.og_image);
    if (/^https?:\/\//.test(og)) ogImage = og;
    else {
      const local = og.startsWith("./") ? join(dirname(rel), og.slice(2)) : og.replace(/^\//, "");
      if (!existsSync(join(root, local.split("?")[0]))) throw new BuildError(`${file}: og_image not found: ${og}`);
      ogImage = `${SITE_URL}/${local.split("\\").join("/")}`;
    }
  }

  const todos = todoLines(raw);
  const markers = [];
  content.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(VISIBLE_MARKER)) markers.push(`${file}:${i + 1 + bodyOffset}: ${m[0]}`);
  });

  return {
    file, slug, url, draft,
    noindex: draft || data.noindex === true,
    listed: !draft && data.noindex !== true && data.listed !== false,
    title: String(data.title),
    seoTitle: data.seo_title ? String(data.seo_title) : `${data.title} — Recomp`,
    description: String(data.description),
    published, updated,
    tested: data.tested ? String(data.tested) : null,
    breadcrumb: data.breadcrumb ? String(data.breadcrumb) : null,
    summary: data.summary ? String(data.summary).trim() : null,
    summaryHeading: data.summary_heading ? String(data.summary_heading) : "Summary",
    cardBlurb: data.card_blurb ? String(data.card_blurb).trim() : String(data.description),
    llmsBlurb: data.llms_blurb ? String(data.llms_blurb).trim() : String(data.description),
    faq: Array.isArray(data.faq) ? data.faq : null,
    ogImage, content, todos, markers,
  };
}

function jsonLd(post) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
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
  if (!post.faq) return JSON.stringify(article, null, 2);
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: String(q),
      acceptedAnswer: { "@type": "Answer", text: String(a) },
    })),
  };
  return JSON.stringify([article, faq], null, 2);
}

/** Render one post to a full HTML page (before chrome and ?v= stamping). */
export function renderPost(post, template, renderer = md()) {
  const byline = [
    'By <a class="text-muted" href="../../about/" rel="author">Mark Stepchin</a>',
    post.published ? ` · Published ${shortDate(post.published)}.` : "",
    post.tested ? ` Tested ${escapeHtml(post.tested)}.` : "",
  ].join("");
  const crumbs = [];
  if (post.breadcrumb) crumbs.push(`          · ${escapeHtml(post.breadcrumb)}\n`);
  if (post.draft) crumbs.push(`          · ${DRAFT_BADGE}\n`);
  const summary = post.summary
    ? [
        "        <aside",
        '          class="rounded-card border border-card-border bg-card px-[1.4rem] py-[1.35rem]"',
        '          aria-labelledby="summary-heading"',
        "        >",
        '          <h2 id="summary-heading" class="text-h4 font-bold tracking-h4">',
        `            ${escapeHtml(post.summaryHeading)}`,
        "          </h2>",
        `          <div class="mt-3 text-muted">${renderer.render(post.summary).trim()}</div>`,
        "        </aside>",
        "",
      ].join("\n")
    : "";
  const times = [];
  if (post.published) times.push(`    <meta property="article:published_time" content="${post.published}" />\n`);
  if (post.updated) times.push(`    <meta property="article:modified_time" content="${post.updated}" />\n`);
  const values = {
    seo_title: escapeHtml(post.seoTitle),
    title: escapeHtml(post.title),
    description: escapeHtml(post.description),
    robots: post.noindex ? '    <meta name="robots" content="noindex" />\n' : "",
    url: post.url,
    og_image: escapeHtml(post.ogImage),
    article_times: times.join(""),
    jsonld: jsonLd(post).replace(/<\//g, "<\\/"),
    breadcrumb: crumbs.join(""),
    byline,
    summary,
    body: renderer.render(post.content).trimEnd(),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in values ? values[key] : m));
}

/** Replace the text between `<!-- name:start -->` and `<!-- name:end -->`. */
export function replaceRegion(text, name, inner, file) {
  const re = new RegExp(`(^[ \\t]*<!-- ${name}:start -->)[\\s\\S]*?(^[ \\t]*<!-- ${name}:end -->)`, "m");
  if (!re.test(text)) throw new BuildError(`${file}: missing <!-- ${name}:start --> / <!-- ${name}:end --> markers`);
  return text.replace(re, (_, start, end) => `${start}\n${inner}${end}`);
}

function sitemapEntries(posts) {
  return posts
    .filter((p) => !p.noindex)
    .map((p) => {
      const lastmod = p.updated || p.published;
      return `  <url>\n    <loc>${p.url}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>\n`;
    })
    .join("");
}

function indexCards(posts) {
  return posts
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
}

function llmsLines(posts) {
  return posts
    .filter((p) => p.listed)
    .map((p) => `- [${p.title}](${p.url}): ${p.llmsBlurb.replace(/\s+/g, " ")}\n`)
    .join("");
}

export function findPosts(root) {
  const blog = join(root, "blog");
  return readdirSync(blog)
    .filter((name) => statSync(join(blog, name)).isDirectory() && existsSync(join(blog, name, "index.md")))
    .map((name) => `blog/${name}/index.md`)
    .sort();
}

/** Build every post under `root`. Returns { posts, warnings }. Throws BuildError on a failed check. */
export function build(root, { write = true, log = console.log } = {}) {
  const template = readFileSync(join(root, "partials/article.html"), "utf8");
  const renderer = md();
  const posts = findPosts(root).map((rel) => loadPost(root, rel));

  const failures = [];
  const warnings = [];
  for (const p of posts) {
    if (!p.draft) for (const line of p.todos) failures.push(`${p.file}:${line}: unresolved TODO comment (set draft: true or resolve it)`);
    for (const m of p.markers) warnings.push(`${m}${p.draft ? "" : " (non-draft)"}`);
  }
  if (failures.length) throw new BuildError(failures.join("\n"));

  // Newest first; drafts without a date sort last.
  posts.sort((a, b) => (b.published || "").localeCompare(a.published || "") || a.slug.localeCompare(b.slug));

  const outputs = new Map();
  for (const p of posts) outputs.set(`blog/${p.slug}/index.html`, renderPost(p, template, renderer));
  const regions = [
    ["sitemap.xml", "blog", sitemapEntries(posts)],
    ["blog/index.html", "posts", indexCards(posts)],
    ["llms.txt", "posts", llmsLines(posts)],
  ];
  for (const [rel, name, inner] of regions) {
    const path = join(root, rel);
    if (!existsSync(path)) continue;
    outputs.set(rel, replaceRegion(readFileSync(path, "utf8"), name, inner, rel));
  }

  if (write) {
    for (const [rel, html] of outputs) {
      const path = join(root, rel);
      if (existsSync(path) && readFileSync(path, "utf8") === html) continue;
      writeFileSync(path, html);
      log(`blog: wrote ${rel}`);
    }
  }
  for (const w of warnings) console.warn(`blog: warning: ${w}`);
  log(`blog: ${posts.length} markdown post${posts.length === 1 ? "" : "s"} built`);
  return { posts, outputs, warnings };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const root = new URL("..", import.meta.url).pathname;
  try {
    build(root);
  } catch (error) {
    if (!(error instanceof BuildError)) throw error;
    console.error(`blog: build failed\n${error.message}`);
    process.exit(1);
  }
}
