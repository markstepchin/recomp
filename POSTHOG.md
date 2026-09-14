# PostHog

Product analytics is **not** enabled yet. When you are ready, paste the official PostHog JavaScript snippet into the shared head marker — do not invent or commit a project API key until you mean to turn tracking on.

## Where to paste (2 minutes)

1. Open the PostHog project → **Project settings** → copy the HTML/JS snippet they give you.
2. Find this HTML comment in each page `<head>`:

   ```html
   <!-- POSTHOG_SNIPPET -->
   ```

3. Paste the snippet **immediately after** that comment (still inside `<head>`).

There is no shared layout file — this is a static GitHub Pages site — so the marker is duplicated in every public HTML page:

| Page | File |
| --- | --- |
| Home | `index.html` |
| Blog index | `blog/index.html` |
| Progress photos article | `blog/how-to-take-progress-photos-for-recomp/index.html` |
| About | `about/index.html` |
| Privacy | `privacy/index.html` |
| FAQ | `faq/index.html` |
| Support | `support/index.html` |

Skip the thin redirect files (`privacy.html`, `support.html`). Those bounce to the directory URLs above.

## Notes

- The iOS app is local-first: photos and check-ins stay on device. Website analytics (this snippet) is separate from the app and only covers `markstepchin.github.io/recomp`.
- If you later extract a shared `head` partial, keep a single `<!-- POSTHOG_SNIPPET -->` there and delete the copies.
