/**
 * Live-link check: a published page links only to live pages. Runs after the build on the
 * rendered HTML (_site), so Markdown links, raw HTML and template links are all covered.
 * Links inside HTML comments are skipped: that is where a link to a draft or an unbuilt page
 * waits until that page publishes (SPEC: "a published page links only to live pages").
 * A link with a data-draft-link attribute is skipped too: a deliberate link to a draft, like the
 * Draft cards on /blog/. Drafts build (noindex), so the link works; the attribute says it's meant.
 *
 * A link fails when its target is not in the build, or is a draft post. On a published page
 * that fails the build; on a draft it only warns.
 */
import { SITE_URL } from "./blog.js";

const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

/** Internal page paths ("/blog/x/") that the <a href>s of one page point to. */
export function internalLinks(html, pageUrl) {
  const out = [];
  const base = new URL(pageUrl, SITE_URL);
  for (const m of stripComments(html).matchAll(/<a\b[^>]*?\shref="([^"]*)"[^>]*>/gi)) {
    if (/\sdata-draft-link[\s=>]/i.test(m[0])) continue;
    const href = m[1].replace(/&amp;/g, "&").trim();
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript|data|sms):/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, base);
    } catch {
      continue;
    }
    if (url.origin !== new URL(SITE_URL).origin) continue;
    out.push({ href, path: decodeURI(url.pathname) });
  }
  return out;
}

/**
 * pages: [{ url, html, draft }] for every built HTML page. exists(path) says whether a
 * URL path is in the build (a page or a copied file). draftUrls: URL paths of draft posts.
 * Returns { errors, warnings } as "<page>: links <href>, which is a draft / not on the site".
 */
export function checkInternalLinks(pages, exists, draftUrls) {
  const errors = [];
  const warnings = [];
  const drafts = new Set(draftUrls);
  for (const page of pages) {
    const seen = new Set();
    for (const { href, path } of internalLinks(page.html, page.url)) {
      const key = path.endsWith("/") || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`;
      let problem = null;
      if (drafts.has(key)) problem = "a draft";
      else if (!exists(path)) problem = "not on the site";
      if (!problem || seen.has(href)) continue;
      seen.add(href);
      (page.draft ? warnings : errors).push(`${page.url}: links ${href}, which is ${problem}`);
    }
  }
  return { errors, warnings };
}
