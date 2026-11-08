---
# Outline skeleton for Mark to write into. draft: true keeps it noindex and out of /blog/, the sitemap and llms.txt.
title: "MacroFactor Progress Photos Review"
seo_title: "MacroFactor Progress Photos Review (2026) | Recomp"
description: "I tested MacroFactor's progress photo feature with real photos and weights from my own transformation."
tested: November 2026
published: 2026-11-08
draft: true
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 1553503471
  name: "MacroFactor - Macro Tracker"
  developer: "Stronger By Science Technologies LLC"
  developer_url: "https://macrofactor.com/"
  price_text: "Subscription required: $11.99/mo, $47.99/6 mo, or $71.99/yr (free trial, no free plan)"
  rating: 4.8
  rating_count: 23708
  min_ios: "15.6"
  url: "https://apps.apple.com/us/app/macrofactor-macro-tracker/id1553503471"
  icon: "assets/app-icons/macrofactor.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  While MacroFactor has photo tracking, it's optimized for tracking macros. It limits you to one front, one side and one back photo per day and doesn't have alignment after saving a photo. For people serious about consistently tracking their progress with photos, we recommend a dedicated app with no image limitations, multiple alignment methods, and better comparison options.
# Meta footer fields. Empty until Mark fills them.
how_tested:
  device: "" # e.g. the iPhone model, from Settings > General > About
  ios: "" # iOS version during the test
  app_version: "" # app version tested, from the App Store page or the app's About screen
  started: "2026-11-01" # YYYY-MM-DD, first day of testing
  ended: "2026-11-01" # YYYY-MM-DD, last day of testing
  checkins: "" # number of check-ins added during the test

# Mark's hand measurements. Leave empty until measured; never estimate.
measurements:
  taps_per_checkin: "" # weight plus front, side and back photos, from the home screen to saved
  seconds_per_checkin: "" # same flow, stopwatch
  import_photo_count: "" # N photos in the bulk import test
  import_seconds: "" # time to import those N photos

scorecard:
  # A check-in should be effortless
  checkin_time: { status: has, fact: "Under a minute and a few taps" }
  photo_picker: {
      status: partial,
      fact: "One slot each for front, side and back",
    } # L70, L82
  weight_apple_health: {
      status: has,
      fact: "Reads weight from Apple Health, back 30 days when you connect",
    } # L70
  weight_quick_entry: {
      status: has,
      fact: "Scale weight via a picker, no typing",
    }
  data_together: {
      status: has,
      fact: "Photos with weight and metrics; no notes",
    } # L70, L180
  camera_zoom: { status: missing, fact: "No zoom in the in-app camera" } # L109
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No auto-align found" } # L52
  ghost_overlay: { status: missing, fact: "No ghost overlay found" } # L52
  gridlines: {
      status: missing,
      fact: "No posing gridlines; a grid only in the crop step",
    } # L52, L54
  manual_align: {
      status: partial,
      fact: "Zoom and rotate in the crop step only",
    } # L52
  align_in_compare: {
      status: missing,
      fact: "Once a photo is saved, it can't be realigned",
    } # L52
  # Comparison should be effortless
  compare_speed: {
      status: has,
      fact: "Filmstrip along the bottom switches dates",
    } # L214
  compare_scale: { status: confirm, fact: "Not tested." }
  side_by_side: {
      status: partial,
      fact: "Before and after stacked, one above the other",
    } # L60
  slider_view: { status: missing, fact: "No slider view" } # L60
  overlay_view: { status: missing, fact: "No overlay view" } # L60
  # The photos are the star
  photo_focus: {
      status: missing,
      fact: "Square photos use a small part of the screen",
    } # L44
  # Data privacy
  photos_on_device: {
      status: missing,
      fact: "Uploaded to its servers on Google Firebase",
    } # L74
  privacy_label: {
      status: missing,
      fact: "The label lists photos as data linked to you",
    } # L74
  # Quality of life
  bulk_import: {
      status: missing,
      fact: "One photo at a time, with the date picked by hand",
    } # Researched 2026-11-01: https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos
  data_import_export: {
      status: partial,
      fact: "Exports weight and metrics; photos aren't mentioned",
    } # L74
  app_lock: { status: missing, fact: "No app lock or Face ID option found" } # L80
  backup_transfer: {
      status: has,
      fact: "Stored on its servers with your account",
    } # L74
  reminders: { status: missing, fact: "No photo or weigh-in reminder" } # L78
  in_app_camera: {
      status: missing,
      fact: "Take Photo opens the phone's camera",
    } # L52
  units: { status: has, fact: "Pounds or kilograms" } # L80
  body_measurements: { status: has, fact: "Up to 21 body metrics" } # L70
  sharing: { status: has, fact: "Before-and-after share image" } # L60
  timelapse: { status: missing, fact: "No timelapse" } # L60
  no_account: { status: missing, fact: "Needs an account" } # L74
  originals_untouched: {
      status: has,
      fact: "Camera-roll originals stay unchanged",
    }
  edit_date: { status: confirm, fact: "Not confirmed." }
  partial_checkin: {
      status: has,
      fact: "Front, side and back are each optional",
    } # Researched 2026-11-01: https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos ('Add more photos if desired')
  dark_mode: { status: has, fact: "Dark mode" } # L80
  no_ads: { status: has, fact: "No ads; it's subscription only" } # Researched 2026-11-01: https://macrofactor.com/macrofactor/ ('We will never serve ads')
---

<!-- app-store-card -->

## Built for macros, not photos {#design-tradeoffs}

If you’re one of the many people who already use MacroFactor, you’re probably wondering if you really need to download and set up a whole new app. And yes, while MacroFactor does have progress photo tracking, it makes multiple tradeoffs to optimize for macros over photo tracking.

Apple’s native apps are a perfect case study for why it makes sense to separate apps that can seem closely related.

- Camera and Photos
- Health and Fitness
- Notes and Numbers

Separating these apps provides a better user experience for each individual use case. We recommend using multiple apps and tools, each designed for a specific use case. At the very least, you need a workout tracker, a calorie tracker, and a progress photo tracker.

## How I test {#how-i-test}

After personally tracking hundreds of progress photos over several years, I have an opinionated philosophy on what's a must-have, what's nice-to-have, and what's fluff. A great progress photo tracker is four apps in one:

1. Photos app / camera roll
2. Great alignment tools for consistent comparisons
3. Collage app with multiple ways to compare your photos over time
4. Weight, measurements, and notes all associated with photos

I test each of these features with my personal library of real progress photos and weight records. See [How I review progress photo apps](/blog/how-i-test-progress-photo-apps/) to learn more.

![iOS Photos album showing hundreds of weekly front, side, and back progress photos from years of coaching check-ins](../../assets/blog/why-i-built-recomp/ios-photos-album-weekly-progress-photos.webp "Years of weekly check-ins, still stuck in my camera roll."){.phone}

## Adding progress data {#adding-data}

### No notifications for tracking {#reminders}

**MacroFactor doesn't remind you to weigh in or take photos.** The only nudge is a small alert on the Strategy tab when your weekly check-in is due, and you pick the check-in day. That check-in updates calories and macros, not photos. [MacroFactor's check-in help](https://help.macrofactorapp.com/en/articles/247-introduction-to-check-ins-and-coaching-modules).

### Photos {#adding-photos}

MacroFactor supports adding photos from your library or taking a new one with the system camera. It doesn't read the date from the photo, so you must edit the date manually if you're adding a photo from a different date.

<div class="phone-row">

![MacroFactor new check-in sheet dated 10/25/2026 with empty Front, Side and Back photo slots and a Save button](./macrofactor-new-check-in.webp "A new check-in: one slot each for front, side and back."){.phone}

![MacroFactor check-in with the Front slot selected and an Upload Photo or Take Photo menu](./macrofactor-add-front-photo.webp "Adding the front photo: upload or take one."){.phone}

</div>

### Weights and measurements {#weights}

Each date holds one front, one side and one back photo. They sit next to up to 21 body metrics, from waist and hips to waist-to-height ratio. Weight can come from Apple Health, and connecting it pulls in the last 30 days. You pick a date by hand for older photos. Sources: [How to add progress photos](https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos), [body metrics announcement](https://macrofactor.com/body-metrics/), [Apple Health setup](https://help.macrofactorapp.com/en/articles/65-connect-health-connect-or-apple-health).

## Alignment {#alignment}

**You can only adjust a photo in the crop step, before you save it.** MacroFactor's help says you can zoom and rotate there. Once a photo is uploaded, it can't be edited, resized or aligned. <!-- TODO(feature-link): link "align" to Recomp's manual alignment feature page once it exists -->

MacroFactor supports **square aspect ratio only** and crops every photo square when you upload it. [How to add progress photos](https://help.macrofactorapp.com/en/articles/121-how-to-add-progress-photos).

<div class="phone-row">

![MacroFactor Crop Photo screen with a grid crop box over a mirror selfie](./macrofactor-crop-photo.webp "The Crop Photo step, before the photo is saved."){.phone}

</div>

## Comparison Features {#compare}

MacroFactor has both single and stacked views for comparison, with a thumbnail strip along the bottom for easy switching. It lacks a full-screen view for a single photo like in the Photos app. It doesn't have a slider view, overlay, or timelapse. <!-- TODO(feature-link): link "slider" to Recomp's Slider view feature page once it exists --> <!-- TODO(feature-link): link "overlay view" to Recomp's Overlay view feature page once it exists --> <!-- TODO(feature-link): link "timelapse" to Recomp's Timelapse feature page once it exists --> [MacroFactor's body metrics announcement](https://macrofactor.com/body-metrics/).

Neither gallery view uses the screen well. The single view shows one square photo with empty space below it. The compare view stacks two small square photos with the weights beside them, so the photos take up a fraction of the screen.

MacroFactor also has a simple before-and-after share feature, with the two photos stacked one above the other. <!-- TODO(feature-link): link "one above the other" to Recomp's Side-by-side comparison feature page once it exists --> [How to create before-and-after photos](https://help.macrofactorapp.com/en/articles/123-how-to-create-and-share-before-and-after-photos).

<div class="phone-row">

![MacroFactor Progress Photos list grouped by month from July 2024 to August 2025, each check-in a row of three small thumbnails, with Open Gallery and Compare Before & After buttons](./macrofactor-progress-photos.webp "Progress Photos: check-ins grouped by month."){.phone}

![MacroFactor gallery single view with Front, Side and Back tabs, one square front photo dated October 31, 2026, Trend Weight and Scale Weight of 168.5 lb below it, and a large empty area above the filmstrip](./macrofactor-single-view.webp "Single view: one square photo, then empty space down to the filmstrip."){.phone}

![MacroFactor gallery compare view with front photos from October 31, 2026 and August 4, 2025 stacked, each a small square photo on the left with Trend Weight and Scale Weight on the right, and mostly empty space around them](./macrofactor-compare-view.webp "Compare view: two small square photos, with the weights beside them."){.phone}

</div>

## Quality of life and privacy {#sharing}

Photos upload to MacroFactor's servers on Google Firebase. They stay there until you delete them or your account. You need an account to use the app, and the App Store privacy label lists photos as data linked to you. Data Export gives you spreadsheets of weight, nutrition and body metrics, and its help doesn't mention photos. Sources: [MacroFactor's personal data page](https://macrofactor.com/app-personal-data-protection-information/), [Export your data](https://help.macrofactorapp.com/en/articles/68-export-your-data), [App Store listing](https://apps.apple.com/us/app/id1553503471).

MacroFactor has dark mode and switches between pounds and kilograms. I didn't find an app lock or Face ID option. Sources: [dark mode](https://help.macrofactorapp.com/en/articles/73-switch-between-dark-and-light-mode), [units](https://help.macrofactorapp.com/en/articles/353-changing-unit-preferences).

<!-- scorecard -->
