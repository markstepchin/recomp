# PostHog

Website analytics lives in one shared file: `js/posthog.js`. That file is the official snippet from project settings, plus a localhost skip so `npm run dev` does not send events, plus attribution and the App Store click.

## Pages that load it

Each real page includes the file next to `theme.js` (home page: before the inline script). Redirect stubs `privacy.html` and `support.html` do not.

| Page | File |
| --- | --- |
| Home | `index.html` |
| Blog index | `blog/index.html` |
| Progress photos article | `blog/how-to-take-progress-photos-for-recomp/index.html` |
| Founder post | `blog/why-i-built-recomp/index.html` |
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
- Session replay is off (SDK default; this MVP does not enable it)

Website analytics is separate from the iOS app. Recomp check-ins stay on device.

## Attribution (event properties, not person profiles)

Visitors on this site are never identified, so person properties such as `$initial_utm_source` would not be saved. Switching to `person_profiles: "always"` would create a person profile for every anonymous visit. This MVP keeps `identified_only` and writes attribution onto events instead.

On load, `js/posthog.js` reads the landing query string and, inside PostHog's `loaded` callback (which runs before the first `$pageview`):

- `posthog.register(...)` — latest touch: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `gclid`, `ttclid` when present. Later landings overwrite these.
- `posthog.register_once(...)` — first non-empty touch: `initial_utm_source`, `initial_utm_medium`, `initial_utm_campaign`, `initial_utm_content`, `initial_gclid`, `initial_ttclid`. Stored in the PostHog cookie / localStorage and attached to later events in this browser, including `$pageview` and `app_store_click`.

PostHog already copies those same campaign parameters onto events when they are in the URL (`save_campaign_params`, and `gclid` / `ttclid` are in the SDK's default list). `$referrer` and `$referring_domain` are also SDK defaults (`save_referrer`). Nothing extra is sent for those. There is no multi-touch model.

Break down Live events and insights by `utm_source` or `initial_utm_source`, and by `$referring_domain`. If a property is JSON `null`, that visit did not have the parameter — filter with "is set".

## Conversion

`app_store_click` fires on a primary click or middle-click of an `apps.apple.com` or `itunes.apple.com` link. The listener lives in `js/posthog.js` and does not change page markup.

| Property | Value |
| --- | --- |
| `page_path` | `location.pathname` |
| `cta_location` | `header` if the link is inside `<header>`, `footer` if inside `<footer>`, otherwise `inline` (hero and article badges) |

Latest and first-touch attribution ride along as super properties on the same event. The capture uses `sendBeacon` so a same-tab hop to the App Store still sends.

## Verify in Live events

Use a production host (not `localhost` — that skip is intentional). Open the site with a campaign query, for example:

`https://progressphotos.app/?utm_source=tiktok&utm_medium=social&utm_campaign=spring&utm_content=bio&gclid=test-gclid&ttclid=test-ttclid`

In PostHog: **Activity → Live events**.

1. `$pageview` for that URL. Properties include `utm_source=tiktok` (and the other params above), `initial_utm_source=tiktok` on this first landing, plus `$referrer` / `$referring_domain` (or `$direct` when there is no referrer).
2. Click a header **App Store** link, an in-page badge, and a footer **App Store** link. Each sends `app_store_click` with `page_path` and `cta_location` of `header`, `inline`, or `footer`.
3. Open another page in the same browser with no query string. That `$pageview` still has `initial_utm_*` from the first landing. A new `utm_source` on a later visit updates `utm_source` and leaves `initial_utm_source` as the first value.

## Insight to save in the PostHog UI

The repo only has the public project token, so the dashboard cannot be created from here. In PostHog, create one trends insight (or a dashboard named **Marketing site**) and save it:

- Series A: `$pageview`, total count, break down by `$pathname` (top pages)
- Series B: `app_store_click`, total count
- Breakdown (or a second insight): `$referring_domain` and `utm_source` (add `initial_utm_source` if you want first touch)

Filter the date range to the period you are judging SEO and campaigns. `utm_source` only appears as a filter choice after at least one event has arrived with it set.

## Deferred

- **`outbound_click`** for non–App Store links. Autocapture can already emit `$autocapture` on clicks, but that is not a dedicated outbound event, and a second listener would grow the taxonomy. Not added.
- **Scroll depth.** Not a one-toggle in this snippet. Not custom-built. `$pageleave` can already include time on page because `defaults: 2026-05-30` turns on pageleave whenever pageviews are on. That was already true before this change.

## Checks

`node js/posthog.test.js` checks attribution parsing, App Store click location, and that the redirect stubs stay untracked.

## Updating the snippet

Replace the loader and `posthog.init` block in `js/posthog.js` with a fresh copy from **Project settings**. Keep all of the following:

- the localhost guard
- `person_profiles: "identified_only"`
- the `loaded` callback that calls `register` / `register_once`
- the App Store click listener above the guard
