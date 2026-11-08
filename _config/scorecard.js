/**
 * Review scorecard: the checklist table at the bottom of each app review, plus the
 * "How I tested" line. Criteria live here, not in each post, so the labels stay the same
 * across reviews and a typo in an id fails the build. Order here is the order on the page.
 * A post leaves rows out of its own table with `omit:` inside `scorecard`. The criteria
 * stay in this list, and every id that is not omitted is still required.
 * Source: blog/how-i-test-progress-photo-apps/index.md (5 principles plus quality of life).
 * Rendered by _includes/scorecard.njk; checked from checkFrontmatter in _config/blog.js.
 */
export const SCORECARD_GROUPS = [
  { id: "checkin", label: "A check-in should be effortless", anchor: "1-a-check-in-should-be-effortless", rows: [
    { id: "checkin_time", label: "Check-in in under a minute and a few taps" },
    { id: "photo_picker", label: "Front, side and back in one photo pick" },
    { id: "weight_apple_health", label: "Weight from Apple Health" },
    { id: "weight_quick_entry", label: "Quick weight entry without typing" },
    { id: "data_together", label: "Photos, weight and notes kept together" },
    { id: "camera_zoom", label: "Zoom in the in-app camera" },
  ] },
  { id: "alignment", label: "Alignment should be effortless", anchor: "2-alignment-should-be-effortless", rows: [
    { id: "auto_align", label: "Auto-align" },
    { id: "ghost_overlay", label: "Ghost overlay" },
    { id: "gridlines", label: "Gridlines for lining up" },
    { id: "manual_align", label: "Manual alignment, any time" },
    { id: "align_in_compare", label: "Align in the side-by-side view" },
  ] },
  { id: "compare", label: "Comparison should be effortless", anchor: "3-comparison-should-be-effortless", rows: [
    { id: "compare_speed", label: "Several dates in quick succession" },
    { id: "compare_scale", label: "Fast with hundreds of photos" },
    { id: "side_by_side", label: "Side-by-side view" },
    { id: "slider_view", label: "Slider view" },
    { id: "overlay_view", label: "Overlay view" },
  ] },
  { id: "photos", label: "The photos are the star", anchor: "4-the-photos-are-the-star", rows: [
    { id: "photo_focus", label: "Photos fill the screen, buttons stay out of the way" },
  ] },
  { id: "privacy", label: "Data privacy", anchor: "5-data-privacy", rows: [
    { id: "photos_on_device", label: "Photos never sent to a third-party server" },
    { id: "privacy_label", label: "Privacy label and policy agree" },
  ] },
  { id: "qol", label: "Quality of life", anchor: "quality-of-life-once-the-basics-work", rows: [
    { id: "bulk_import", label: "Bulk import that reads photo dates" },
    { id: "data_import_export", label: "CSV import and photo export" },
    { id: "app_lock", label: "Face ID or app lock" },
    { id: "backup_transfer", label: "Backup and moving to a new phone" },
    { id: "reminders", label: "Check-in reminders" },
    { id: "in_app_camera", label: "In-app camera with overlay and guides" },
    { id: "units", label: "Metric and imperial" },
    { id: "body_measurements", label: "Optional body measurements" },
    { id: "sharing", label: "Shareable before/after image" },
    { id: "timelapse", label: "Timelapse" },
    { id: "no_account", label: "Works without an account" },
    { id: "originals_untouched", label: "Leaves originals untouched in Photos" },
    { id: "edit_date", label: "Edit a check-in's date" },
    { id: "partial_checkin", label: "Save a partial check-in" },
    { id: "dark_mode", label: "Dark mode" },
    { id: "no_ads", label: "No ads" },
  ] },
];

export const SCORECARD_IDS = SCORECARD_GROUPS.flatMap((g) => g.rows.map((r) => r.id));
export const SCORECARD_STATUSES = ["has", "partial", "missing", "confirm"];
const LABELS = { has: "Yes", partial: "Partly", missing: "No", confirm: "Not checked yet" };

/**
 * Ids in `scorecard.omit`. Read by index: Eleventy's computed-data proxy serves array
 * methods from an empty target, so `.filter` on the proxy would see no ids and a missing
 * row would throw. A missing row that is not in this list still fails validation.
 */
function omitList(omit) {
  if (!Array.isArray(omit)) return null;
  const ids = [];
  for (let i = 0; i < omit.length; i++) ids.push(omit[i]);
  return ids;
}

function omittedIds(raw) {
  if (!raw || typeof raw !== "object") return new Set();
  const list = omitList(raw.omit);
  if (!list) return new Set();
  return new Set(list.filter((id) => typeof id === "string" && id !== "" && SCORECARD_IDS.includes(id) && raw[id] === undefined));
}

/** Frontmatter `scorecard:` -> groups for the include. Drafts keep confirm rows; published pages drop them. */
export function scorecardData(raw, { draft }) {
  if (!raw || typeof raw !== "object") return null;
  const omitted = omittedIds(raw);
  const ids = SCORECARD_IDS.filter((id) => !omitted.has(id));
  const groups = SCORECARD_GROUPS.map((g) => ({
    ...g,
    rows: g.rows
      .filter((r) => !omitted.has(r.id))
      .map((r) => ({ ...r, status: raw[r.id].status, statusLabel: LABELS[raw[r.id].status], fact: String(raw[r.id].fact) }))
      .filter((r) => draft || r.status !== "confirm"),
  })).filter((g) => g.rows.length > 0);
  const hidden = draft ? 0 : ids.filter((id) => raw[id].status === "confirm").length;
  const confirm = ids.filter((id) => raw[id].status === "confirm").length;
  return { groups, hidden, confirm };
}

/** Errors for one post's scorecard. Called from checkFrontmatter. */
export function checkScorecard(file, raw) {
  const errors = [];
  if (raw === undefined) return errors;
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return [`${file}: scorecard must be a mapping of criterion id to { status, fact }`];
  if (raw.omit !== undefined) {
    const list = omitList(raw.omit);
    if (!list || list.some((id) => typeof id !== "string" || id === "")) {
      errors.push(`${file}: scorecard.omit must be a list of criterion ids`);
    } else {
      for (const id of list) {
        if (!SCORECARD_IDS.includes(id)) errors.push(`${file}: scorecard.omit has unknown id "${id}"`);
        else if (raw[id] !== undefined) errors.push(`${file}: scorecard.${id} is set and also omitted`);
      }
    }
  }
  const omitted = omittedIds(raw);
  for (const id of Object.keys(raw)) if (id !== "omit" && !SCORECARD_IDS.includes(id)) errors.push(`${file}: unknown scorecard id "${id}"`);
  for (const id of SCORECARD_IDS) {
    if (omitted.has(id)) continue;
    const row = raw[id];
    if (!row || typeof row !== "object") { errors.push(`${file}: scorecard.${id} is required (use status: confirm, fact: "[CONFIRM]")`); continue; }
    const fact = row.fact === undefined || row.fact === null ? "" : String(row.fact);
    if (!SCORECARD_STATUSES.includes(row.status)) errors.push(`${file}: scorecard.${id}.status must be has, partial, missing or confirm`);
    if (!fact.trim()) errors.push(`${file}: scorecard.${id}.fact is required`);
    if (row.status === "confirm" && fact !== "[CONFIRM]" && /\[(CONFIRM|TODO|DRAFT)/.test(fact)) {
      errors.push(`${file}: scorecard.${id} is confirm with a marker in fact; use plain wording or fact: "[CONFIRM]"`);
    }
    if (row.status !== "confirm" && /\[(CONFIRM|TODO|DRAFT)/.test(fact)) errors.push(`${file}: scorecard.${id} has a marker in a non-confirm fact`);
    if (fact.includes("\u2014")) errors.push(`${file}: scorecard.${id}.fact has an em dash`);
    if (fact.length > 90) errors.push(`${file}: scorecard.${id}.fact is over 90 characters`);
  }
  return errors;
}

// ---------------------------------------------------------------- how I tested

export const HOW_TESTED_KEYS = ["device", "ios", "app_version", "started", "ended", "checkins"];
export const HOW_TESTED_REQUIRED = ["device", "ios", "app_version", "started", "ended"];
export const MEASUREMENT_KEYS = ["taps_per_checkin", "seconds_per_checkin", "import_photo_count", "import_seconds"];

const blank = (v) => v === undefined || v === null || String(v).trim() === "";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const asDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).trim());

/** Errors for `how_tested` and `measurements`. Called from checkFrontmatter. */
export function checkHowTested(file, how, measurements) {
  const errors = [];
  if (how !== undefined) {
    if (typeof how !== "object" || how === null || Array.isArray(how)) errors.push(`${file}: how_tested must be a mapping (${HOW_TESTED_KEYS.join(", ")})`);
    else {
      for (const key of Object.keys(how)) if (!HOW_TESTED_KEYS.includes(key)) errors.push(`${file}: unknown how_tested key "${key}" (allowed: ${HOW_TESTED_KEYS.join(", ")})`);
      for (const key of ["started", "ended"]) if (!blank(how[key]) && !DATE.test(asDate(how[key]))) errors.push(`${file}: how_tested.${key} must be YYYY-MM-DD or empty`);
      if (!blank(how.started) && !blank(how.ended) && asDate(how.ended) < asDate(how.started)) errors.push(`${file}: how_tested.ended is before how_tested.started`);
      if (!blank(how.checkins) && !/^\d+$/.test(String(how.checkins).trim())) errors.push(`${file}: how_tested.checkins must be a whole number or empty`);
    }
  }
  if (measurements !== undefined) {
    if (typeof measurements !== "object" || measurements === null || Array.isArray(measurements)) errors.push(`${file}: measurements must be a mapping (${MEASUREMENT_KEYS.join(", ")})`);
    else {
      for (const key of Object.keys(measurements)) if (!MEASUREMENT_KEYS.includes(key)) errors.push(`${file}: unknown measurements key "${key}" (allowed: ${MEASUREMENT_KEYS.join(", ")})`);
      for (const key of MEASUREMENT_KEYS) {
        const v = measurements[key];
        if (!blank(v) && !/^\d+(\.\d+)?$/.test(String(v).trim())) errors.push(`${file}: measurements.${key} must be a number or empty (measured, never a range or "about")`);
      }
    }
  }
  return errors;
}

const monthYear = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/**
 * Fields for the review meta footer. Empty strings stay empty so the template can skip a row.
 * `confirm` is true while device, iOS, app version or the test dates are empty.
 */
export function howTestedData(how, measurements, appName) {
  if (how === undefined && measurements === undefined) return null;
  const h = how && typeof how === "object" ? how : {};
  const m = measurements && typeof measurements === "object" ? measurements : {};
  const val = (v) => (blank(v) ? "" : String(v).trim());
  const device = val(h.device);
  const ios = val(h.ios);
  const appVersion = val(h.app_version);
  const tested = val(h.started) && val(h.ended) ? monthYear(asDate(h.ended)) : "";
  const checkins = val(h.checkins);
  const checkinTiming =
    val(m.taps_per_checkin) && val(m.seconds_per_checkin)
      ? `${val(m.taps_per_checkin)} taps, ${val(m.seconds_per_checkin)} seconds`
      : "";
  const importTiming =
    val(m.import_photo_count) && val(m.import_seconds)
      ? `${val(m.import_photo_count)} photos in ${val(m.import_seconds)} seconds`
      : "";
  const confirm = HOW_TESTED_REQUIRED.some((k) => !val(h[k]));
  const measured = MEASUREMENT_KEYS.some((k) => val(m[k]));
  return {
    device,
    ios,
    appVersion: appVersion || null,
    appVersionLabel: appVersion ? (appName ? `${appName} ${appVersion}` : appVersion) : "",
    tested,
    checkins,
    checkinTiming,
    importTiming,
    confirm,
    measured,
  };
}
