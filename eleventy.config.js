/**
 * Eleventy builds the site into _site/, the only folder Cloudflare serves (wrangler.jsonc).
 *
 * - Pages: about/, faq/, privacy/, roadmap/, support/ and blog/ are Nunjucks templates
 *   (<dir>/index.njk) that extend _includes/base.njk. The header, footer, theme boot,
 *   canonical and og:url come from partials/*.html via chrome() and the ?v= hashes via
 *   stamp() after render, so nothing generated is committed for them.
 * - The home page (index.html), the redirect stubs (privacy.html, support.html),
 *   claude-version.html, the Google verification file, assets and root files are copied
 *   as-is (passthrough). apply-chrome and stamp-asset-versions still run on index.html
 *   first (see npm run build).
 * - blog/<slug>/index.md is a Markdown post rendered with _includes/post.njk (which
 *   extends base.njk).
 * - /blog/ fills its post cards from the posts collection; /sitemap.xml and /llms.txt are
 *   the hand-written files with the post lists filled in (_pages/*.11ty.js). Drafts get
 *   noindex and stay out of all three, and so do hand_listed posts (their entries are
 *   written by hand).
 * - Local images in a post go through Eleventy Image: WebP, 800/1600w, width/height set,
 *   metadata stripped, inside <figure> with the image title as <figcaption>. `{.phone}`
 *   after an image makes a narrow phone-screenshot figure (see _config/markdown.js).
 * - Build checks: a non-draft post with a TODO comment, [TODO] or [DRAFT] (outside code)
 *   fails the build; [CONFIRM] only warns. Unknown frontmatter keys and a missing co-located
 *   og_image fail too. TODO comments are always stripped from the output (not from code).
 *   A non-draft post with `template: app-review` must also have a summary, disclosure,
 *   app_store data and a verdict (checkTemplate). blog/_templates/ is never built.
 * - Live links (_config/links.js): after the build, a published page that links to a page
 *   that isn't in the build, or to a draft post, fails the build; a draft only warns. Links
 *   inside HTML comments are skipped, which is where a link waits until its page publishes.
 *
 * BLOG_FIXTURES=1 also builds tests/fixtures/blog/*, the example draft post.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import Image from "@11ty/eleventy-img";
import { chrome } from "./scripts/apply-chrome.js";
import { findMismatches, stamp } from "./scripts/stamp-asset-versions.js";
import { checkFrontmatter, checkPost, checkTemplate, indexCards, isPostPath, jsonLdBlocks, postData, slugOf, sortPosts, templateWarnings } from "./_config/blog.js";
import { checkInternalLinks } from "./_config/links.js";
import { SIZES, markdown } from "./_config/markdown.js";

const FIXTURES = process.env.BLOG_FIXTURES === "1";
// `npm run dev` sets RECOMP_DEV=1: Tailwind watches into .cache/dev/output.css (gitignored)
// and that file is served as /styles/output.css, so dev never rewrites the committed CSS.
// Production builds (no RECOMP_DEV) are unchanged.
const DEV = process.env.RECOMP_DEV === "1";
const DEV_CSS = ".cache/dev/output.css";
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".tif", ".tiff"]);
const OUTPUT = "_site";

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** Replace each local raster <img> in a post with an Eleventy Image WebP (srcset, width, height, lazy). */
async function optimizeImages(html, srcDir, outDir) {
  const tags = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const tag of new Set(tags)) {
    const src = attr(tag, "src");
    if (!src || /^(?:[a-z]+:|\/|\.\.\/)/i.test(src) || !RASTER.has(extname(src).toLowerCase())) continue;
    const file = join(srcDir, src);
    if (!existsSync(file)) throw new Error(`${file}: image not found`);
    const name = basename(src, extname(src));
    const stats = await Image(file, {
      widths: [800, 1600],
      formats: ["webp"],
      outputDir: outDir,
      urlPath: "./",
      sharpWebpOptions: { quality: 80 },
      filenameFormat: (id, s, width, format) => `${name}-${width}.${format}`,
    });
    const sizes = stats.webp;
    const largest = sizes[sizes.length - 1];
    const extra = [...tag.matchAll(/\s([a-z-]+)="([^"]*)"/gi)]
      .filter(([, key]) => !["src", "alt", "width", "height", "srcset", "sizes", "loading", "decoding"].includes(key))
      .map(([, key, value]) => ` ${key}="${value}"`)
      .join("");
    const replacement =
      `<img src="./${sizes[0].filename}"` +
      (sizes.length > 1 ? ` srcset="${sizes.map((s) => `./${s.filename} ${s.width}w`).join(", ")}" sizes="${attr(tag, "sizes") ?? SIZES}"` : "") +
      ` alt="${attr(tag, "alt") ?? ""}"${extra} width="${largest.width}" height="${largest.height}" loading="lazy" decoding="async">`;
    html = html.split(tag).join(replacement);
  }
  return html;
}

/** Every .html file under a folder, as paths relative to it. */
// Pages the live-link check skips. claude-version.html is an archived design mockup with a
// placeholder link to track/; it is served but nothing on the site links to it.
const LINK_CHECK_SKIP = ["/claude-version.html"];

const htmlFiles = (dir, prefix = "") =>
  readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? htmlFiles(dir, join(prefix, d.name)) : d.name.endsWith(".html") ? [join(prefix, d.name)] : [],
  );

const depthOf = (url) => (typeof url === "string" ? url.split("/").filter(Boolean).length : 0);

/** Folders under blog/ that are Markdown posts. */
const markdownPostDirs = () =>
  readdirSync("blog").filter((name) => statSync(join("blog", name)).isDirectory() && existsSync(join("blog", name, "index.md")));

export default function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["md", "njk", "11ty.js"]);
  eleventyConfig.setLibrary("md", markdown());

  // Only blog posts, <dir>/index.njk pages and _pages are templates. Everything else is copied or private.
  for (const glob of ["*.md", "docs/**", "scripts/**", "partials/**", "_config/**", "node_modules/**"]) {
    eleventyConfig.ignores.add(glob);
  }
  if (!FIXTURES) eleventyConfig.ignores.add("tests/**");
  // Article templates (blog/_templates/) are skeletons to copy, never built, listed or checked.
  eleventyConfig.ignores.add("blog/_templates/**");

  // Public files, copied byte-for-byte. Globs skip dotfiles (assets/.DS_Store).
  // Not copied (private): *.md, docs/, scripts/, partials/, _config/, _includes/, _pages/,
  // tests/, js/*.test.js, package*.json, wrangler.jsonc, eleventy.config.js.
  for (const glob of [
    "index.html", "claude-version.html", "google6d053ef5debca997.html", "privacy.html", "support.html",
    "robots.txt", "_headers",
    "assets/**", "data/**", "js/!(*.test).js", DEV ? "styles/!(output).css" : "styles/**",
  ]) {
    eleventyConfig.addPassthroughCopy(glob);
  }
  if (DEV) {
    eleventyConfig.addPassthroughCopy({ [DEV_CSS]: "styles/output.css" });
    // .cache/ is gitignored, so Eleventy's own watcher skips it; the dev server watches it
    // instead and live-reloads the stylesheet when Tailwind rewrites it.
    eleventyConfig.setServerOptions({ watch: [DEV_CSS] });
  }
  // Hand-written blog posts (none left) would be copied whole. Markdown post folders only
  // copy non-raster extras (svg, gif, mp4); their photos go through Eleventy Image.
  const mdDirs = new Set(markdownPostDirs());
  for (const name of readdirSync("blog")) {
    if (!statSync(join("blog", name)).isDirectory() || name.startsWith("_")) continue;
    eleventyConfig.addPassthroughCopy(mdDirs.has(name) ? `blog/${name}/*.{svg,gif,mp4}` : `blog/${name}/**`);
  }

  for (const file of ["sitemap.xml", "llms.txt", "styles/output.css", "partials/"]) {
    eleventyConfig.addWatchTarget(file);
  }

  // Posts: layout, URL and normalized data from frontmatter.
  eleventyConfig.addGlobalData("eleventyComputed", {
    layout: (data) => (isPostPath(data.page.inputPath) ? "post.njk" : data.layout),
    permalink: (data) => (isPostPath(data.page.inputPath) ? `/blog/${slugOf(data.page.inputPath)}/index.html` : data.permalink),
    post: (data) => (isPostPath(data.page.inputPath) ? postData(data) : undefined),
    // Folder depth of the page URL ("/" 0, "/about/" 1, "/blog/x/" 2) and the matching
    // relative prefix for assets, used by _includes/base.njk.
    depth: (data) => depthOf(data.page.url),
    root: (data) => "../".repeat(depthOf(data.page.url)),
  });
  eleventyConfig.addCollection("posts", (api) =>
    sortPosts(api.getAll().filter((item) => isPostPath(item.inputPath)).map((item) => postData(item.data))),
  );

  // Build checks, on the Markdown source before render: frontmatter keys, og_image, and
  // TODO/DRAFT markers. A failing post is skipped and the problems print once at the end
  // (Eleventy would print a thrown error several times). TODO comments are stripped by the
  // markdown renderer (_config/markdown.js), outside code.
  const problems = new Map();
  // URL path -> draft, for every Markdown post (the live-link check needs the drafts).
  const postDrafts = new Map();
  eleventyConfig.on("eleventy.before", () => {
    problems.clear();
    postDrafts.clear();
  });
  eleventyConfig.addPreprocessor("blog-check", "md", (data, content) => {
    if (!isPostPath(data.page.inputPath)) return;
    const file = data.page.inputPath.replace(/^\.\//, "");
    const raw = readFileSync(file, "utf8");
    const offset = Math.max(0, raw.slice(0, raw.lastIndexOf(content)).split("\n").length - 1);
    const draft = data.draft === true;
    postDrafts.set(`/blog/${slugOf(file)}/`, draft);
    const { errors, warnings } = checkPost(file, content, draft, offset);
    warnings.push(...templateWarnings(file, data));
    for (const w of warnings) console.warn(`[blog] warning: ${w}`);
    if (errors.length) errors.unshift(`${file} is not a draft but still has TODO/DRAFT markers. Resolve them or set draft: true.`);
    errors.push(...checkFrontmatter(file, raw, data, (rel) => existsSync(join(dirname(file), rel))));
    errors.push(...checkTemplate(file, data, content));
    if (!errors.length) return;
    problems.set(file, errors);
    return false;
  });

  eleventyConfig.addFilter("jsonLdBlocks", (post) => jsonLdBlocks(post));
  eleventyConfig.addFilter("indexCards", (posts) => indexCards(posts));
  const md = markdown();
  eleventyConfig.addFilter("md", (text) => md.render(String(text)).trim());
  eleventyConfig.addFilter("mdInline", (text) => md.renderInline(String(text)).trim());

  // og:image: writes <name>-og.webp (1200w) for a co-located og_image and returns the URL.
  eleventyConfig.addAsyncShortcode("ogImage", async function (post) {
    if (post.ogSource) {
      const name = basename(post.ogSource, extname(post.ogSource));
      await Image(join(dirname(post.file), post.ogSource), {
        widths: [1200],
        formats: ["webp"],
        outputDir: join(OUTPUT, "blog", post.slug),
        sharpWebpOptions: { quality: 80 },
        filenameFormat: () => `${name}-og.webp`,
      });
    }
    return post.ogImage;
  });

  // Template pages (base.njk) and posts get the site chrome and ?v= hashes after render;
  // posts also get optimized images.
  eleventyConfig.addTransform("chrome", async function (content) {
    const out = this.page.outputPath;
    if (typeof out !== "string" || !out.endsWith(".html")) return content;
    let html = chrome(content, relative(OUTPUT, out));
    if (isPostPath(this.page.inputPath)) {
      html = await optimizeImages(html, dirname(this.page.inputPath), dirname(out));
    }
    return stamp(html);
  });

  eleventyConfig.on("eleventy.after", ({ runMode }) => {
    const live = runMode === "serve" || runMode === "watch";
    if (problems.size) {
      const lines = [...problems.values()].flat();
      console.error(`\n[blog] ${problems.size} post(s) failed the build checks and were skipped:\n  ${lines.join("\n  ")}\n`);
      if (!live) process.exitCode = 1;
    }
    // Live links: published pages link only to live pages (_config/links.js).
    const pages = htmlFiles(OUTPUT).map((rel) => {
      const url = `/${rel.replace(/\\/g, "/").replace(/(^|\/)index\.html$/, "$1")}`;
      return { url, html: readFileSync(join(OUTPUT, rel), "utf8"), draft: postDrafts.get(url) === true };
    });
    const exists = (path) => {
      const file = join(OUTPUT, path);
      return (existsSync(file) && statSync(file).isFile()) || existsSync(join(file, "index.html")) || existsSync(`${file}.html`);
    };
    const drafts = [...postDrafts].filter(([, draft]) => draft).map(([url]) => url);
    const links = checkInternalLinks(pages.filter((p) => !LINK_CHECK_SKIP.includes(p.url)), exists, drafts);
    const byPage = new Map();
    for (const w of links.warnings) {
      const [page, rest] = w.split(": links ");
      byPage.set(page, [...(byPage.get(page) ?? []), rest.replace(/, which is .*/, "")]);
    }
    for (const [page, hrefs] of byPage) console.warn(`[links] warning: draft ${page} links ${hrefs.length} page(s) that aren't live: ${hrefs.join(", ")}`);
    if (links.errors.length) {
      console.error(`\n[links] ${links.errors.length} link(s) on published pages point to pages that aren't live. Put them in an HTML comment until those pages publish:\n  ${links.errors.join("\n  ")}\n`);
      if (!live) process.exitCode = 1;
    }
    // Same guard as stamp-asset-versions.js, against what will be served.
    if (live) return;
    const mismatches = findMismatches(OUTPUT);
    if (mismatches.length) throw new Error(`asset version mismatch in ${OUTPUT}/:\n  ${mismatches.join("\n  ")}`);
  });

  return {
    dir: { input: ".", output: OUTPUT, includes: "_includes" },
    markdownTemplateEngine: false,
  };
}
