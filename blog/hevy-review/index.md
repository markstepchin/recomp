---
# Outline skeleton for Mark to write into. draft: true keeps it noindex and out of /blog/, the sitemap and llms.txt.

title: "Hevy Progress Photos Review"
seo_title: "Hevy Progress Photos and Measurements, Tested | Recomp"
description: "I tested Hevy's progress photos, overlay camera, side-by-side compare and measurements. It works for one weekly photo, but allows only one photo a day."
tested: October 2026
draft: true
breadcrumb: "Best progress photo apps"
template: app-review
app_store:
  # Copied from the US App Store listing on the date in checked. Update all values together.
  id: 1458862350
  name: "Hevy - Workout Tracker Gym Log"
  developer: "Hevy Studios S.L."
  developer_url: "https://www.hevyapp.com/"
  price_text: "Free, or Pro for $2.99 a month, $23.99 a year or $74.99 once"
  rating: 4.9
  rating_count: 101232
  min_ios: "15.1"
  url: "https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350"
  icon: "assets/app-icons/hevy.webp"
  checked: 2026-11-01
  price: "0"
summary: |
  Hevy is a workout tracker with progress photos built in, under Profile > Measures. It has an overlay in the in-app camera, side-by-side comparisons, and photos stored next to your weight and measurements. It allows only one photo per day, so you can't keep front, side and back photos under the same date. Alignment happens only while you add a photo, and there's no auto-align. Fixing a photo later means deleting it and adding it again.
faq:
  - q: "Can you add front, side and back photos on the same day in Hevy?"
    a: "No. Hevy allows one progress photo per day."
  - q: "Can other people see my Hevy progress photos?"
    a: "No. Photos in Measures stay private even with a public profile. Photos or videos you attach to a workout are visible."
  - q: "Are Hevy body measurements free?"
    a: "Weight and waist are free. Body fat and the other measurements need Hevy Pro."
  - q: "Can you export progress photos from Hevy?"
    a: "Hevy exports measurements as a CSV. Photos aren't in the export."
  - q: "Does Hevy remind you to take progress photos?"
    a: "No. Hevy's notifications cover workouts and social activity, not progress photos or weigh-ins."
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
  checkin_time: { status: confirm, fact: "[CONFIRM]" }  # Not measured yet. Fill measurements.taps_per_checkin / seconds_per_checkin.
  photo_picker: { status: missing, fact: "One photo per day, so front, side and back can't share a date" }  # L72
  weight_apple_health: { status: confirm, fact: "[CONFIRM]" }  # Review says weight is typed in by hand and no Apple Health read was found, but L84 carries its own [CONFIRM].
  weight_quick_entry: { status: missing, fact: "Every weigh-in is typed in by hand" }  # L84
  data_together: { status: has, fact: "Each photo sits with your weight and measurements" }  # L84
  camera_zoom: { status: missing, fact: "The in-app camera has no zoom" }
  # Alignment should be effortless
  auto_align: { status: missing, fact: "No auto-align" }  # L100
  ghost_overlay: { status: partial, fact: "Ghost overlay in the in-app camera only, not for camera roll photos" }  # L74, L78, L100
  gridlines: { status: partial, fact: "A 3:4 crop grid while you transform the photo" }  # L102, L104
  manual_align: { status: partial, fact: "Camera roll photos only, before saving; none for in-app shots" }  # L80, L98
  align_in_compare: { status: confirm, fact: "[CONFIRM]" }  # CONFLICT in the review: L100 says 'no side-by-side alignment', L120 says you can manually align two photos in the compare view but it isn't saved. Mark to settle before publish.
  # Comparison should be effortless
  compare_speed: { status: confirm, fact: "[CONFIRM]" }  # Not measured yet.
  compare_scale: { status: confirm, fact: "[CONFIRM]" }  # Not tested with hundreds of photos in the review.
  side_by_side: { status: has, fact: "Two photos side by side, edge to edge" }  # L110
  slider_view: { status: missing, fact: "No slider view" }  # L122
  overlay_view: { status: missing, fact: "No overlay view" }  # L122
  # The photos are the star
  photo_focus: { status: partial, fact: "Single photos leave space; side by side fills the width" }  # L108, L110
  # Data privacy
  photos_on_device: { status: missing, fact: "Uploaded to Hevy's servers" }  # L128
  privacy_label: { status: partial, fact: "The label doesn't list photos, but its help says they're on its servers" }  # L128
  # Quality of life
  bulk_import: { status: confirm, fact: "[CONFIRM]" }  # Known: Hevy doesn't read the date from a camera roll photo (L78). Bulk import itself isn't covered.
  data_import_export: { status: partial, fact: "Measurements export as a CSV, photos don't" }  # L134
  app_lock: { status: missing, fact: "No app lock found" }  # L132
  backup_transfer: { status: has, fact: "Stored on Hevy's servers, so a reinstall keeps them" }  # L128
  reminders: { status: missing, fact: "No photo or weigh-in reminder" }  # L66
  in_app_camera: { status: has, fact: "In-app camera with a ghost overlay and a timer" }  # L74, L76 | Pose guides not covered in the review.
  units: { status: confirm, fact: "[CONFIRM]" }
  body_measurements: { status: partial, fact: "Weight and waist are free; the rest need Pro" }  # L86
  sharing: { status: has, fact: "Shares two dates side by side as an image" }  # L122
  timelapse: { status: missing, fact: "No timelapse" }  # L122
  no_account: { status: missing, fact: "Needs a Hevy account" }  # L128
  originals_untouched: { status: confirm, fact: "[CONFIRM]" }
  edit_date: { status: confirm, fact: "[CONFIRM]" }  # You set the date when you add a photo (L78); editing later isn't covered.
  partial_checkin: { status: confirm, fact: "[CONFIRM]" }  # One photo per day (L72), so a partial check-in is the only option. Mark to decide how to state it.
  dark_mode: { status: has, fact: "Dark theme" }  # L132
  no_ads: { status: confirm, fact: "[CONFIRM]" }  # Review doesn't say whether Hevy shows ads.
---

**Full disclosure: I build Recomp, a free progress photo app.**

<!-- app-store-card -->

Hevy is one of the 12 apps I've tested so far, and one of three fitness apps with a photo feature I tested alongside the dedicated progress photo apps. I tested it the way I test every app, with real photos and weights from my own transformation. [How I review progress photo apps](/blog/how-i-test-progress-photo-apps/) explains the method.

## Built for workouts, not photos {#design-tradeoffs}

<!-- TODO: outline, write into prose -->

1. Hevy is one of the best and most popular workout trackers.
2. Every design decision in Hevy serves workout tracking. That's the app's priority.
3. Photo and weight tracking aren't a priority.
4. Designing an app means making trade-offs.
5. If you optimize for workout tracking, you can't also optimize for photo tracking.
6. Apple's own apps show this. Calendar, Reminders, Photos, Calculator, Notes and Health are all separate apps.
7. Each of those apps is optimized for a different job, and that's why Apple split them up.
8. Apple could combine them into one app. Separate apps are just much more usable.

Apple keeps each pair separate because each app is optimized for a different job:

- Camera and Photos both handle your pictures.
- Health and Fitness both track your body. It could combine them into one app. They're just much easier to use apart.
- Notes and Numbers are both pages you type into.

A progress photo app is really four apps in one: a camera roll, an alignment app, a collage app for comparisons, and a data app that keeps photos with your weight and measurements. Hevy is a workout tracker first, and its photos live under Profile > Measures. Here's how each of the four holds up through a normal weekly check-in.

## Adding your progress data {#adding-data}

### The morning reminder {#reminders}

**Hevy doesn't remind you to take progress photos or weigh in.** Its notification settings cover the rest timer, new followers, the monthly training report, emails, likes and comments. None of them is for photos, weight or measurements, so the weekly check-in reminder has to come from your own calendar. [Hevy's notification settings](https://help.hevyapp.com/hc/en-us/articles/33845807003671-Account-Settings-Preferences-Profile-Information-Adjust-username-password-or-email-address-Notifications).

### Adding photos {#adding-photos}

**Hevy allows only one photo per day, so front, side and back can't share a date.** Hevy's own suggestion is to spread the set over three days in a row, one photo per day. [Hevy's progress photos page](https://www.hevyapp.com/features/progress-photos/).

**From the camera roll.** Picking an existing photo works, but Hevy doesn't read the date from the photo. You set each photo's date by hand, so importing an old photo means typing in when you took it. Unlike the in-app camera, there's no overlay here.

For camera roll photos, you can crop, rotate, pan and zoom before saving. That's the only chance you get. Photos from the in-app camera can't be aligned at all after you take the shot, and the alignment tools aren't consistent between the camera and the camera roll. The next section covers why.

### Weights and measurements {#weights}

**Each photo sits next to your weight and measurements, which is what a data app should do.** Hevy's Apple Health help only covers sending workouts to Health. I didn't find a way to read weight from a smart scale, so every weigh-in is typed in by hand. [CONFIRM: in iPhone Settings > Health > Data Access & Devices > Hevy, is there a read permission for Body Mass?] [Hevy's Apple Health help](https://help.hevyapp.com/hc/en-us/sections/36957443687831-Apple-Health).

Weight and waist are free. Body fat and the other measurements need Hevy Pro.

<div class="phone-row">

![Hevy Log Measurements screen dated 1 November 2026 with an empty Add Picture box, and a sheet at the bottom offering Take Photo or Select Library Photo](./hevy-add-picture.webp "Add Picture: take a photo in the app or pick one from your library."){.phone}

![Hevy Log Measurements screen dated 30 October 2026 with one progress picture, then Body Weight and Waist fields open to fill in and Body Fat and the measurements below it showing a lock icon](./hevy-log-measurements.webp "Log Measurements: one progress picture, and weight and waist are free."){.phone}

![Hevy Log Measurements screen scrolled down, with Body Fat, Lean Body Mass, Neck, Shoulder, Chest, biceps, forearms, Abdomen, Hips, thighs and calves all showing a lock icon](./hevy-locked-measurements.webp "The rest of the measurements are locked."){.phone}

![Hevy Health Access sheet with Allow Hevy to write listing Active Energy, Body Fat Percentage, Lean Body Mass, Waist Circumference, Weight (turned on) and Workouts, then Allow Hevy to read starting with Active Energy, Body Fat Percentage, Date of Birth and Heart Rate](./hevy-health-access.webp "Health Access: Hevy can write your weight to Apple Health."){.phone}

</div>

## Alignment {#alignment}

**There's no alignment after you add a photo.** Once the check-in is saved, there's no way to adjust it. If the alignment is off, you have to delete the photo and retake or re-upload it. If you took it with the in-app camera, there's no going back: you're locked in, and you may only notice the problem weeks later. [CONFIRM: Hevy's help article mentions "replace it". Does that let you realign without losing the entry?]

There's also no auto-align, no side-by-side alignment, and no overlay when you pick a photo from the camera roll.

What Hevy does have: the in-app camera's overlay, and a Transform step with crop, rotate, pan and zoom before you save a camera roll photo. In-app camera shots skip that step, so there's no alignment after you snap the photo.

**In-app camera overlay.** The camera shows a faded ghost of your last photo over the live view, so you can match your pose and distance to last week. The camera has no zoom.

<div class="phone-row">

![Hevy in-app camera with Overlay turned on, showing a faded ghost of the previous progress photo over the live view, with Timer and Overlay buttons beside the shutter](./hevy-camera-overlay.webp "The in-app camera with Overlay on."){.phone}

![Hevy Transform screen cropping a progress photo at 3:4 with a grid overlay and a rotation dial](./hevy-crop-grid.webp "Transform: a 3:4 crop with a grid and rotation dial."){.phone}

</div>

## Comparing with last month {#compare}

**The single view doesn't let the photos go edge to edge.** The photo sits between grey bars and doesn't fill the width, and there's no full-screen photo viewer.

The side-by-side view is better. Both photos fill the screen edge to edge.

<div class="phone-row">

![Hevy Progress Pictures screen in Single mode showing a photo from 4 Aug 2025 at 155 lbs with grey bars on both sides, above a filmstrip of three check-ins](./hevy-single-view.webp "Progress Pictures, Single mode. The photo doesn't fill the width."){.phone}

![Hevy Progress Pictures screen in Comparison mode with photos from 10 Oct 2024 and 4 Aug 2025 side by side above a filmstrip of check-ins](./hevy-comparison.webp "Progress Pictures, Comparison mode, with the filmstrip below."){.phone}

</div>

Alignment comes up again here. You can manually align two photos in the compare view, but the alignment isn't saved, so next week you start over.

For sharing, you pick two dates and share them side by side as an image. There's no slider, no overlay view and no timelapse, and you can't adjust alignment in the share view.

![Hevy share card with photos from 10 Oct 2024 and 4 Aug 2025 side by side, the Hevy logo and Instagram Stories, More and Download buttons](./hevy-share-card.webp "The share card it makes from a comparison."){.phone}

## Quality of life and privacy {#sharing}

**Your photos are uploaded to Hevy's servers, not kept on your phone.** Hevy's help says everything is stored to your profile on its servers, which is why reinstalling the app doesn't lose them and why you need an account. Hevy's App Store privacy label doesn't list photos among the data it collects. [Hevy's help on reinstalling](https://help.hevyapp.com/hc/en-us/articles/38223672272791-What-will-happen-to-my-information-if-I-uninstall-and-reinstall-the-Hevy-app) and the [App Store listing](https://apps.apple.com/us/app/id1458862350).

Photos in Measures stay private even if your profile is public. Photos or videos you attach to a shared workout are different, and other people can see them. If you use Hevy's social side, know which one you're posting. Sources: [Hevy's help article on measurements and progress photos](https://help.hevyapp.com/hc/en-us/articles/35385479603479-Body-Composition-Tracking-Measurements-and-Progress-Photos) and [Hevy's progress photos feature page](https://www.hevyapp.com/features/progress-photos/).

Hevy has a dark theme. I didn't find an app lock or Face ID option in its help, so hiding the photos means using iOS's own Require Face ID on the app icon. [Hevy's theme setting](https://www.hevyapp.com/help/change-the-theme-android-ios/).

Hevy exports your measurements as a CSV, but your photos aren't in the export.

## My verdict on Hevy's progress photos {#verdict}

[TODO] Suggested starting point: Hevy's photos work as a quick weekly snapshot next to your weight, and the camera overlay helps you match last week's pose. If you take front, side and back, or want to fix alignment later, it gets in the way.

## FAQ {#faq}

### Can you add front, side and back photos on the same day in Hevy? {#faq-same-day}

No. Hevy allows one progress photo per day.

### Can other people see my Hevy progress photos? {#faq-privacy}

No. Photos in Measures stay private even with a public profile. Photos or videos you attach to a workout are visible.

### Are Hevy body measurements free? {#faq-measurements}

Weight and waist are free. Body fat and the other measurements need Hevy Pro.

### Can you export progress photos from Hevy? {#faq-export}

Hevy exports measurements as a CSV. Photos aren't in the export.

### Does Hevy remind you to take progress photos? {#faq-reminders}

No. Hevy's notifications cover workouts and social activity, not progress photos or weigh-ins.

<!-- scorecard -->

---

Published: [TODO]

Tested: [TODO] (October 2026?) {#when-tested}

Questions or corrections: support@progressphotos.app
