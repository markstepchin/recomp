// /llms.txt: llms.txt as written, with listed Markdown posts between
// <!-- posts:start --> and <!-- posts:end -->. Drafts and noindex posts are left out.
import { readFileSync } from "node:fs";
import { llmsLines, replaceRegion } from "../_config/blog.js";

export const data = { permalink: "/llms.txt", eleventyExcludeFromCollections: true };

export function render(data) {
  return replaceRegion(readFileSync("llms.txt", "utf8"), "posts", llmsLines(data.collections.posts), "llms.txt");
}
