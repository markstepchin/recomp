/**
 * Eleventy builds the site into _site/, the only folder Cloudflare serves (wrangler.jsonc).
 *
 * - Hand-written pages, assets and root files are copied as-is (passthrough), so they
 *   are byte-identical to the committed files. apply-chrome and stamp-asset-versions
 *   still run on those source files first (see npm run build).
 * - blog/<slug>/index.md is a Markdown post rendered with _includes/post.njk, then given
 *   the same header/footer/canonical (apply-chrome) and ?v= hashes (stamp-asset-versions).
 * - /blog/, /sitemap.xml and /llms.txt are the hand-written files with the post lists
 *   filled in (_pages/*.11ty.js). Drafts get noindex and stay out of all three.
 * - Local images in a post go through Eleventy Image: WebP, 800/1600w, width/height set,
 *   metadata stripped, inside <figure> with the image title as <figcaption>.
 * - One content check: a non-draft post with a TODO comment, [TODO] or [DRAFT] fails the
 *   build; [CONFIRM] only warns. TODO comments are always stripped from the output.
 *
 * BLOG_FIXTURES=1 also builds tests/fixtures/blog/*, the example draft post.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import Image from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import { chrome } from "./scripts/apply-chrome.js";
import { findMismatches, stamp } from "./scripts/stamp-asset-versions.js";
import { TODO_COMMENT, checkPost, isPostPath, jsonLd, postData, slugOf, sortPosts } from "./_config/blog.js";

const FIXTURES = process.env.BLOG_FIXTURES === "1";
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".tif", ".tiff"]);
const OUTPUT = "_site";

// Figure markup matches the hand-written posts (blog/why-i-built-recomp).
const FIGURE_CLASS = "m-0";
const IMG_CLASS = "block h-auto w-full rounded-card border border-card-border";
const CAPTION_CLASS = "mt-[0.65rem] text-center text-caption leading-[1.4] text-muted";
const SIZES = "(min-width: 800px) 752px, 100vw";

function markdown() {
  const md = markdownIt({ html: true, linkify: false, typographer: false });
  // Explicit heading ids: `## Heading {#existing-id}`.
  md.use(markdownItAttrs, { allowedAttributes: ["id", "class"] });
  // A paragraph holding only an image becomes <figure>; the image title is the caption.
  md.core.ruler.push("figure", (state) => {
    const t = state.tokens;
    for (let i = 0; i + 2 < t.length; i += 1) {
      if (t[i].type !== "paragraph_open" || t[i + 2].type !== "paragraph_close") continue;
      const kids = t[i + 1].children ?? [];
      if (kids.length !== 1 || kids[0].type !== "image") continue;
      t[i].hidden = t[i + 2].hidden = true;
      kids[0].meta = { ...kids[0].meta, figure: true };
    }
  });
  const escape = md.utils.escapeHtml;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const caption = token.attrGet("title");
    if (caption) token.attrs = token.attrs.filter(([name]) => name !== "title");
    token.attrSet("alt", self.renderInlineAsText(token.children, options, env));
    if (!token.attrGet("class")) token.attrSet("class", IMG_CLASS);
    const img = self.renderToken(tokens, idx, options);
    if (!token.meta?.figure) return img;
    const cap = caption ? `<figcaption class="${CAPTION_CLASS}">${escape(caption)}</figcaption>` : "";
    return `<figure class="${FIGURE_CLASS}">${img}${cap}</figure>\n`;
  };
  return md;
}

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
      (sizes.length > 1 ? ` srcset="${sizes.map((s) => `./${s.filename} ${s.width}w`).join(", ")}" sizes="${SIZES}"` : "") +
      ` alt="${attr(tag, "alt") ?? ""}"${extra} width="${largest.width}" height="${largest.height}" loading="lazy" decoding="async">`;
    html = html.split(tag).join(replacement);
  }
  return html;
}

/** Folders under blog/ that are Markdown posts. */
const markdownPostDirs = () =>
  readdirSync("blog").filter((name) => statSync(join("blog", name)).isDirectory() && existsSync(join("blog", name, "index.md")));

export default function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["md", "11ty.js"]);
  eleventyConfig.setLibrary("md", markdown());

  // Only blog posts and _pages are templates. Everything else is copied or private.
  for (const glob of ["*.md", "docs/**", "scripts/**", "partials/**", "_config/**", "node_modules/**"]) {
    eleventyConfig.ignores.add(glob);
  }
  if (!FIXTURES) eleventyConfig.ignores.add("tests/**");

  // Public files, copied byte-for-byte. Globs skip dotfiles (assets/.DS_Store).
  // Not copied (private): *.md, docs/, scripts/, partials/, _config/, _includes/, _pages/,
  // tests/, package*.json, wrangler.jsonc, eleventy.config.js.
  for (const glob of [
    "index.html", "claude-version.html", "google6d053ef5debca997.html", "privacy.html", "support.html",
    "robots.txt", "_headers",
    "about/**", "faq/**", "privacy/**", "support/**", "roadmap/**",
    "assets/**", "js/**", "styles/**",
  ]) {
    eleventyConfig.addPassthroughCopy(glob);
  }
  // Hand-written blog posts are copied whole. Markdown post folders only copy
  // non-raster extras (svg, gif, mp4); their photos go through Eleventy Image.
  const mdDirs = new Set(markdownPostDirs());
  for (const name of readdirSync("blog")) {
    if (!statSync(join("blog", name)).isDirectory()) continue;
    eleventyConfig.addPassthroughCopy(mdDirs.has(name) ? `blog/${name}/*.{svg,gif,mp4}` : `blog/${name}/**`);
  }

  for (const file of ["blog/index.html", "sitemap.xml", "llms.txt", "styles/output.css", "partials/"]) {
    eleventyConfig.addWatchTarget(file);
  }

  // Posts: layout, URL and normalized data from frontmatter.
  eleventyConfig.addGlobalData("eleventyComputed", {
    layout: (data) => (isPostPath(data.page.inputPath) ? "post.njk" : data.layout),
    permalink: (data) => (isPostPath(data.page.inputPath) ? `/blog/${slugOf(data.page.inputPath)}/index.html` : data.permalink),
    post: (data) => (isPostPath(data.page.inputPath) ? postData(data) : undefined),
  });
  eleventyConfig.addCollection("posts", (api) =>
    sortPosts(api.getAll().filter((item) => isPostPath(item.inputPath)).map((item) => postData(item.data))),
  );

  // The one check, on the Markdown source before render. Also strips TODO comments.
  eleventyConfig.addPreprocessor("blog-check", "md", (data, content) => {
    if (!isPostPath(data.page.inputPath)) return;
    const file = data.page.inputPath.replace(/^\.\//, "");
    const raw = readFileSync(file, "utf8");
    const offset = Math.max(0, raw.slice(0, raw.lastIndexOf(content)).split("\n").length - 1);
    const draft = data.draft === true;
    const { errors, warnings } = checkPost(file, content, draft, offset);
    for (const w of warnings) console.warn(`[blog] warning: ${w}`);
    if (errors.length) {
      throw new Error(
        `[blog] ${file} is not a draft but still has TODO/DRAFT markers. Resolve them or set draft: true.\n  ${errors.join("\n  ")}`,
      );
    }
    return content.replace(TODO_COMMENT, "");
  });

  eleventyConfig.addFilter("jsonLd", (post) => jsonLd(post));
  const md = markdown();
  eleventyConfig.addFilter("md", (text) => md.render(String(text)).trim());

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

  // Posts get the site chrome, optimized images and ?v= hashes after render.
  eleventyConfig.addTransform("blog-post", async function (content) {
    if (!isPostPath(this.page.inputPath)) return content;
    const slug = slugOf(this.page.inputPath);
    let html = chrome(content, `blog/${slug}/index.html`);
    html = await optimizeImages(html, dirname(this.page.inputPath), dirname(this.page.outputPath));
    return stamp(html);
  });

  // Same guard as stamp-asset-versions.js, against what will be served.
  eleventyConfig.on("eleventy.after", ({ runMode }) => {
    if (runMode === "serve" || runMode === "watch") return;
    const mismatches = findMismatches(OUTPUT);
    if (mismatches.length) throw new Error(`asset version mismatch in ${OUTPUT}/:\n  ${mismatches.join("\n  ")}`);
  });

  return {
    dir: { input: ".", output: OUTPUT, includes: "_includes" },
    markdownTemplateEngine: false,
  };
}
