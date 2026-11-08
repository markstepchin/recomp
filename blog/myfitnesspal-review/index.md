---
# Outline skeleton for Mark to write into. draft: true keeps it noindex and out of /blog/, the sitemap and llms.txt.
title: "MyFitnessPal Progress Photos Review"
seo_title: "MyFitnessPal Progress Photos Review (2026) | Recomp"
description: "I tested MyFitnessPal's progress photo feature with real photos and weights from my own transformation."
tested: November 2026
published: 2026-11-08
draft: true
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 341232718
  name: "MyFitnessPal: Calorie Counter"
  developer: "MyFitnessPal, Inc."
  developer_url: "https://www.myfitnesspal.com/"
  price_text: "Free, Premium $19.99/mo, $79.99/yr"
  rating: 4.7
  rating_count: 2387079
  min_ios: "18.0"
  url: "https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718"
  icon: "assets/app-icons/myfitnesspal.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  While MyFitnessPal has photo tracking, it's optimized for tracking calories. It limits you to one photo per day and doesn't have alignment tools. For people serious about consistently tracking their progress with photos, we recommend a dedicated app with no image limitations, multiple alignment methods, and better comparison options.
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
  photo_picker: { status: missing, fact: "One photo per date" } # L60
  weight_apple_health: {
      status: partial,
      fact: "Two-way Apple Health sync, only from the day you connect",
    } # L62
  weight_quick_entry: {
      status: has,
      fact: "Numeric keypad for manual weight entry",
    }
  data_together: { status: has, fact: "Each photo attaches to a weigh-in" } # L40
  camera_zoom: { status: missing, fact: "In-app camera has no zoom" }
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No auto-align" } # L46
  ghost_overlay: { status: missing, fact: "No ghost overlay" } # L46
  gridlines: { status: missing, fact: "No gridlines" } # L46
  manual_align: {
      status: missing,
      fact: "No alignment tools; every photo is cropped square",
    } # L46
  align_in_compare: { status: missing, fact: "No alignment tools" } # L46
  # Comparison should be effortless
  compare_speed: { status: has, fact: "Scroll bar with photos" }
  compare_scale: { status: confirm, fact: "Not tested." }
  side_by_side: {
      status: has,
      fact: "Two photos side by side with their weights",
    } # L52, L54
  slider_view: { status: missing, fact: "No slider view" } # L52
  overlay_view: { status: missing, fact: "No overlay view" } # L52
  # The photos are the star
  photo_focus:
    { status: partial, fact: "No fullscreen view; zoom and pan aren't saved" }
  # Data privacy
  photos_on_device: { status: missing, fact: "Saved to its servers" } # L66
  privacy_label: {
      status: missing,
      fact: "The label lists data used to track you",
    } # L66
  # Quality of life
  bulk_import: {
      status: missing,
      fact: "One photo per weigh-in, added one at a time",
    } # Researched 2026-11-01: https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs
  data_import_export: {
      status: partial,
      fact: "CSV export with Premium, no photos",
    } # L66
  app_lock: { status: missing, fact: "None" }
  backup_transfer: {
      status: has,
      fact: "On its servers, so photos show up on a new phone",
    } # L66
  reminders: {
      status: partial,
      fact: "Meal and weight reminders; no dedicated photo reminder",
    }
  in_app_camera: {
      status: partial,
      fact: "Takes photos in the app, with no overlay or guides",
    } # L40, L46
  units: { status: has, fact: "Pounds or kilograms, with no Premium needed" } # Researched 2026-11-01: https://support.myfitnesspal.com/hc/en-us/articles/360032623891-How-to-change-your-preferred-units-of-measure
  body_measurements: {
      status: partial,
      fact: "Waist, hips and neck built in; others on the website",
    } # L62
  sharing: { status: has, fact: "Shares a split before/after photo" } # L52
  timelapse: { status: missing, fact: "No timelapse" } # L52
  no_account: { status: missing, fact: "Needs an account" } # L66
  originals_untouched: { status: has, fact: "Confirmed" } # In-app photos aren't saved to the camera roll (L40); that's a different question.
  edit_date: { status: has, fact: "You can edit a weigh-in's date" } # L74
  partial_checkin: {
      status: partial,
      fact: "A weigh-in saves without a photo, but a photo needs a weigh-in",
    } # Researched 2026-11-01: https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs
  dark_mode: { status: has, fact: "Confirmed" }
  no_ads: { status: missing, fact: "Has ads; ad-free needs Premium" } # L72
---

<!-- app-store-card -->

## Built for calories, not photos {#design-tradeoffs}

If you’re one of the many people who already use MyFitnessPal, you’re probably wondering if you really need to download and set up a whole new app. And yes, while MyFitnessPal does have progress photo tracking, it makes multiple tradeoffs to optimize for calories over photo tracking.

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

### Weight reminders {#reminders}

**MyFitnessPal lets you set a reminder to log your weight. You can attach one progress photo to each weigh-in.** Sources: [logging reminders](https://support.myfitnesspal.com/hc/en-us/articles/360032622391-How-to-set-up-logging-reminders), [how often to weigh in](https://support.myfitnesspal.com/hc/en-us/articles/360032272992-How-often-should-I-record-my-weight-and-other-measurements).

### Photos {#adding-photos}

**MyFitnessPal is built around tracking weight, and photos are an add-on.** You add a weight record under More > Weight & Measurements and can attach a photo to it. Photos taken in the app aren't saved to your camera roll. The in-app camera has no zoom. [MyFitnessPal's progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs).

**Since photos attach to weigh-ins, MyFitnessPal keeps only one photo per date.** This makes it impossible to track multiple angles, such as front, side and back photos on the same day.

### Weights and measurements {#weights}

Weight syncs both ways with Apple Health, but only from the day you connect. Older Health weigh-ins don't come over. Waist, hips, neck and weight are built in. Anything else, like body fat or thighs, has to be added on the website first, with one value per measurement per day. Sources: [Apple Health syncing](https://support.myfitnesspal.com/hc/en-us/articles/360032271092-Apple-Health-connection-and-syncing), [additional measurements](https://support.myfitnesspal.com/hc/en-us/articles/360032624891-Can-I-track-additional-measurements-or-change-the-default-measurements).

<div class="phone-row">

![MyFitnessPal Measurements screen for Weight over 1 Month with a chart from 155 to 165 lbs, an entries list, and a Go Premium banner for ad-free tracking](./myfitnesspal-measurements-chart.webp "Weight chart and entries, with an ad-free Premium upsell."){.phone}

![MyFitnessPal Log weight screen showing 165 lbs, date Today, and a Progress Photo with Edit](./myfitnesspal-log-weight-with-photo.webp "Logging a weight with a progress photo attached."){.phone}

![MyFitnessPal Edit weight screen showing 155 lbs with a Change date picker set to August 4, 2025](./myfitnesspal-edit-weight-date.webp "Editing a weigh-in's date."){.phone}

![MyFitnessPal Reminders list with meal reminders and a weight reminder set to weekly on Sundays at 12:18 PM](./myfitnesspal-reminders.webp "Weight tracking reminder"){.phone}

![MyFitnessPal Edit Reminder screen for weight, set to weekly on Sunday at 12:18 PM](./myfitnesspal-edit-weight-reminder.webp "Setting the weight reminder's day and time."){.phone}

</div>

## Alignment {#alignment}

**MyFitnessPal has no alignment options.** There's no overlay, gridlines or auto-align, and no way to adjust a photo after you add it.

MyFitnessPal supports **square aspect ratio only** and crops every photo square when you upload it. [progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs).

## Comparison Features {#compare}

MyFitnessPal has both single and side-by-side views for comparison, with a thumbnail strip along the bottom for easy switching. It lacks a full-screen view for a single photo like in the Photos app. It doesn't have a slider view, overlay, or timelapse. <!-- TODO(feature-link): link "slider" to Recomp's Slider view feature page once it exists --> <!-- TODO(feature-link): link "overlay view" to Recomp's Overlay view feature page once it exists --> <!-- TODO(feature-link): link "timelapse" to Recomp's Timelapse feature page once it exists -->

You can zoom and pan in the small viewer, but those adjustments aren't saved.

You can share a single photo or side-by-side view, along with a message, directly to Instagram or Facebook. [progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs).

<div class="phone-row">

![MyFitnessPal Progress Gallery with two front photos side by side labeled 160 lbs and 155 lbs, above a strip of thumbnails](./myfitnesspal-progress-gallery.webp "Progress Gallery: two photos side by side with their weights."){.phone}

![MyFitnessPal Progress Gallery showing one photo at 159 lbs on Oct 15, 2024, above a strip of thumbnails](./myfitnesspal-progress-gallery-single.webp "Progress Gallery: one photo with the thumbnail strip."){.phone}

![MyFitnessPal Customize screen with two progress photos side by side and the caption Gained 1 pound!](./myfitnesspal-customize-share.webp "Share card: two photos side by side."){.phone}

</div>

## Quality of life and privacy {#sharing}

Photos are saved to your MyFitnessPal account on its servers, which is how they show up on a new phone. You need an account. The App Store privacy label lists identifiers and usage data used to track you across other companies' apps, plus data for third-party advertising. Data Export requires Premium. It emails a zip of three CSVs, including weight and measurements, and no photos. Sources: [progress photos FAQ](https://support.myfitnesspal.com/hc/en-us/articles/360032625271-Progress-Photos-FAQs), [data export](https://support.myfitnesspal.com/hc/en-us/articles/360032273352-Export-your-nutrition-progress-and-exercise-data), [App Store listing](https://apps.apple.com/us/app/id341232718).

MyFitnessPal has ads. Ad-free tracking needs Premium.

<!-- scorecard -->
