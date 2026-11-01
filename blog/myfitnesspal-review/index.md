---
# Outline skeleton for Mark to write into. draft: true keeps it noindex and out of /blog/, the sitemap and llms.txt.
title: "MyFitnessPal review: progress photos in a fitness app"
seo_title: "MyFitnessPal Progress Photos Review (2026) | Recomp"
description: "I tested MyFitnessPal's progress photo feature with real photos and weights from my own transformation."
tested: October 2026
draft: true
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 341232718
  name: "MyFitnessPal: Calorie Counter"
  developer: "MyFitnessPal, Inc."
  developer_url: "https://www.myfitnesspal.com/"
  rating: 4.7
  rating_count: 2387079
  min_ios: "18.0"
  url: "https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718"
  icon: "assets/app-icons/myfitnesspal.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  MyFitnessPal is built around tracking weight, and photos are an add-on. MyFitnessPal has no alignment tools. Since photos attach to weigh-ins, MyFitnessPal keeps only one photo per date. MyFitnessPal's reminders are for meals, not photos or weigh-ins. [TODO: do I recommend MyFitnessPal for progress photos, and for whom.]
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
  photo_picker: { status: missing, fact: "One photo per date" }  # L60
  weight_apple_health: { status: partial, fact: "Two-way Apple Health sync, only from the day you connect" }  # L62
  weight_quick_entry: { status: confirm, fact: "[CONFIRM]" }
  data_together: { status: has, fact: "Each photo attaches to a weigh-in" }  # L40
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No auto-align" }  # L46
  ghost_overlay: { status: missing, fact: "No ghost overlay" }  # L46
  gridlines: { status: missing, fact: "No gridlines" }  # L46
  manual_align: { status: missing, fact: "No alignment tools; every photo is cropped square" }  # L46
  align_in_compare: { status: missing, fact: "No alignment tools" }  # L46
  # Comparison should be effortless
  compare_speed: { status: confirm, fact: "[CONFIRM]" }
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: has, fact: "Two photos side by side with their weights" }  # L52, L54
  slider_view: { status: missing, fact: "No slider view" }  # L52
  overlay_view: { status: missing, fact: "No overlay view" }  # L52
  # The photos are the star
  photo_focus: { status: confirm, fact: "[CONFIRM]" }
  # Data privacy
  photos_on_device: { status: missing, fact: "Saved to its servers" }  # L66
  privacy_label: { status: missing, fact: "The label lists data used to track you" }  # L66
  # Quality of life
  bulk_import: { status: confirm, fact: "[CONFIRM]" }
  data_import_export: { status: partial, fact: "CSV export with Premium, no photos" }  # L66
  app_lock: { status: confirm, fact: "[CONFIRM]" }
  backup_transfer: { status: has, fact: "On its servers, so photos show up on a new phone" }  # L66
  reminders: { status: missing, fact: "Meal reminders only" }  # L70 | L70 carries a [CONFIRM] on a weigh-in reminder.
  in_app_camera: { status: partial, fact: "Takes photos in the app, with no overlay or guides" }  # L40, L46
  units: { status: confirm, fact: "[CONFIRM]" }
  body_measurements: { status: partial, fact: "Waist, hips and neck built in; others on the website" }  # L62
  sharing: { status: has, fact: "Shares a split before/after photo" }  # L52
  timelapse: { status: missing, fact: "No timelapse" }  # L52
  no_account: { status: missing, fact: "Needs an account" }  # L66
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }  # In-app photos aren't saved to the camera roll (L40); that's a different question.
  edit_date: { status: has, fact: "You can edit a weigh-in's date" }  # L74
  partial_checkin: { status: confirm, fact: "[CONFIRM]" }
  dark_mode: { status: confirm, fact: "[CONFIRM]" }
  no_ads: { status: missing, fact: "Ad-free needs Premium" }  # L72 | Based on the 'Go Premium for ad-free' screenshot alt text. Mark to confirm wording.
---

<!-- TODO(Mark): final title, seo_title and description once the verdict is written. Add card_blurb if the /blog/ card needs a shorter line. -->
<!-- TODO(Mark): set "published: YYYY-MM-DD" in the frontmatter and remove draft: true when this is ready. -->

**Full disclosure: I build Recomp, a free progress photo app.**

<!-- app-store-card -->

MyFitnessPal is one of the 12 apps I've tested so far, and one of three fitness apps with a photo feature I tested alongside the dedicated progress photo apps. I tested it the way I test every app, with real photos and weights from my own transformation. [How I review progress photo apps](/blog/how-i-test-progress-photo-apps/) explains the method.

<!-- TODO(Mark): intro. What MyFitnessPal is for, what it costs, whether I paid for a subscription, and how many check-ins I added. Notes so far only say it's a fitness app with a photo feature. -->

## Is it a good photo album? {#photo-album}

<!-- TODO(Mark): are the photos the star? How much of the screen do they take, and do the buttons get in their way? How does it handle dozens or hundreds of photos? -->

**MyFitnessPal is built around tracking weight, and photos are an add-on.** You add a weight record under More > Weight & Measurements and can attach a photo to it. Photos taken in the app aren't saved to your camera roll. Source: [MyFitnessPal's progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs).

## How does it handle alignment? {#alignment}

<!-- TODO(Mark): ease of alignment, gridline quality, ghost overlay, auto align, and whether I can align in the side by side view. -->

**MyFitnessPal has no alignment tools.** There's no overlay, gridlines or auto-align, and no way to adjust a photo after you add it. It crops every photo square when you upload it, so anything outside the center gets cut. Source: [progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs).

## How do comparisons and collages work? {#compare}

<!-- TODO(Mark): how easy it is to compare, and the taps and time to compare 9 different dates. Can it make a shareable before/after image or a timelapse? -->

Sharing works from any photo in the Entries list. You can swipe between photos, add a message and save a split photo or send it to Instagram or Facebook. I didn't find a slider, overlay view or timelapse. Source: [progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs).

![MyFitnessPal Progress Gallery with two front photos side by side labeled 160 lbs and 155 lbs, above a strip of thumbnails](./myfitnesspal-progress-gallery.webp "Progress Gallery: two photos side by side with their weights."){.phone}

## How does it handle my data? {#data}

<!-- TODO(Mark): adding a check-in: taps and seconds for a weight and front, side and back photos (great is under 30 seconds). Does it read the date from the photos, import weight from Apple Health, and let me pick all 3 photos in one picker? -->

**Since photos attach to weigh-ins, MyFitnessPal keeps only one photo per date.** I can't keep a front, side and back photo for the same day.

Weight syncs both ways with Apple Health, but only from the day you connect. Older Health weigh-ins don't come over. Waist, hips, neck and weight are built in. Anything else, like body fat or thighs, has to be added on the website first, with one value per measurement per day. Sources: [Apple Health syncing](https://support.myfitnesspal.com/hc/en-us/articles/360032271092-Apple-Health-connection-and-syncing), [additional measurements](https://support.myfitnesspal.com/hc/en-us/articles/360032624891-Can-I-track-additional-measurements-or-change-the-default-measurements).

<!-- TODO(Mark): privacy: are photos ever sent to a third-party server? Account required? Backup and moving to a new phone, CSV weight import, photo export, Face ID or app lock, app switcher privacy. -->

Photos are saved to your MyFitnessPal account on its servers, which is how they show up on a new phone. You need an account. The App Store privacy label lists identifiers and usage data used to track you across other companies' apps, plus data for third-party advertising. Data Export is Premium only. It emails a zip of three CSVs, including weight and measurements, and no photos. Sources: [progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs), [data export](https://support.myfitnesspal.com/hc/en-us/articles/360032273352-Export-your-nutrition-progress-and-exercise-data), [App Store listing](https://apps.apple.com/us/app/id341232718).

<!-- TODO(Mark): any quality-of-life items that matter for MyFitnessPal (bulk import, reminders, in-app camera, units, body measurements, editing a check-in's date, partial check-ins, dark mode, ads). Fold them into the sections above or below; no separate section or table unless it clearly helps. -->

**MyFitnessPal's reminders are for meals, not photos or weigh-ins.** Each one fires if you haven't logged a chosen meal by a set time. Its help recommends weighing in once a week, but I didn't find a reminder for it. [CONFIRM: in Profile > Reminders > +, is there a weigh-in option?] Sources: [logging reminders](https://support.myfitnesspal.com/hc/en-us/articles/360032622391-How-to-set-up-logging-reminders), [how often to weigh in](https://support.myfitnesspal.com/hc/en-us/articles/360032272992-How-often-should-I-record-my-weight-and-other-measurements).

![MyFitnessPal Measurements screen for Weight over 1 Month with no data yet and a Go Premium banner for ad-free tracking](./myfitnesspal-measurements.webp "Measurements before any weigh-ins, with a Premium upsell."){.phone}

![MyFitnessPal Edit weight screen showing 155 lbs with a Change date picker set to August 4, 2025](./myfitnesspal-edit-weight-date.webp "Editing a weigh-in's date."){.phone}

## What's good {#whats-good}

<!-- TODO(Mark): what's good. -->

## What's bad {#whats-bad}

<!-- TODO(Mark): what's bad. -->

## Who it's for {#who-its-for}

<!-- TODO(Mark): who I'd recommend it for. -->

## Verdict {#verdict}

<!-- TODO(Mark): qualitative verdict in plain words on whether I recommend it. No numeric score. -->

## FAQ {#faq}

<!-- TODO(Mark): questions readers ask about MyFitnessPal's progress photos, each as a ### question with its answer. Add every one to the faq frontmatter too, word for word. -->

<!-- scorecard -->

---

Published: [CONFIRM: publish date]

Tested: October 2026 {#when-tested}

<!-- TODO(Mark): confirm the test month and app version. -->

Questions or corrections: support@progressphotos.app
