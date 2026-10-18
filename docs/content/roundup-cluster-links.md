# REC-42 roundup cluster: hub-and-spoke link plan

Draft, Oct 17, 2026. Covers the roundup (hub) at `/blog/best-progress-photo-apps/` on PR #13 (`rec42-roundup-draft`, read at b3481e8) and the cluster pages in this drop. **Nothing in the roundup file was edited.** Every "add to the roundup" item below is an instruction for whoever edits it next (Rozz), not a change.

Anchors on the roundup were checked against b3481e8. The reference-facts block that landed there added no new anchors.

## 1. Pages in the cluster

| Page | URL | Status | Role |
| -- | -- | -- | -- |
| Roundup (hub) | /blog/best-progress-photo-apps/ | PR #13, draft | Hub |
| How I test progress photo apps | /blog/how-i-test-progress-photo-apps/ | New, noindex | Methodology and all data |
| What people want from progress photo apps | /blog/what-people-want-from-progress-photo-apps/ | New, noindex | 732-review study |
| GainFrame review | /blog/gainframe-review/ | Replaces PR #13 stub, noindex | Spoke |
| Thumbstone review | /blog/thumbstone-review/ | Replaces PR #13 stub, noindex | Spoke |
| Lasmit review | /blog/lasmit-review/ | Replaces PR #13 stub, noindex | Spoke |
| Fit-Stitch review | /blog/fit-stitch-review/ | Replaces PR #13 stub, noindex | Spoke |
| Then & Now review | /blog/then-and-now-review/ | Replaces PR #13 stub, noindex | Spoke |
| Metamorph review | /blog/metamorph-review/ | Replaces PR #13 stub, noindex | Spoke |
| Best free progress photo apps | /blog/best-free-progress-photo-apps/ | Replaces PR #13 stub, noindex | Spoke |
| GainFrame alternatives | /blog/gainframe-alternatives/ | New, noindex | Spoke |
| Check-In review | /blog/check-in-review/ | PR #13 stub, unchanged | Skipped: no hands-on data |
| Photo Journey review | /blog/photo-journey-review/ | PR #13 stub, unchanged | Skipped: no hands-on data |
| What to look for in a progress photo app (REC-109) | /blog/what-to-look-for-in-a-progress-photo-app/ | Separate work | Criteria explainer |
| Compare feature page | /features/compare-progress-photos/ | PR #26 | Product page |
| Align feature page | /features/align-progress-photos/ | PR #26 | Product page |
| Auto-align article | /blog/progress-photo-auto-alignment/ | PR #26 | Supporting article |

**Rule that governs everything below:** never link a noindex page from a published, indexed page. Each link in section 3 goes live only when its target is published (noindex removed, added to sitemap.xml, llms.txt and the /blog/ index). Links between two noindex drafts are fine.

## 2. Spoke to hub (already in the new pages)

Every cluster page links the hub with the anchor text "best progress photo apps" (or "roundup of the best progress photo apps"), and the breadcrumb reads Blog · Best progress photo apps.

| From | Link text | To |
| -- | -- | -- |
| Each review (disclosure line) | "[App] entry" | Hub #fit-stitch, #thumbstone, #lasmit, #then-and-now, #metamorph, #gainframe |
| Each review (disclosure line) | "roundup of the best progress photo apps" | Hub (top) |
| How I test | "roundup of the best progress photo apps" | Hub #all-data |
| Review study | "features section of my roundup" | Hub #features-people-use |
| Review study, "What else the reviews talk about" | "what happens when you switch phones" | Hub #switch-phones |
| Best free | "roundup of the best progress photo apps" | Hub #free-alternatives |
| Best free, "When a free route stops being enough" | "where apps start to differ" | Hub #hundreds-of-photos |
| GainFrame alternatives | "roundup of the best progress photo apps" | Hub (top) |

## 3. Hub to spokes: links to add to the roundup later

Add each one only once its target is published. Anchor text is a suggestion; keep the roundup's sentences otherwise as they are.

| Roundup anchor | Where in the section | Link text | Target |
| -- | -- | -- | -- |
| #what-i-tested | After the five needs list ("Under each need are the 1-to-5 scores...") | "how I test and score every app" | /blog/how-i-test-progress-photo-apps/#rubric |
| #what-i-tested | Same section, the criteria intro | "what to look for in a progress photo app" | /blog/what-to-look-for-in-a-progress-photo-app/ (REC-109) |
| #why-apps-fall-short | Last paragraph ("The grades in this guide already measure all three") | "what to look for in a progress photo app" | /blog/what-to-look-for-in-a-progress-photo-app/ (REC-109) |
| #hundreds-of-photos | Point 4 (GainFrame import) | "GainFrame review" | /blog/gainframe-review/#importing-a-big-library |
| #hundreds-of-photos | Point 4, after "I ran this test only on the leading apps" | "import tests" | /blog/how-i-test-progress-photo-apps/#import-tests |
| #hundreds-of-photos | Point 5 (Thumbstone auto-align) | "Thumbstone review" | /blog/thumbstone-review/#how-well-auto-align-works |
| #hundreds-of-photos | Point 5, auto-align sentence | "why auto-alignment is hard to do well" | /blog/progress-photo-auto-alignment/ (already linked in #what-i-tested; don't add twice in one screen) |
| #feedback-loop | Second paragraph, "A comparison that's buried, crooked or in another app" | "compare progress photos" | /features/compare-progress-photos/ (PR #26) |
| #features-people-use | First paragraph, after the 732-review sentence | "the full review study" | /blog/what-people-want-from-progress-photo-apps/ |
| #features-people-use | Under the feature table | "counts, quotes and regexes" | /blog/what-people-want-from-progress-photo-apps/#results |
| #how-i-tested | Section intro (covers #how-i-picked, #the-test-kit, #how-grades-work) | "every score, timing and test date" | /blog/how-i-test-progress-photo-apps/ |
| #comparison-table | Intro sentence | "the full comparison table with sources" | /blog/how-i-test-progress-photo-apps/#comparison-table |
| Each app entry (#fit-stitch, #thumbstone, #lasmit, #then-and-now, #metamorph, #gainframe) | After the Get-on-the-App-Store line | "Full [App] review" | /blog/[app]-review/ |
| #most-reviewed | The four list items | Already link the reviews (Metamorph, Lasmit, GainFrame, Fit-Stitch). The editor note "don't link until each is live" still applies. | /blog/metamorph-review/, /blog/lasmit-review/, /blog/gainframe-review/, /blog/fit-stitch-review/ |
| #gainframe | After the flaws list | "GainFrame alternatives" | /blog/gainframe-alternatives/ |
| #free-alternatives | Second paragraph already links /blog/best-free-progress-photo-apps/ with "Best free and non-dedicated ways to track progress photos" | Change the link text to "best free progress photo apps" when the kwmap is reassigned (section 6) | /blog/best-free-progress-photo-apps/ |
| #free-alternatives | First paragraph (Hevy, MacroFactor, MyFitnessPal) | "Hevy", "MacroFactor", "MyFitnessPal" | /blog/best-free-progress-photo-apps/#hevy, #macrofactor, #myfitnesspal |
| #all-data | Intro sentence | "test dates, import timings and store data" | /blog/how-i-test-progress-photo-apps/#store-data |
| #all-data | Under the table | "scores by app and rankings" | /blog/how-i-test-progress-photo-apps/#scores |
| #faq | "Which progress photo app features matter most?" | "732 App Store reviews" | /blog/what-people-want-from-progress-photo-apps/ |
| #faq | "Is there a free progress photo app with no subscription?" | "best free progress photo apps" | /blog/best-free-progress-photo-apps/ |

**Limit:** at most one link per target per section, and don't add review links inside the Quick Answer picks list.

## 4. Spoke to spoke (already in the new pages)

| From | Links to |
| -- | -- |
| GainFrame review | GainFrame alternatives; Thumbstone review; Fit-Stitch review; review study; methodology (#store-data) |
| Thumbstone review | Fit-Stitch review; Then & Now review; auto-align article; methodology |
| Lasmit review | Thumbstone review; Then & Now review; Fit-Stitch review; review study; methodology |
| Fit-Stitch review | Thumbstone review; Then & Now review; Lasmit review; review study; methodology |
| Then & Now review | Thumbstone review; Fit-Stitch review; methodology |
| Metamorph review | Then & Now review; Thumbstone review; Fit-Stitch review; review study; methodology |
| Best free | Then & Now review; Fit-Stitch review |
| GainFrame alternatives | GainFrame, Thumbstone, Fit-Stitch, Then & Now, Lasmit reviews; methodology |
| Methodology | Every review; best free; review study; REC-109 |
| Review study | (hub only) |

Every review links its two nearest neighbors plus the methodology from "The numbers" (anchor #store-data). Only the GainFrame review links GainFrame alternatives, since no other alternatives page exists yet.

## 5. REC-109, the feature pages and the auto-align article

**REC-109, /blog/what-to-look-for-in-a-progress-photo-app/:** the criteria explainer. It sits between the hub and the methodology: the hub says *what* I rank on, REC-109 says *why* those criteria, and the methodology shows *how* I measured them.
1. Inbound from the roundup: #why-apps-fall-short and #what-i-tested (section 3).
2. Inbound from the methodology: "What I score, and why" already links it, with [CONFIRM: REC-109 live before linking].
3. Outbound, to add in REC-109: one link to the hub ("best progress photo apps") and one to /blog/how-i-test-progress-photo-apps/#rubric ("how I score each criterion"). Its outline also suggested one line per review; keep that to the "Who should use something else" style, at most one review link per criterion.

**Feature pages in PR #26:**
1. /features/compare-progress-photos/: add one FAQ line linking the hub ("I compared 10 progress photo apps in best progress photo apps"). The hub links it from #feedback-loop (section 3). The roundup's #metamorph section already has a compare-page link with an editor note "REC-64 page not live yet"; keep one of the two, not both.
2. /features/align-progress-photos/: add one FAQ line linking the Thumbstone review or the hub's #thumbstone for readers who want auto-align today. Its "ADD IF #41 SHIPS" block stays a comment: auto-align isn't launched and is off by default, so no cluster page claims Recomp auto-aligns. The cluster pages don't link this page yet; add a link from the methodology's comparison table (Recomp row, "Manual pan, pinch zoom and rotate") once PR #26 is live.

**Auto-align article, /blog/progress-photo-auto-alignment/ (PR #26):** linked from the Thumbstone review ("how well progress photo auto-alignment works") with [CONFIRM: live before linking], and from the hub's #what-i-tested. Add an outbound link from the article to /blog/thumbstone-review/#how-well-auto-align-works where it discusses pose-based alignment. The older auto-align comparison spin-off (PR #21) is stale and isn't part of this drop.

## 6. Keyword assignments to fix before publishing

1. **"best free progress photo apps"** is assigned to the roundup in the keyword map. Reassign it to /blog/best-free-progress-photo-apps/ (its H1 and title now target it) so the two pages don't compete. Then change the hub's #free-alternatives link text (section 3).
2. **"gainframe alternative"** is P3 with no page. Assign it to /blog/gainframe-alternatives/.
3. Add the review keywords ("[app] review") and "how to test progress photo apps" / "progress photo app reviews study" as new rows. [CONFIRM: keyword choices]

## 7. Site-wide links (when the cluster publishes)

Per the spin-off plan: the homepage, /faq/ and the founder post (/blog/why-i-built-recomp/) each get one link to the hub, not to the spokes. Don't link spokes from the homepage.

## 8. Publish checklist per page

1. Remove `<meta name="robots" content="noindex">`.
2. Add datePublished and dateModified to the Article JSON-LD, plus article:published_time.
3. Add to sitemap.xml, llms.txt and the /blog/ index.
4. Turn on the section 3 links that point to it, in the roundup and in other published pages.
5. Clear every highlighted [TODO] and [CONFIRM] on the page.
