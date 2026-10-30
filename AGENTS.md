# Agent notes

Use Tailwind utility classes for all styling. Write custom CSS only for something utilities cannot do, and add a short comment explaining why.

Header and footer markup lives in `partials/`. Run `npm run build` so `scripts/apply-chrome.js` stamps those partials into the pages and rebuilds `styles/output.css`. Commit the stamped HTML and the built CSS. Eleventy then copies the public pages into `_site/`, the only directory Cloudflare serves. `_site/` is not committed, and a new public file or folder must be added to the passthrough list in `eleventy.config.js`.

New Markdown posts go in `blog/<slug>/index.md` and render with `_includes/post.njk`. Copy `tests/fixtures/blog/example-post/` to start one; `npm run build:example` builds that draft locally. A non-draft post with a TODO comment (any case) or exactly `[TODO]`, `[DRAFT]`, `[TODO: …]` or `[DRAFT: …]` outside code fails the build, and so does an unknown frontmatter key or a missing co-located `og_image`; `npm test` covers these rules. Drafts (`draft: true`) are built and live with noindex but stay out of the lists. Add `{.phone}` after an image for a phone screenshot. On /blog/, in llms.txt and in the sitemap, Markdown posts fill their marker regions, newest first among themselves, above the hand-written entries, which stay in the order written in the HTML. Hand-written posts start from `partials/post.html`. Keep the article CTA section at the end of every blog post, on the blog index, and on the about page.

## Local preview

Run `npm install` once, then `npm run dev` and open http://localhost:3000. It serves the Eleventy site with live reload: saving a Markdown post, a hand-written page or a template rebuilds and reloads the browser, and Tailwind runs in watch mode alongside, so new classes and edits to `styles/input.css` show up without a restart. Draft posts are served too (for example http://localhost:3000/blog/hevy-review/ on a branch that has it), with the yellow draft marker. Stop it with Ctrl-C.

Dev mode writes nothing to tracked files. Tailwind writes to `.cache/dev/output.css` (gitignored), which Eleventy serves as `/styles/output.css` when `RECOMP_DEV=1`, and the partials and `?v=` hashes are not restamped. Before committing, run `npm run build` to regenerate `styles/output.css`, the stamped header and footer and the `?v=` hashes, then commit those changes.
