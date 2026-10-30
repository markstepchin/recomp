# Agent notes

Use Tailwind utility classes for all styling. Write custom CSS only for something utilities cannot do, and add a short comment explaining why.

Header and footer markup lives in `partials/`. Run `npm run build` so `scripts/apply-chrome.js` stamps those partials into the pages and rebuilds `styles/output.css`. Commit the stamped HTML and the built CSS. Eleventy then copies the public pages into `_site/`, the only directory Cloudflare serves. `_site/` is not committed, and a new public file or folder must be added to the passthrough list in `eleventy.config.js`.

New Markdown posts go in `blog/<slug>/index.md` and render with `_includes/post.njk`. Copy `tests/fixtures/blog/example-post/` to start one; `npm run build:example` builds that draft locally. A non-draft post with a TODO comment, `[TODO]` or `[DRAFT]` fails the build. Hand-written posts start from `partials/post.html`. Keep the article CTA section at the end of every blog post, on the blog index, and on the about page.
