---
title: "Photo Compare review: decent alignment for one before/after, with ads"
seo_title: "Photo Compare Before After Review (2026) | Recomp"
description: "I tested Photo Compare Before After with my own progress photos. Alignment is decent, the free version compares two photos and shows ads, and it makes an image, not a weekly record."
draft: true
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 1537250336
  name: "Photo Compare - Before & After"
  developer: "Devnex"
  developer_url: "https://devnex.nl/"
  rating: 4.5
  rating_count: 2650
  min_ios: "16.0"
  url: "https://apps.apple.com/us/app/photo-compare-before-after/id1537250336"
  icon: "assets/app-icons/photo-compare.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  **Photo Compare is a before/after image maker, and its alignment is decent.** The free version compares two photos and shows ads. It doesn't keep a weekly record of check-ins, so it fits one before/after, not tracking. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: provisional quick answer; "doesn't keep a weekly record" needs Mark's check\]</mark>
card_blurb: "Decent alignment for one before/after, with ads in the free version."
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
  weight_apple_health: { status: confirm, fact: "[CONFIRM]" }
  weight_quick_entry: { status: confirm, fact: "[CONFIRM]" }
  data_together: { status: confirm, fact: "[CONFIRM]" }  # L20/L91 say it doesn't keep a weekly record of check-ins; Mark to decide missing.
  # Alignment should be effortless
  auto_align: { status: confirm, fact: "[CONFIRM]" }
  ghost_overlay: { status: confirm, fact: "[CONFIRM]" }
  gridlines: { status: confirm, fact: "[CONFIRM]" }
  manual_align: { status: has, fact: "Alignment is decent" }  # L44
  align_in_compare: { status: confirm, fact: "[CONFIRM]" }
  # Comparison should be effortless
  compare_speed: { status: confirm, fact: "[CONFIRM]" }
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: has, fact: "Before and after, two photos in the free version" }  # L40
  slider_view: { status: confirm, fact: "[CONFIRM]" }
  overlay_view: { status: confirm, fact: "[CONFIRM]" }  # L32 says overlays are Pro; unclear if that means an overlay compare view.
  # The photos are the star
  photo_focus: { status: confirm, fact: "[CONFIRM]" }
  # Data privacy
  photos_on_device: { status: confirm, fact: "[CONFIRM]" }
  privacy_label: { status: confirm, fact: "[CONFIRM]" }
  # Quality of life
  bulk_import: { status: confirm, fact: "[CONFIRM]" }
  data_import_export: { status: confirm, fact: "[CONFIRM]" }
  app_lock: { status: confirm, fact: "[CONFIRM]" }
  backup_transfer: { status: confirm, fact: "[CONFIRM]" }
  reminders: { status: confirm, fact: "[CONFIRM]" }
  in_app_camera: { status: confirm, fact: "[CONFIRM]" }
  units: { status: confirm, fact: "[CONFIRM]" }
  body_measurements: { status: confirm, fact: "[CONFIRM]" }
  sharing: { status: has, fact: "Makes a before/after image" }  # L20
  timelapse: { status: partial, fact: "Video needs Pro" }  # L32
  no_account: { status: confirm, fact: "[CONFIRM]" }
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }
  edit_date: { status: confirm, fact: "[CONFIRM]" }
  partial_checkin: { status: confirm, fact: "[CONFIRM]" }
  dark_mode: { status: confirm, fact: "[CONFIRM]" }
  no_ads: { status: missing, fact: "Banner ad in the free version" }  # L34
---

<!-- TODO(Mark): no "sameAs" on the author node yet. /about/ and the site link no X, Instagram, LinkedIn or GitHub profile for Mark. Add it here and on /about/ once one is public. -->

**Full disclosure: I build Recomp, a free progress photo app.** Photo Compare appears in my [roundup](/blog/best-progress-photo-apps/) and my [free options guide](/blog/best-free-progress-photo-apps/), tested with [the same kit](/blog/how-i-test-progress-photo-apps/).

<!-- app-store-card -->

## What it costs {#what-it-costs}

**Free with ads, or Pro after a 3-day free trial at $4.99.** The paywall didn't show the period. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: $4.99 per week, month or year\]</mark> Pro removes ads and adds unlimited saves, overlays and filters, and custom watermarks. AI Enhance and Create Video are also Pro. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: whether free saves carry a watermark\]</mark>

**The free screen carries a banner ad and a "Start Free Trial" bar.** Both sit on the editing screen while you work. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: any full-screen ads\]</mark>

<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone"><mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: screenshot photocompare-editor: Photo Compare editor with a banner ad and Start Free Trial bar. Caption: The free editor, with a banner ad.\]</mark></mark>

## Comparing two photos {#comparing-two-photos}

**The free version compares two photos.** You pick a before and an after, and tools for Shape, Divider, Layout, text and swap style the image. <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: how many photos Pro allows; whether dates or weights can be added beyond the text tool\]</mark>

## Lining photos up {#lining-photos-up}

**Alignment is decent.** <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: how it works, e.g. pinch and drag per photo, and how long one pair took Mark\]</mark>

<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone"><mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[TODO: screenshot photocompare-align: Photo Compare lining up two photos. Caption: Lining up one before/after pair.\]</mark></mark>

## Where your photos live {#where-your-photos-live}

<mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">\[CONFIRM: App Store privacy label, account requirement, storage. Nothing from Mark's test yet.\]</mark>

## The numbers {#the-numbers}

<div aria-label="Photo Compare App Store facts" class="-mx-gutter overflow-x-auto overscroll-x-contain px-gutter" role="region" tabindex="0"><table class="w-max min-w-full border-collapse text-left text-micro">
<thead>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg" scope="col">Field</th>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg" scope="col">Value</th>
</tr>
</thead>
<tbody>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Full name</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Photo Compare Before After <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM: exact listing name]</mark></td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Rating</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">4.49 from 2,626 US ratings (Oct 3, 2026)</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Last updated</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Sep 17, 2026</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Price</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted">Free with ads; Pro $4.99 <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM: period]</mark> after a 3-day trial</td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">Version tested</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted"><mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM]</mark></td>
</tr>
<tr>
<th class="whitespace-nowrap border-b border-card-border px-3 py-2 align-top text-muted" scope="row">App Store</th>
<td class="border-b border-card-border px-3 py-2 align-top text-muted"><mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM: App Store URL]</mark></td>
</tr>
</tbody>
</table></div>

## Who should use something else {#who-should-use-something-else}

**If you take photos every week, a collage tool means rebuilding the image each time.** A dedicated app keeps dates and weights with each check-in. See the [roundup](/blog/best-progress-photo-apps/) or the [free options](/blog/best-free-progress-photo-apps/).

## What I haven't tested yet {#what-i-havent-tested-yet}

**I haven't scored it on the full kit or checked its privacy label.** If you use Photo Compare for weekly progress, email me at [support@progressphotos.app](mailto:support@progressphotos.app).

## My verdict on Photo Compare {#verdict}

<!-- TODO(Mark): verdict in plain words on whether I recommend Photo Compare for progress photos, and for whom. No numeric score. -->

## FAQ {#faq}

<!-- TODO(Mark): questions readers ask about Photo Compare, each as a ### question with its answer. Add every one to the faq frontmatter too, word for word. -->

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
