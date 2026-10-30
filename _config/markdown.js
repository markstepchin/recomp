/**
 * The markdown-it setup for blog posts, shared by eleventy.config.js, the TODO check
 * (_config/blog.js) and the tests.
 *
 * - Explicit heading ids: `## Heading {#existing-id}` (markdown-it-attrs, id and class only).
 * - A paragraph holding only an image becomes <figure>; the image title is the <figcaption>.
 * - `{.phone}` on an image marks a phone screenshot: a narrower, centered figure and a
 *   matching `sizes`. Other classes add to the default image classes.
 * - TODO comments (<!-- TODO … -->) are dropped from HTML blocks and inline HTML only,
 *   so code spans and fences keep them.
 */
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";

/** `<!-- TODO … -->`, any case, across lines. */
export const TODO_COMMENT = /<!--\s*TODO\b[\s\S]*?-->/gi;

// Figure markup matches the hand-written posts (blog/why-i-built-recomp).
export const FIGURE_CLASS = "m-0";
export const PHONE_FIGURE_CLASS = "m-0 mx-auto mt-12 w-1/2 max-w-[280px]";
export const IMG_CLASS = "block h-auto w-full rounded-card border border-card-border";
export const CAPTION_CLASS = "mt-[0.65rem] text-center text-caption leading-[1.4] text-muted";
export const SIZES = "(min-width: 800px) 752px, 100vw";
export const PHONE_SIZES = "(min-width: 560px) 280px, 50vw";
const PHONE = "phone";

export function markdown() {
  const md = markdownIt({ html: true, linkify: false, typographer: false });
  md.use(markdownItAttrs, { allowedAttributes: ["id", "class"] });

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
    const extra = (token.attrGet("class") ?? "").split(/\s+/).filter(Boolean);
    const phone = extra.includes(PHONE);
    token.attrSet("class", [IMG_CLASS, ...extra.filter((c) => c !== PHONE)].join(" "));
    if (phone) token.attrSet("sizes", PHONE_SIZES);
    const img = self.renderToken(tokens, idx, options);
    if (!token.meta?.figure) return img;
    const cap = caption ? `<figcaption class="${CAPTION_CLASS}">${escape(caption)}</figcaption>` : "";
    return `<figure class="${phone ? PHONE_FIGURE_CLASS : FIGURE_CLASS}">${img}${cap}</figure>\n`;
  };

  const strip = (rule) => (tokens, idx, ...rest) => {
    return rule(tokens, idx, ...rest).replace(TODO_COMMENT, "");
  };
  md.renderer.rules.html_block = strip(md.renderer.rules.html_block);
  md.renderer.rules.html_inline = strip(md.renderer.rules.html_inline);
  return md;
}
