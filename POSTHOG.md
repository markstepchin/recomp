# PostHog

Website analytics lives in one shared file: `js/posthog.js`. That file is the official snippet from project settings, plus a localhost skip so `npm run dev` does not send events.

## Pages that load it

Each real page includes the file next to `theme.js` (home page: before the inline script). Redirect stubs `privacy.html` and `support.html` do not.

| Page | File |
| --- | --- |
| Home | `index.html` |
| Blog index | `blog/index.html` |
| Progress photos article | `blog/how-to-take-progress-photos-for-recomp/index.html` |
| About | `about/index.html` |
| Privacy | `privacy/index.html` |
| FAQ | `faq/index.html` |
| Support | `support/index.html` |

## Config

Copied from the PostHog project snippet:

- Project API key in `js/posthog.js` (client-side keys are public by design)
- `api_host`: `https://us.i.posthog.com`
- `defaults`: `2026-05-30`
- `person_profiles`: `identified_only` — no person profile for anonymous visitors
- Session replay is off (SDK default)

Website analytics is separate from the iOS app. Recomp check-ins stay on device.

## Updating the snippet

Replace the loader and `posthog.init` block in `js/posthog.js` with a fresh copy from **Project settings**. Keep the localhost guard around it.
