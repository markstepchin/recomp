---
# Outline skeleton for Mark to write into. draft: true keeps it noindex and out of /blog/, the sitemap and llms.txt.
title: "MacroFactor review: progress photos in a fitness app"
seo_title: "MacroFactor Progress Photos Review (2026) | Recomp"
description: "I tested MacroFactor's progress photo feature with real photos and weights from my own transformation."
tested: October 2026
draft: true
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 1553503471
  name: "MacroFactor - Macro Tracker"
  developer: "Stronger By Science Technologies LLC"
  developer_url: "https://macrofactor.com/"
  rating: 4.8
  rating_count: 23708
  min_ios: "15.6"
  url: "https://apps.apple.com/us/app/macrofactor-macro-tracker/id1553503471"
  icon: "assets/app-icons/macrofactor.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  Each date holds one front, one side and one back photo. You can only adjust a photo in the crop step, before you save it. Every photo is saved square. I didn't find a slider, overlay view or timelapse. MacroFactor doesn't remind you to weigh in or take photos. [TODO: do I recommend MacroFactor for progress photos, and for whom.]
# Meta footer fields. Empty until Mark fills them.
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
  photo_picker: { status: partial, fact: "One slot each for front, side and back" }  # L70, L82
  weight_apple_health: { status: has, fact: "Reads weight from Apple Health, back 30 days when you connect" }  # L70
  weight_quick_entry: { status: confirm, fact: "[CONFIRM]" }
  data_together: { status: has, fact: "Photos sit with up to 21 body metrics" }  # L70
  camera_zoom: { status: confirm, fact: "[CONFIRM]" }
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No auto-align found" }  # L52
  ghost_overlay: { status: missing, fact: "No ghost overlay found" }  # L52
  gridlines: { status: missing, fact: "No posing gridlines; a grid only in the crop step" }  # L52, L54
  manual_align: { status: partial, fact: "Zoom and rotate in the crop step only" }  # L52
  align_in_compare: { status: missing, fact: "Once a photo is saved, it can't be realigned" }  # L52
  # Comparison should be effortless
  compare_speed: { status: confirm, fact: "[CONFIRM]" }
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: partial, fact: "Before and after stacked, one above the other" }  # L60
  slider_view: { status: missing, fact: "No slider view" }  # L60
  overlay_view: { status: missing, fact: "No overlay view" }  # L60
  # The photos are the star
  photo_focus: { status: missing, fact: "Square photos use a small part of the screen" }  # L44
  # Data privacy
  photos_on_device: { status: missing, fact: "Uploaded to its servers on Google Firebase" }  # L74
  privacy_label: { status: missing, fact: "The label lists photos as data linked to you" }  # L74
  # Quality of life
  bulk_import: { status: missing, fact: "One photo at a time, with the date picked by hand" }  # Researched 2026-11-01: https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos
  data_import_export: { status: partial, fact: "Exports weight and metrics; photos aren't mentioned" }  # L74 | L74 has its own [CONFIRM] on photos.
  app_lock: { status: missing, fact: "No app lock or Face ID option found" }  # L80
  backup_transfer: { status: has, fact: "Stored on its servers with your account" }  # L74
  reminders: { status: missing, fact: "No photo or weigh-in reminder" }  # L78
  in_app_camera: { status: missing, fact: "Take Photo opens the phone's camera" }  # L52
  units: { status: has, fact: "Pounds or kilograms" }  # L80
  body_measurements: { status: has, fact: "Up to 21 body metrics" }  # L70
  sharing: { status: has, fact: "Before-and-after share image" }  # L60
  timelapse: { status: missing, fact: "No timelapse" }  # L60
  no_account: { status: missing, fact: "Needs an account" }  # L74
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }
  edit_date: { status: confirm, fact: "[CONFIRM]" }
  partial_checkin: { status: has, fact: "Front, side and back are each optional" }  # Researched 2026-11-01: https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos ('Add more photos if desired')
  dark_mode: { status: has, fact: "Dark mode" }  # L80
  no_ads: { status: has, fact: "No ads; it's subscription only" }  # Researched 2026-11-01: https://macrofactor.com/macrofactor/ ('We will never serve ads')
---

<!-- TODO(Mark): final title, seo_title and description once the verdict is written. Add card_blurb if the /blog/ card needs a shorter line. -->
<!-- TODO(Mark): set "published: YYYY-MM-DD" in the frontmatter and remove draft: true when this is ready. -->

**Full disclosure: I build Recomp, a free progress photo app.**

<!-- app-store-card -->

MacroFactor is one of the 12 apps I've tested so far, and one of three fitness apps with a photo feature I tested alongside the dedicated progress photo apps. I tested it the way I test every app, with real photos and weights from my own transformation. [How I review progress photo apps](/blog/how-i-test-progress-photo-apps/) explains the method.

<!-- TODO(Mark): intro. What MacroFactor is for, what it costs, whether I paid for a subscription, and how many check-ins I added. Notes so far only say it's a fitness app with a photo feature. -->

## Is it a good photo album? {#photo-album}

<!-- TODO(Mark): are the photos the star? How much of the screen do they take, and do the buttons get in their way? How does it handle dozens or hundreds of photos? -->

The gallery keeps every photo in one place and switches between front, side and back from the same day. Each photo shows the body metrics you logged that day. The gallery tints its background and buttons to match the photo on screen. [MacroFactor's body metrics announcement](https://macrofactor.com/body-metrics/).

![MacroFactor Progress Photos list grouped by month from July 2024 to August 2025, each check-in a row of three small thumbnails, with Open Gallery and Compare Before & After buttons](./macrofactor-progress-photos.webp "Progress Photos: check-ins grouped by month."){.phone}

Neither gallery view uses the screen well. The single view shows one square photo with empty space below it. The compare view stacks two small square photos with the weights beside them, so the photos take up a fraction of the screen.

![MacroFactor gallery single view with Front, Side and Back tabs, one square front photo dated October 31, 2026, Trend Weight and Scale Weight of 168.5 lb below it, and a large empty area above the filmstrip](./macrofactor-single-view.webp "Single view: one square photo, then empty space down to the filmstrip."){.phone}

## How does it handle alignment? {#alignment}

<!-- TODO(Mark): ease of alignment, gridline quality, ghost overlay, auto align, and whether I can align in the side by side view. -->

**You can only adjust a photo in the crop step, before you save it.** MacroFactor's help says you can zoom and rotate there. Once a photo is uploaded, I can't edit, resize or align it. <!-- TODO(feature-link): link "align" to Recomp's manual alignment feature page once it exists --> Every photo is saved square. Take Photo launches the phone's camera, and I didn't find a ghost overlay, gridlines for posing or auto-align in MacroFactor's help. <!-- TODO(feature-link): link "ghost overlay" to Recomp's Ghost overlay camera feature page once it exists --> <!-- TODO(feature-link): link "auto-align" to Recomp's Auto-align feature page once it exists --> [How to add progress photos](https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos).

![MacroFactor Crop Photo screen with a grid crop box over a mirror selfie](./macrofactor-crop-photo.webp "The Crop Photo step, before the photo is saved."){.phone}

## How do comparisons and collages work? {#compare}

<!-- TODO(Mark): how easy it is to compare, and the taps and time to compare 9 different dates. Can it make a shareable before/after image or a timelapse? -->

Before and after stacks two photos of the same pose, one above the other. <!-- TODO(feature-link): link "one above the other" to Recomp's Side-by-side comparison feature page once it exists --> You tap the top slot and pick a photo from the ribbon of dates, then do the same for the bottom. The share image can use a plain background or one matched to the photo's colors. I didn't find a slider, overlay view or timelapse. <!-- TODO(feature-link): link "slider" to Recomp's Slider view feature page once it exists --> <!-- TODO(feature-link): link "overlay view" to Recomp's Overlay view feature page once it exists --> <!-- TODO(feature-link): link "timelapse" to Recomp's Timelapse feature page once it exists --> [How to create before-and-after photos](https://help.macrofactorapp.com/en/articles/123-how-to-create-and-share-before-and-after-photos).

![MacroFactor gallery compare view with front photos from October 31, 2026 and August 4, 2025 stacked, each a small square photo on the left with Trend Weight and Scale Weight on the right, and mostly empty space around them](./macrofactor-compare-view.webp "Compare view: two small square photos, with the weights beside them."){.phone}

![MacroFactor gallery with Front, Side and Back tabs showing front photos from May 21, 2024 and August 4, 2025, each with Trend Weight and Scale Weight fields, above a filmstrip](./macrofactor-gallery-trend-weight.webp "The gallery: front photos by date, with Trend Weight and Scale Weight."){.phone}

## How does it handle my data? {#data}

<!-- TODO(Mark): adding a check-in: taps and seconds for a weight and front, side and back photos (great is under 30 seconds). Does it read the date from the photos, import weight from Apple Health, and let me pick all 3 photos in one picker? -->

Each date holds one front, one side and one back photo. They sit next to up to 21 body metrics, from waist and hips to waist-to-height ratio. Weight can come from Apple Health, and connecting it pulls in the last 30 days. You pick a date by hand for older photos. Sources: [How to add progress photos](https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos), [body metrics announcement](https://macrofactor.com/body-metrics/), [Apple Health setup](https://help.macrofactorapp.com/en/articles/65-connect-health-connect-or-apple-health).

<!-- TODO(Mark): privacy: are photos ever sent to a third-party server? Account required? Backup and moving to a new phone, CSV weight import, photo export, Face ID or app lock, app switcher privacy. -->

Photos upload to MacroFactor's servers on Google Firebase. They stay there until you delete them or your account. You need an account to use the app, and the App Store privacy label lists photos as data linked to you. Data Export gives you spreadsheets of weight, nutrition and body metrics, and its help doesn't mention photos. [CONFIRM: photos aren't in the export.] Sources: [MacroFactor's personal data page](https://macrofactor.com/app-personal-data-protection-information/), [Export your data](https://help.macrofactorapp.com/en/articles/68-export-your-data), [App Store listing](https://apps.apple.com/us/app/id1553503471).

<!-- TODO(Mark): any quality-of-life items that matter for MacroFactor (bulk import, reminders, in-app camera, units, body measurements, editing a check-in's date, partial check-ins, dark mode, ads). Fold them into the sections above or below; no separate section or table unless it clearly helps. -->

**MacroFactor doesn't remind you to weigh in or take photos.** The only nudge is a small alert on the Strategy tab when your weekly check-in is due, and you pick the check-in day. That check-in updates calories and macros, not photos. [MacroFactor's check-in help](https://help.macrofactorapp.com/en/articles/247-introduction-to-check-ins-and-coaching-modules).

MacroFactor has dark mode and switches between pounds and kilograms. I didn't find an app lock or Face ID option. Sources: [dark mode](https://help.macrofactorapp.com/en/articles/73-switch-between-dark-and-light-mode), [units](https://help.macrofactorapp.com/en/articles/353-changing-unit-preferences).

![MacroFactor new check-in sheet dated 10/25/2026 with empty Front, Side and Back photo slots and a Save button](./macrofactor-new-check-in.webp "A new check-in: one slot each for front, side and back."){.phone}

![MacroFactor check-in with the Front slot selected and an Upload Photo or Take Photo menu](./macrofactor-add-front-photo.webp "Adding the front photo: upload or take one."){.phone}

## What's good {#whats-good}

<!-- TODO(Mark): what's good. -->

## What's bad {#whats-bad}

<!-- TODO(Mark): what's bad. -->

## Who it's for {#who-its-for}

<!-- TODO(Mark): who I'd recommend it for. -->

## Verdict {#verdict}

<!-- TODO(Mark): qualitative verdict in plain words on whether I recommend it. No numeric score. -->

## FAQ {#faq}

<!-- TODO(Mark): questions readers ask about MacroFactor's progress photos, each as a ### question with its answer. Add every one to the faq frontmatter too, word for word. -->

<!-- scorecard -->
