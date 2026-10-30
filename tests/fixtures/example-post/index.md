---
# Example article source. Copy this folder to blog/<slug>/ to start a new post.
# The folder name is the slug: blog/<slug>/index.md builds blog/<slug>/index.html.
title: Example Progress Photo Article
seo_title: Example Progress Photo Article | Recomp   # optional; default "<title> — Recomp"
description: One-sentence description used for meta, og, twitter and JSON-LD.
published: 2026-11-02        # byline, article:published_time, datePublished, /blog/ card date
updated: 2026-11-03          # optional: dateModified and sitemap <lastmod>
tested: November 2026        # optional: "Tested November 2026." in the byline
draft: true                  # true: noindex + draft badge, kept out of sitemap, /blog/ and llms.txt; TODO comments allowed
og_image: ./example.webp     # optional: co-located (./) or /assets/… path; default step-compare.webp
breadcrumb: Best progress photo apps   # optional second breadcrumb
summary: |
  Two or three sentences that answer the question up front.
card_blurb: Optional shorter blurb for the /blog/ card (defaults to description).
---

Intro paragraph. Raw HTML is allowed, so `<mark>`, `<figure>` and tables work as they do today.

<!-- TODO: link to future bulk import article -->

## Why this heading keeps its anchor {#existing-anchor-id}

Headings take an explicit id so existing `#` links never change.

### A subsection {#a-subsection}

Visible review markers like <mark class="rounded-sm bg-yellow-200 px-1 text-black box-decoration-clone">[CONFIRM: a fact to check]</mark> only print a warning.

A TODO comment shown as code is kept: `<!-- TODO: not a real TODO -->`.

![Co-located screenshot](./example.webp){.block .h-auto .w-full .rounded-card}
