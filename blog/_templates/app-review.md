---
# App review template. Copy this file to blog/<slug>/index.md and fill every slot in order.
# Keep the section order. The build skips this folder: it is never rendered, listed or checked.
# TODO comments and [TODO: ...] marks block publishing, so delete each one once its slot is done.

title: "[TODO: App name] Progress Photos Review"
seo_title: "[TODO: App name] Progress Photos, Tested | Recomp"
description: "[TODO: one or two sentences: what you tested and the main finding, under 160 characters]"
tested: "[TODO: Month YYYY you tested it]"
draft: true
template: app-review
breadcrumb: "Best progress photo apps"
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 0 # [TODO: number after "id" in the App Store URL]
  name: "[TODO: listing name, exactly as on the App Store]"
  developer: "[TODO: developer name, exactly as on the App Store]"
  developer_url: "https://[TODO: the developer's own website, not their App Store page]"
  rating: 0 # [TODO: average rating, one decimal]
  rating_count: 0 # [TODO: number of ratings, as a whole number]
  min_ios: "[TODO: minimum iOS version, e.g. 17.0]"
  url: "https://apps.apple.com/us/app/[TODO: listing URL]"
  icon: "assets/app-icons/[TODO: slug].webp" # 192px WebP, downloaded, never hotlinked
  checked: 2026-01-01 # [TODO: date you copied these values]
  price: "0" # [TODO: download price on the US App Store, a plain number like 4.99]
how_tested:
  # Meta footer at the bottom (Device, iOS, Tested, …). A published review needs device, ios, app_version, started and ended.
  device: "" # e.g. the iPhone model
  ios: "" # e.g. 26.1
  app_version: "" # the version you tested
  started: "" # YYYY-MM-DD
  ended: "" # YYYY-MM-DD
  checkins: "" # number of check-ins added during the test
measurements:
  # Your own hand measurements, plain numbers. Leave empty until measured, never a range.
  taps_per_checkin: ""
  seconds_per_checkin: ""
  import_photo_count: ""
  import_seconds: ""
scorecard:
  # One row per criterion in _config/scorecard.js, in that order. status: has, partial, missing or confirm.
  # fact: 3 to 12 plain words, the same claim the body makes. Rows at confirm are left out of a published page.
  # A check-in should be effortless
  checkin_time: { status: confirm, fact: "[CONFIRM]" }
  photo_picker: { status: confirm, fact: "[CONFIRM]" }
  weight_apple_health: { status: confirm, fact: "[CONFIRM]" }
  weight_quick_entry: { status: confirm, fact: "[CONFIRM]" }
  data_together: { status: confirm, fact: "[CONFIRM]" }
  camera_zoom: { status: confirm, fact: "[CONFIRM]" }
  # Alignment should be effortless
  auto_align: { status: confirm, fact: "[CONFIRM]" }
  ghost_overlay: { status: confirm, fact: "[CONFIRM]" }
  gridlines: { status: confirm, fact: "[CONFIRM]" }
  manual_align: { status: confirm, fact: "[CONFIRM]" }
  align_in_compare: { status: confirm, fact: "[CONFIRM]" }
  # Comparison should be effortless
  compare_speed: { status: confirm, fact: "[CONFIRM]" }
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: confirm, fact: "[CONFIRM]" }
  slider_view: { status: confirm, fact: "[CONFIRM]" }
  overlay_view: { status: confirm, fact: "[CONFIRM]" }
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
  sharing: { status: confirm, fact: "[CONFIRM]" }
  timelapse: { status: confirm, fact: "[CONFIRM]" }
  no_account: { status: confirm, fact: "[CONFIRM]" }
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }
  edit_date: { status: confirm, fact: "[CONFIRM]" }
  partial_checkin: { status: confirm, fact: "[CONFIRM]" }
  dark_mode: { status: confirm, fact: "[CONFIRM]" }
  no_ads: { status: confirm, fact: "[CONFIRM]" }
summary: |
  [TODO: 2 to 4 sentences with the main findings. Only facts the article states.]
faq:
  # Same questions and answers as the FAQ section in the body. Change both together.
  - q: "[TODO: a question readers search for]"
    a: "[TODO: a short, direct answer]"
---

**Full disclosure: I build Recomp, a free progress photo app.**

<!-- app-store-card -->

<!-- TODO opening: what the app is, how it fits the apps you've tested, and how you tested it (your own photos and weights). One paragraph. -->

## [TODO: first thing a user meets, e.g. setup or reminders] {#todo-first}

<!-- TODO sections: one H2 per step of using the app, in the order a user meets them (reminders, adding photos and weights, alignment, comparing, quality of life and privacy). Start each with a bold one-sentence finding, then the details. -->

## [TODO: next step] {#todo-next}

<!-- TODO: add or remove sections as needed; keep the story order and give each a short {#id}. -->

## My verdict on [TODO: App name]'s progress photos {#verdict}

<!-- TODO verdict: who it suits and who should use something else, in a few sentences. -->

## FAQ {#faq}

### [TODO: same question as the first faq item in the frontmatter] {#faq-todo}

[TODO: same answer as in the frontmatter]

<!-- scorecard -->
