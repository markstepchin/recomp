---
title: "Metamorph review: the priciest lifetime plan, and you place every photo by hand"
seo_title: "Body Progress Pics: Metamorph Review (2026) | Recomp"
description: "I tested Metamorph with my own progress photos. Its ghost overlay helps at capture, but it has no weight logging, and its compare screen makes you place every photo yourself."
draft: true
og_image: ./metamorph-compare-2x1.jpg
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 6544789120
  name: "Body Progress Pics: Metamorph"
  developer: "Tiny Ideas Pty Ltd"
  developer_url: "https://tinyideas.net/"
  rating: 4.3
  rating_count: 70
  min_ios: "18.0"
  url: "https://apps.apple.com/us/app/body-progress-pics-metamorph/id6544789120"
  icon: "assets/app-icons/metamorph.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  **I don't recommend Metamorph.** It's expensive for a general-purpose before/after app: $129.99 lifetime, the most of any app I graded. Its ghost overlay helps at capture, but it has no weight logging, and you place every compare photo by hand. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: provisional quick answer pending the full test\]</mark>
card_blurb: "The priciest lifetime plan I found, and you place every compare photo by hand."
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
  checkin_time: { status: confirm, fact: "[CONFIRM]" }
  photo_picker: { status: confirm, fact: "[CONFIRM]" }
  weight_apple_health: { status: missing, fact: "No weight logging" }  # L39
  weight_quick_entry: { status: missing, fact: "No weight logging" }  # L39
  data_together: { status: missing, fact: "No weight logging" }  # L39
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No alignment after the shot" }  # L43
  ghost_overlay: { status: has, fact: "Ghost of your first or latest photo" }  # L39
  gridlines: { status: has, fact: "Alignment grid since version 2.17" }  # L43
  manual_align: { status: missing, fact: "No alignment after the shot" }  # L43
  align_in_compare: { status: missing, fact: "No alignment after the shot" }  # L43
  # Comparison should be effortless
  compare_speed: { status: missing, fact: "You place every photo by hand" }  # L47
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: has, fact: "1x2 and 2x1 layouts" }  # L47
  slider_view: { status: has, fact: "Slider" }  # L47
  overlay_view: { status: confirm, fact: "[CONFIRM]" }
  # The photos are the star
  photo_focus: { status: confirm, fact: "[CONFIRM]" }
  # Data privacy
  photos_on_device: { status: has, fact: "Device or iCloud, per its listing" }  # L57
  privacy_label: { status: partial, fact: "The label and the policy disagree" }  # L59 | L59 is a TODO block. Publish only once the TODO is resolved.
  # Quality of life
  bulk_import: { status: partial, fact: "Imports from your library; date reading unknown" }  # L53
  data_import_export: { status: confirm, fact: "[CONFIRM]" }
  app_lock: { status: has, fact: "Face ID lock" }  # L57
  backup_transfer: { status: partial, fact: "Cloud sync, per its paywall" }  # L57
  reminders: { status: confirm, fact: "[CONFIRM]" }
  in_app_camera: { status: has, fact: "Ghost overlay and timer" }  # L39
  units: { status: confirm, fact: "[CONFIRM]" }
  body_measurements: { status: confirm, fact: "[CONFIRM]" }
  sharing: { status: partial, fact: "Exports carry a watermark until you pay" }  # L33
  timelapse: { status: has, fact: "Video time-lapse" }  # L47
  no_account: { status: confirm, fact: "[CONFIRM]" }
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }
  edit_date: { status: confirm, fact: "[CONFIRM]" }
  partial_checkin: { status: confirm, fact: "[CONFIRM]" }
  dark_mode: { status: confirm, fact: "[CONFIRM]" }
  no_ads: { status: confirm, fact: "[CONFIRM]" }
---

<!-- TODO(Mark): no "sameAs" on the author node yet. /about/ and the site link no X, Instagram, LinkedIn or GitHub profile for Mark. Add it here and on /about/ once one is public. -->

**Full disclosure: I build Recomp, a free progress photo app that competes with this one.** This review expands the [Metamorph entry](/blog/best-progress-photo-apps/#metamorph) in my [roundup of the best progress photo apps](/blog/best-progress-photo-apps/), scored with [the same kit](/blog/how-i-test-progress-photo-apps/).

<!-- app-store-card -->

## What it costs {#what-it-costs}

**A free 7-day trial, then $29.99 a year, $4.99 a month or $129.99 lifetime.** The store also lists $4.99 a week. The trial arrived in 1.3 on Dec 12, 2024, and paying removes the watermark. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: what the free tier allows after the trial\]</mark>

![Metamorph paywall offering a free week then 29.99 dollars a year](./metamorph-paywall.jpg "The paywall: $29.99 a year after a free week."){.phone}

## Taking a check-in {#taking-a-check-in}

It has a ghost overlay and a timer, but no weight logging. The timer arrived in 1.7 on Jan 23, 2025, and since 2.15 the overlay can be your first or your most recent photo. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: seconds and taps to a saved front, side and back check-in\]</mark>

## Lining photos up {#lining-photos-up}

**There's no alignment tool after the shot.** The ghost helps you line up before it. Its own site describes "the automatic alignment overlay to match your position, angle, and zoom to your previous photo before you shoot." An alignment grid arrived in 2.17 in Aug 2026. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: the rubric floor is 1; use 0 or 1?\]</mark>

## Comparing two dates {#comparing-two-dates}

It has a video time-lapse, a slider, 1x2 and 2x1, but the UI is poor, and you place each photo by hand. Picking a pair from hundreds of photos is slow in every app I tested, and this is the most manual version. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: seconds to put the oldest and newest front photos side by side\]</mark>

<div class="flex items-start justify-center gap-4"><figure class="m-0 min-w-0 flex-1"><img alt="Metamorph 2x1 compare with Video, Slider, 1x2, 2x1 and Edit tabs" class="block h-auto w-full rounded-card border border-card-border" sizes="(min-width: 800px) 368px, 50vw" src="./metamorph-compare-2x1.jpg"/><figcaption class="mt-[0.65rem] text-center text-caption leading-[1.4] text-muted">2x1 compare, one of five tabs.</figcaption></figure><figure class="m-0 min-w-0 flex-1"><img alt="Metamorph empty compare screen asking you to tap to place each photo" class="block h-auto w-full rounded-card border border-card-border" sizes="(min-width: 800px) 368px, 50vw" src="./metamorph-compare-empty.jpg"/><figcaption class="mt-[0.65rem] text-center text-caption leading-[1.4] text-muted">You place every photo by hand.</figcaption></figure></div>

## Importing old photos {#importing-old-photos}

**Metamorph imports existing photos from your library.** Its site doesn't say whether it reads each photo's date. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: import time, date handling and scroll test with the full library\]</mark>

## Where your photos live {#where-your-photos-live}

**Face ID locks the app, and photos stay on your device or iCloud, per its listing.** It doesn't explain whether iCloud means sync, a backup, or iCloud Photos as a source. Its paywall advertises cloud sync. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: delete-and-restore test\]</mark>

<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: label vs policy conflict. The label says Data Not Collected, but the policy lists "Anonymous usage analytics such as screen views and button taps" and "Anonymous crash reports." Raise it; don't resolve it.\]</mark>

## Where Metamorph came from {#where-metamorph-came-from}

**Metamorph began as a stop-motion app for renovations, plants and kids before it turned to body progress.** Its own blog ranks Metamorph first. One 5-star review in my [review study](/blog/what-people-want-from-progress-photo-apps/) uses it for home renovations.

![Metamorph My Morphs home screen](./metamorph-my-morphs.jpg "My Morphs home."){.phone}

## The numbers {#the-numbers}

**Every app's numbers sit side by side, with test dates, in [my test data](/blog/how-i-test-progress-photo-apps/#store-data).**

<div aria-label="Metamorph store data" class="-mx-gutter overflow-x-auto overscroll-x-contain px-gutter" role="region" tabindex="0"><table class="w-max min-w-full border-collapse text-left text-micro">
<thead>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg" scope="col">Field</th>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg" scope="col">Value</th>
</tr>
</thead>
<tbody>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Full name</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Body Progress Pics: Metamorph</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Rating</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">4.38 from 68 US ratings (Oct 3, 2026)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Written reviews, Jul 2 to Oct 2, 2026</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">1 (US feed)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Written reviews in Apple's feed</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">32 in my study</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">First released</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Oct 10, 2024</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Last updated</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Aug 6, 2026</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Version tested</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">2.17 <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM]</mark></td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Requires</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">iOS 18.0+ on iPhone, plus Apple Silicon Mac and Vision Pro; no iPad or Android</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">App Store</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted"><a href="https://apps.apple.com/us/app/body-progress-pics-metamorph/id6544789120">Body Progress Pics: Metamorph on the App Store</a></td>
</tr>
</tbody>
</table></div>

## What to use instead {#what-to-use-instead}

**For a ghost overlay at capture and a better compare screen, see my [Then &amp; Now review](/blog/then-and-now-review/).** For auto-align, see [Thumbstone](/blog/thumbstone-review/). For a one-time price far below $129.99, see [Fit-Stitch](/blog/fit-stitch-review/) at $4.99.

## What I haven't tested yet {#what-i-havent-tested-yet}

**I still need design, performance, privacy, backup and import scores, and what "iCloud" means in practice.** If you've used Metamorph's cloud sync, email me at [support@progressphotos.app](mailto:support@progressphotos.app).

## My verdict on Metamorph {#verdict}

<!-- TODO(Mark): verdict in plain words on whether I recommend Metamorph for progress photos, and for whom. No numeric score. -->

## FAQ {#faq}

<!-- TODO(Mark): questions readers ask about Metamorph, each as a ### question with its answer. Add every one to the faq frontmatter too, word for word. -->

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
