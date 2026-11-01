// /sitemap.xml: sitemap.xml as written, with indexed Markdown posts between
// <!-- blog:start --> and <!-- blog:end -->. Drafts and noindex posts are left out.
import { readFileSync } from "node:fs";
import { replaceRegion, sitemapEntries } from "../_config/blog.js";

export const data = { permalink: "/sitemap.xml", eleventyExcludeFromCollections: true };

export function render(data) {
  return replaceRegion(readFileSync("sitemap.xml", "utf8"), "blog", sitemapEntries(data.collections.posts), "sitemap.xml");
}
