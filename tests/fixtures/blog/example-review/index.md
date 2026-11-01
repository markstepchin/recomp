---
# Example app review. Not deployed: only `BLOG_FIXTURES=1 npm run build` builds it.
# Shows the scorecard with every status (has, partial, missing, confirm), the How I tested
# line with a [CONFIRM] for the empty fields, and the Review JSON-LD. Values are made up.
title: Example App Progress Photos Review
description: Example app review that renders the scorecard with every status.
published: 2026-11-02
updated: 2026-11-04
draft: true
template: app-review
app_store:
  id: 1
  name: "Example App - Photo Tracker"
  developer: "Example Developer"
  developer_url: "https://example.com/"
  rating: 4.5
  rating_count: 1200
  min_ios: "17.0"
  url: "https://apps.apple.com/us/app/example/id1"
  icon: "assets/recomp-app-icon.png"
  checked: 2026-11-01
  price: "4.99"
how_tested:
  device: "iPhone 15"
  ios: "26.1"
  app_version: "2.0"
  started: ""
  ended: ""
  checkins: "6"
measurements:
  taps_per_checkin: "5"
  seconds_per_checkin: "40"
  import_photo_count: ""
  import_seconds: ""
summary: |
  An example **summary** with Markdown, used as the Review's reviewBody.
faq:
  - q: Is this an example?
    a: Yes. It renders every scorecard status.
scorecard:
  checkin_time: { status: has, fact: "Example fact for a row it has" }
  photo_picker: { status: partial, fact: "Example fact for a partial row" }
  weight_apple_health: { status: missing, fact: "Example fact for a missing row" }
  weight_quick_entry: { status: confirm, fact: "[CONFIRM]" }
  data_together: { status: has, fact: "Example fact for a row it has" }
  camera_zoom: { status: confirm, fact: "[CONFIRM]" }
  auto_align: { status: partial, fact: "Example fact for a partial row" }
  ghost_overlay: { status: missing, fact: "Example fact for a missing row" }
  gridlines: { status: confirm, fact: "[CONFIRM]" }
  manual_align: { status: has, fact: "Example fact for a row it has" }
  align_in_compare: { status: partial, fact: "Example fact for a partial row" }
  compare_speed: { status: missing, fact: "Example fact for a missing row" }
  compare_scale: { status: confirm, fact: "[CONFIRM]" }
  side_by_side: { status: has, fact: "Example fact for a row it has" }
  slider_view: { status: partial, fact: "Example fact for a partial row" }
  overlay_view: { status: missing, fact: "Example fact for a missing row" }
  photo_focus: { status: confirm, fact: "[CONFIRM]" }
  photos_on_device: { status: confirm, fact: "[CONFIRM]" }
  privacy_label: { status: has, fact: "Example fact for a row it has" }
  bulk_import: { status: partial, fact: "Example fact for a partial row" }
  data_import_export: { status: missing, fact: "Example fact for a missing row" }
  app_lock: { status: confirm, fact: "[CONFIRM]" }
  backup_transfer: { status: has, fact: "Example fact for a row it has" }
  reminders: { status: partial, fact: "Example fact for a partial row" }
  in_app_camera: { status: missing, fact: "Example fact for a missing row" }
  units: { status: confirm, fact: "[CONFIRM]" }
  body_measurements: { status: has, fact: "Example fact for a row it has" }
  sharing: { status: partial, fact: "Example fact for a partial row" }
  timelapse: { status: missing, fact: "Example fact for a missing row" }
  no_account: { status: confirm, fact: "[CONFIRM]" }
  originals_untouched: { status: has, fact: "Example fact for a row it has" }
  edit_date: { status: partial, fact: "Example fact for a partial row" }
  partial_checkin: { status: missing, fact: "Example fact for a missing row" }
  dark_mode: { status: confirm, fact: "[CONFIRM]" }
  no_ads: { status: has, fact: "Example fact for a row it has" }
---

**Full disclosure: I build Recomp, a free progress photo app.**

<!-- app-store-card -->

Opening paragraph. See the [auto-align row](#sc-auto-align).

## My verdict on Example App {#verdict}

Verdict.

## FAQ {#faq}

### Is this an example? {#faq-example}

Yes. It renders every scorecard status.

<!-- scorecard -->
