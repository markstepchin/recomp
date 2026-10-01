# Agent notes

Use Tailwind utility classes for all styling. Write custom CSS only for something utilities cannot do, and add a short comment explaining why.

Header and footer markup lives in `partials/`. Run `npm run build` so `scripts/apply-chrome.js` stamps those partials into the pages and rebuilds `styles/output.css`. Commit the stamped HTML and the built CSS.

New blog posts start from `partials/post.html`. Keep the article CTA section at the end of every blog post, on the blog index, and on the about page.
