---
# Example Markdown post. Not deployed: only `BLOG_FIXTURES=1 npm run build` builds it.
# Copy this folder to blog/<slug>/ to start a new post. The folder name is the slug.
title: Example Progress Photo Article
seo_title: Example Progress Photo Article | Recomp   # optional; default "<title> — Recomp"
description: One-sentence description used for meta, og, twitter and JSON-LD.
published: 2026-11-02        # byline, article:published_time, datePublished, /blog/ card date; sorts /blog/
updated: 2026-11-03          # optional: dateModified and sitemap <lastmod>
tested: November 2026        # optional: "Tested November 2026." in the byline
draft: true                  # true: noindex + draft badge, out of sitemap, /blog/ and llms.txt; TODOs allowed
# noindex: true              # optional: noindex a finished post without the draft badge
og_image: ./example.png      # optional: co-located (./, becomes a 1200px WebP), /assets/… or https://…
breadcrumb: Best progress photo apps   # optional second breadcrumb
summary: |
  Two or three sentences that answer the question up front. **Markdown** works here.
summary_heading: Summary     # optional; default "Summary"
card_blurb: Optional shorter blurb for the /blog/ card (defaults to description).
llms_blurb: Optional line for llms.txt (defaults to description).
cta:                         # optional; any field overrides the default CTA. `cta: false` hides it.
  heading: Line up your progress photos
  text: Recomp aligns your check-ins so you can see the change.
  location: article_footer
# Rarely needed (used to keep the posts converted from hand-written HTML identical):
# og_title / og_description: og + twitter text when it differs from title / description
# og_image_alt: og:image:alt   twitter_text: false drops twitter:title/description
# article_dates: false drops article:*_time   byline: false (no byline) or custom inline text
# prose_wrapper: false (body brings its own wrapper <div>s as raw HTML)
# json_ld: JSON-LD used as-is (a list gives one <script> each)   hand_listed: true (lists written by hand)
faq:                         # optional: FAQPage JSON-LD (write the visible FAQ section in the body)
  - q: Is this an example?
    a: Yes. It proves the Markdown pipeline.
---

Intro paragraph. Raw HTML is allowed, so `<mark>`, `<figure>` and tables work as they do today.

<!-- TODO: link to future bulk import article -->

<!--
  todo (multiline, any case): stripped from output, and fails the build if draft is false.
-->

## Why this heading keeps its anchor {#existing-anchor-id}

Headings take an explicit id so existing `#` links never change.

### A subsection {#a-subsection}

Visible review markers like <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM: a fact to check]</mark> only print a warning.

![Co-located screenshot of an example progress photo](./example.png "Caption from the image title.")

Add `{.phone}` after an image for a phone screenshot: a narrower, centered figure.

![Example phone screenshot](./example.png "Phone screenshot caption."){.phone}

Brackets in ordinary text are fine, like [Draft your plan] or a [todo list]. Code keeps its markers:

```html
<!-- TODO: this comment stays, it is a code sample -->
<p>[TODO] and [DRAFT] in code never fail the build.</p>
```

Inline code too: `<!-- TODO -->` and `[DRAFT]`.
