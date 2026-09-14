# PostHog (not installed)

This site has **no PostHog runtime**, no project key, and no analytics snippet. Add it yourself when you want website analytics.

## Create a project

1. Sign in at [PostHog](https://posthog.com/) and create a project (US or EU cloud is fine).
2. Open **Project settings** and copy the official **HTML/JS snippet**. It includes your project API key — use that key. Do not invent one.

## Where to paste

There is no shared layout file (plain static HTML). Paste the snippet inside `<head>` on each page you want tracked.

A no-op comment marks the spot on the new inner pages:

```html
<!-- PostHog: paste snippet in shared head -->
```

| Page | File |
| --- | --- |
| Blog index | `blog/index.html` |
| Progress photos article | `blog/how-to-take-progress-photos-for-recomp/index.html` |
| About | `about/index.html` |
| Privacy | `privacy/index.html` |
| FAQ | `faq/index.html` |
| Support | `support/index.html` |

The live **home page** (`index.html`) is left unchanged in this work. If you want PostHog there too, paste the same snippet in that file’s `<head>` yourself.

Skip the redirect files `privacy.html` and `support.html`.

## Notes

- Website analytics is separate from the iOS app. Recomp check-ins stay on device.
- If you later extract a shared `head` partial, paste the snippet once there and delete the copies.
