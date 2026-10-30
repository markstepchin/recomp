// /blog/: blog/index.html as written, with the Markdown post cards filled in
// between <!-- posts:start --> and <!-- posts:end --> (newest first, drafts left out).
import { readFileSync } from "node:fs";
import { indexCards, replaceRegion } from "../_config/blog.js";

export const data = { permalink: "/blog/index.html", eleventyExcludeFromCollections: true };

export function render(data) {
  return replaceRegion(readFileSync("blog/index.html", "utf8"), "posts", indexCards(data.collections.posts), "blog/index.html");
}
