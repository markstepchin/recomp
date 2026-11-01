---
title: "Lasmit \"Progress\" review: a measurement tracker first, a photo app second"
seo_title: "Lasmit Progress (Body Measurements Tracker App) Review (2026) | Recomp"
description: "I tested Lasmit's Progress, the oldest app in my roundup with 9,355 ratings. Two-way Apple Health sync is its strength; compare works only in landscape."
draft: true
og_image: ./lasmit-my-results.jpg
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 583840813
  name: "Body Measurements Tracker App"
  developer: "Lasmit TLB Ltd"
  developer_url: "https://theprogressapp.com/"
  rating: 4.6
  rating_count: 9374
  min_ios: "18.0"
  url: "https://apps.apple.com/us/app/body-measurements-tracker-app/id583840813"
  icon: "assets/app-icons/lasmit.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  **Lasmit's "Progress" is the app I'd send you to for measurement history and Apple Health, not for photos.** It has 9,355 ratings since 2012, the most of any dedicated app I tested, and two-way Apple Health sync. I can tell someone put a lot of effort into it, but everything feels awkward, and using it gave me a headache. Compare works only in landscape. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: provisional quick answer pending the full test\]</mark>
card_blurb: "A measurement tracker first, with two-way Apple Health sync. Compare works only in landscape."
# Visible 'How I tested' line. Empty until Mark fills it; renders [CONFIRM] on drafts.
how_tested:
  device: ""        # e.g. the iPhone model, from Settings > General > About
  ios: ""           # iOS version during the test
  app_version: ""   # app version tested, from the App Store page or the app's About screen
  started: ""       # YYYY-MM-DD, first day of testing
  ended: ""         # YYYY-MM-DD, last day of testing
  checkins: ""      # number of check-ins added during the test

# Mark's hand measurements. Leave empty until measured; never estimate.
measurements:
  taps_per_checkin: ""      # weight plus front, side and back photos, from the home screen to saved
  seconds_per_checkin: ""   # same flow, stopwatch
  import_photo_count: ""    # N photos in the bulk import test
  import_seconds: ""        # time to import those N photos

scorecard:
  # A check-in should be effortless
  checkin_time: { status: missing, fact: "A check-in is a multi-page form" }  # L39
  photo_picker: { status: confirm, fact: "[CONFIRM]" }
  weight_apple_health: { status: has, fact: "Two-way Apple Health sync that imports past data" }  # L55
  weight_quick_entry: { status: has, fact: "Weight scroller" }  # L39
  data_together: { status: has, fact: "Weight, BMI and photos on one results screen" }  # L41
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No auto-align" }  # L45
  ghost_overlay: { status: confirm, fact: "[CONFIRM]" }  # Smart Overlay exists but is off by default (L45). Mark to decide partial vs has.
  gridlines: { status: confirm, fact: "[CONFIRM]" }
  manual_align: { status: missing, fact: "No alignment" }  # L45
  align_in_compare: { status: missing, fact: "No alignment" }  # L45
  # Comparison should be effortless
  compare_speed: { status: partial, fact: "A date stepper, plus jump to a date" }  # L49
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: partial, fact: "Side by side in landscape only" }  # L49
  slider_view: { status: confirm, fact: "[CONFIRM]" }
  overlay_view: { status: confirm, fact: "[CONFIRM]" }
  # The photos are the star
  photo_focus: { status: confirm, fact: "[CONFIRM]" }
  # Data privacy
  photos_on_device: { status: confirm, fact: "[CONFIRM]" }  # L67: photos sync to your own iCloud once you switch it on. Whether anything else leaves the device isn't stated.
  privacy_label: { status: partial, fact: "The policy names more services than the label" }  # L69
  # Quality of life
  bulk_import: { status: missing, fact: "No bulk import in its docs" }  # L63
  data_import_export: { status: confirm, fact: "[CONFIRM]" }
  app_lock: { status: confirm, fact: "[CONFIRM]" }  # No app lock fact found in the review on this commit.
  backup_transfer: { status: has, fact: "iCloud sync carries over to a new phone" }  # L67
  reminders: { status: has, fact: "Reminders that store reviewers thank it for" }  # L75
  in_app_camera: { status: partial, fact: "Camera with a timer; overlay off by default" }  # L39, L45
  units: { status: confirm, fact: "[CONFIRM]" }
  body_measurements: { status: has, fact: "17 measurements plus 10 custom ones" }  # L55
  sharing: { status: confirm, fact: "[CONFIRM]" }
  timelapse: { status: confirm, fact: "[CONFIRM]" }
  no_account: { status: confirm, fact: "[CONFIRM]" }
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }
  edit_date: { status: confirm, fact: "[CONFIRM]" }
  partial_checkin: { status: confirm, fact: "[CONFIRM]" }
  dark_mode: { status: confirm, fact: "[CONFIRM]" }
  no_ads: { status: confirm, fact: "[CONFIRM]" }
---

<!-- TODO(Mark): no "sameAs" on the author node yet. /about/ and the site link no X, Instagram, LinkedIn or GitHub profile for Mark. Add it here and on /about/ once one is public. -->

**Full disclosure: I build Recomp, a free progress photo app that competes with this one.** This review expands the [Lasmit entry](/blog/best-progress-photo-apps/#lasmit) in my [roundup of the best progress photo apps](/blog/best-progress-photo-apps/), scored with [the same kit](/blog/how-i-test-progress-photo-apps/).

<!-- app-store-card -->

## What it costs {#what-it-costs}

**Lasmit is free to download, but progress photos need Pro.** Its listing says "Pro unlocks progress photos, unlimited measurement areas, custom reports, past-data entry, and more." The store lists $3.99 and $5.99 a month, $11.99 and $19.99 a year, and $29.99 lifetime. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: which monthly price a new user sees\]</mark>

**A Sep 24, 2026 review says a "lifetime" purchase now needs an annual plan to log more than four measurements.** I haven't checked that against the current paywall. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: lifetime vs annual measurement limit\]</mark>

## Taking a check-in {#taking-a-check-in}

It has a nice weight scroller and a timer, but a single check-in is a multi-page form. That's the opposite of a check-in you'll repeat every week. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: seconds and taps to a saved check-in\]</mark>

<div class="flex items-start justify-center gap-4"><figure class="m-0 min-w-0 flex-1"><img alt="Lasmit My Results screen with weight, BMI and photo buttons" class="block h-auto w-full rounded-card border border-card-border" sizes="(min-width: 800px) 368px, 50vw" src="./lasmit-my-results.jpg"/><figcaption class="mt-[0.65rem] text-center text-caption leading-[1.4] text-muted">My Results: weight, BMI and photo buttons.</figcaption></figure><figure class="m-0 min-w-0 flex-1"><img alt="Lasmit check-in detail with photos, weight, BMI and a note" class="block h-auto w-full rounded-card border border-card-border" sizes="(min-width: 800px) 368px, 50vw" src="./lasmit-checkin-detail.jpg"/><figcaption class="mt-[0.65rem] text-center text-caption leading-[1.4] text-muted">One check-in: photos, weight, BMI and a note.</figcaption></figure></div>

## Lining photos up {#lining-photos-up}

**There is no alignment.** Its Smart Overlay has been off by default since version 2026.5 on Feb 3, 2026. The release note says "when it didn't work, it was causing a lot of confusion." <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: whether it aligns anything when switched on\]</mark> <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: the rubric floor is 1; use 0 or 1?\]</mark>

## Comparing two dates {#comparing-two-dates}

Side by side works in landscape only, with a date stepper on each side, so you step through dates one at a time. It's awkward, and not the best UI. The same 2026.5 update added a jump to any photo by date in compare. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: seconds to put the oldest and newest front photos side by side\]</mark>

![Lasmit landscape-only compare with No face found badges](./lasmit-compare-landscape.jpg "Compare works in landscape only.")

## Measurements and Apple Health {#measurements-and-apple-health}

**Measurements are where Lasmit earns its place.** It tracks 17 body measurements plus up to 10 custom ones. Apple Health sync runs both ways: it reads weight, body fat and waist, and writes weight, body fat, lean body mass, waist and BMI. It also imports your past Apple Health data. Fitbit support was removed in 2026.22 on Sep 22, 2026.

**Its reviewers care more about measurements than photos.** In my [study of 732 App Store reviews](/blog/what-people-want-from-progress-photo-apps/), 511 are Lasmit's. Of those, 220 mention measurements and 125 mention photos. Seven complain that it won't calculate body fat from tape or caliper numbers.

<div class="flex items-start justify-center gap-4"><figure class="m-0 min-w-0 flex-1"><img alt="Lasmit body measurements diagram" class="block h-auto w-full rounded-card border border-card-border" sizes="(min-width: 800px) 368px, 50vw" src="./lasmit-body-measurements.jpg"/><figcaption class="mt-[0.65rem] text-center text-caption leading-[1.4] text-muted">Body measurements.</figcaption></figure><figure class="m-0 min-w-0 flex-1"><img alt="Lasmit results list of weigh-ins grouped by month" class="block h-auto w-full rounded-card border border-card-border" sizes="(min-width: 800px) 368px, 50vw" src="./lasmit-results-list.jpg"/><figcaption class="mt-[0.65rem] text-center text-caption leading-[1.4] text-muted">Weigh-ins by month.</figcaption></figure></div>

## Importing old photos {#importing-old-photos}

**I found no bulk photo import and no date-from-metadata in Lasmit's public docs.** Photos taken in the app stay in the app, and you can save one to your phone by hand, per a 2019 help article. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: hands-on import test\]</mark>

## Where your photos live {#where-your-photos-live}

**Photos and measurements sync to your own iCloud once you switch Progress on in iOS Settings.** Its help article, updated Oct 14, 2025, says your data then survives deleting the app or getting a new phone. Version 2026.7 on Feb 27, 2026 fixed "an issue that was affecting moving your data between devices."

**The label says Data Not Linked to You, and the policy names more.** It lists Mixpanel, Firebase Remote Config, Crashlytics, RevenueCat, HealthKit and TestFlight. It also names Vero, which collects your email and first name, and Help Scout for support, and the label mentions neither. An app lock setting exists but didn't block anything for me. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: exact app-lock behavior\]</mark>

**Lost data shows up in its reviews.** A Dec 2025 review is titled "Lost FIVE YEARS of data in latest upgrade." <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: iCloud delete-and-restore test\]</mark>

## What reviewers say {#what-reviewers-say}

**Reminders are what Lasmit's reviewers thank it for.** Of the 37 reviews in my study that mention reminders, 19 positive ones are Lasmit's. One reads: "The reminders are helpful but not intrusive." Four of the five reminder complaints are Lasmit's too, including one that "would not stick to the requested reminder schedule."

## The numbers {#the-numbers}

**Every app's numbers sit side by side, with test dates, in [my test data](/blog/how-i-test-progress-photo-apps/#store-data).**

<div aria-label="Lasmit store data" class="-mx-gutter overflow-x-auto overscroll-x-contain px-gutter" role="region" tabindex="0"><table class="w-max min-w-full border-collapse text-left text-micro">
<thead>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg" scope="col">Field</th>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg" scope="col">Value</th>
</tr>
</thead>
<tbody>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Full name</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Body Measurements Tracker App, "Progress" (Lasmit)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Rating</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">4.63 from 9,355 US ratings (Oct 3, 2026)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Written reviews, Jul 2 to Oct 2, 2026</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">5 (US feed)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Written reviews in Apple's feed</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">511 in my study (Oct 2, 2026)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">First released</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Dec 17, 2012</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Last updated</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Sep 22, 2026</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Version tested</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">2026.22 <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM]</mark></td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Requires</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">iOS 18.0+ on iPhone, plus Vision Pro; no iPad, Mac or Android</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">App Store</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted"><a href="https://apps.apple.com/us/app/body-measurements-tracker-app/id583840813">Body Measurements Tracker App on the App Store</a></td>
</tr>
</tbody>
</table></div>

<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: the roundup calls Lasmit's 5 recent written reviews "the most here," but GainFrame also had 5 in the same window.\]</mark>

## Who should use something else {#who-should-use-something-else}

**If photos are your main record, Lasmit is the wrong shape.** For a check-in you can repeat in a minute and a better compare screen, see my [Thumbstone review](/blog/thumbstone-review/) or [Then &amp; Now review](/blog/then-and-now-review/). For a one-time price with iCloud sync, see [Fit-Stitch](/blog/fit-stitch-review/).

## What I haven't tested yet {#what-i-havent-tested-yet}

**I still need design, performance, privacy, backup and import scores, and an iCloud restore.** I also need to see what Smart Overlay does when it's on. If Lasmit's Smart Overlay works for you, email me at [support@progressphotos.app](mailto:support@progressphotos.app).

## My verdict on Lasmit {#verdict}

<!-- TODO(Mark): verdict in plain words on whether I recommend Lasmit for progress photos, and for whom. No numeric score. -->

## FAQ {#faq}

<!-- TODO(Mark): questions readers ask about Lasmit, each as a ### question with its answer. Add every one to the faq frontmatter too, word for word. -->

---

Published: <!-- TODO(Mark): publish date (also set "published:" in the frontmatter). -->

Tested: <!-- TODO(Mark): month tested and app version. --> {#when-tested}

Questions or corrections: support@progressphotos.app

<!-- scorecard -->
<!-- chrome:author-bio depth="2" -->
<aside
class="mt-12 flex flex-wrap items-center gap-4 rounded-card border border-card-border bg-card px-[1.4rem] py-[1.35rem] sm:flex-nowrap sm:items-start"
aria-labelledby="author-bio-heading"
>
<!-- TODO(Mark): pick a photo. Replace this div with <img class="shrink-0 rounded-full" src="../../assets/mark-stepchin.webp" alt="Mark Stepchin" width="64" height="64" loading="lazy" decoding="async" style="width:64px;height:64px;object-fit:cover" />. The 64×64 box is reserved so nothing shifts. -->
<div
class="shrink-0 rounded-full border border-card-border text-center text-micro text-muted"
style="width:64px;height:64px;display:flex;align-items:center;justify-content:center"
role="img"
aria-label="Photo of Mark Stepchin coming soon"
>
<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">TODO photo</mark>
</div>
<div class="contents sm:block sm:min-w-0 sm:flex-1">
<h2 id="author-bio-heading" class="min-w-0 flex-1 text-h4 font-bold tracking-h4">About the author</h2>
<p class="w-full shrink-0 pt-2 text-muted">
<strong class="text-fg">I'm Mark Stepchin, and I make Recomp, so read what I say about other apps with that in mind.</strong>
I'm a software engineer who has worked at Silicon Valley startups, with some time at Apple.
I've trained for years: I bulked from 145 to 195 lb, cut to 155, and now sit around 165.
Before building Recomp in my evenings and weekends from San Diego, I tried more than 10 progress photo apps.
<a href="../../about/">More about me</a>
</p>
<!-- TODO(Mark): the weight history comes from your Oct 17 brief and isn't on /about/ yet. Confirm the numbers before publishing. -->
<!-- TODO(Mark): "tried more than 10" is the public claim from /blog/why-i-built-recomp/. Don't say "tested 36 apps": 36 is the proposed candidate list in the how-i-test draft, with no screening log yet, and hands-on scoring is partial (6 of 10 apps have proposed scores). Once testing is done, this could read "I screened 36 apps and tested N hands-on." -->
</div>
</aside>
<!-- /chrome:author-bio -->
