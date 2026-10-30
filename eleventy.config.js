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
 *   metadata stripped, inside <figure> with the image title as <figcaption>. `{.phone}`
 *   after an image makes a narrow phone-screenshot figure (see _config/markdown.js).
 * - Build checks: a non-draft post with a TODO comment, [TODO] or [DRAFT] (outside code)
 *   fails the build; [CONFIRM] only warns. Unknown frontmatter keys and a missing co-located
 *   og_image fail too. TODO comments are always stripped from the output (not from code).
 *
 * BLOG_FIXTURES=1 also builds tests/fixtures/blog/*, the example draft post.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import Image from "@11ty/eleventy-img";
import { chrome } from "./scripts/apply-chrome.js";
import { findMismatches, stamp } from "./scripts/stamp-asset-versions.js";
import { checkFrontmatter, checkPost, isPostPath, jsonLd, postData, slugOf, sortPosts } from "./_config/blog.js";
import { SIZES, markdown } from "./_config/markdown.js";

const FIXTURES = process.env.BLOG_FIXTURES === "1";
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
  // tests/, js/*.test.js, package*.json, wrangler.jsonc, eleventy.config.js.
  for (const glob of [
    "index.html", "claude-version.html", "google6d053ef5debca997.html", "privacy.html", "support.html",
    "robots.txt", "_headers",
    "about/**", "faq/**", "privacy/**", "support/**", "roadmap/**",
    "assets/**", "js/!(*.test).js", "styles/**",
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

  // Build checks, on the Markdown source before render: frontmatter keys, og_image, and
  // TODO/DRAFT markers. A failing post is skipped and the problems print once at the end
  // (Eleventy would print a thrown error several times). TODO comments are stripped by the
  // markdown renderer (_config/markdown.js), outside code.
  const problems = new Map();
  eleventyConfig.on("eleventy.before", () => problems.clear());
  eleventyConfig.addPreprocessor("blog-check", "md", (data, content) => {
    if (!isPostPath(data.page.inputPath)) return;
    const file = data.page.inputPath.replace(/^\.\//, "");
    const raw = readFileSync(file, "utf8");
    const offset = Math.max(0, raw.slice(0, raw.lastIndexOf(content)).split("\n").length - 1);
    const draft = data.draft === true;
    const { errors, warnings } = checkPost(file, content, draft, offset);
    for (const w of warnings) console.warn(`[blog] warning: ${w}`);
    if (errors.length) errors.unshift(`${file} is not a draft but still has TODO/DRAFT markers. Resolve them or set draft: true.`);
    errors.push(...checkFrontmatter(file, raw, data, (rel) => existsSync(join(dirname(file), rel))));
    if (!errors.length) return;
    problems.set(file, errors);
    return false;
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

  eleventyConfig.on("eleventy.after", ({ runMode }) => {
    const live = runMode === "serve" || runMode === "watch";
    if (problems.size) {
      const lines = [...problems.values()].flat();
      console.error(`\n[blog] ${problems.size} post(s) failed the build checks and were skipped:\n  ${lines.join("\n  ")}\n`);
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
