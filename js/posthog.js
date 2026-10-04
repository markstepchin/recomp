(function (root) {
  var ATTRIBUTION_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "gclid",
    "ttclid",
  ];

  function readAttribution(search) {
    var raw = typeof search === "string" ? search : "";
    if (raw.charAt(0) === "?") raw = raw.slice(1);
    var params = new URLSearchParams(raw);
    var latest = {};
    var initial = {};
    for (var i = 0; i < ATTRIBUTION_KEYS.length; i++) {
      var key = ATTRIBUTION_KEYS[i];
      var value = params.get(key);
      if (!value) continue;
      latest[key] = value;
      initial["initial_" + key] = value;
    }
    return { latest: latest, initial: initial };
  }

  function isAppStoreHref(href, base) {
    if (!href || typeof href !== "string") return false;
    var trimmed = href.replace(/^\s+/, "");
    if (!trimmed || trimmed.charAt(0) === "#") return false;
    var url;
    try {
      url = new URL(trimmed, base || "https://progressphotos.app/");
    } catch (err) {
      return false;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    var host = url.hostname.toLowerCase();
    return host === "apps.apple.com" || host === "itunes.apple.com";
  }

  function elementTag(node) {
    if (!node || node.nodeType !== 1) return "";
    return String(node.tagName || "").toLowerCase();
  }

  function parentElement(node) {
    if (!node) return null;
    if (node.parentElement) return node.parentElement;
    var parent = node.parentNode;
    if (parent && parent.nodeType === 1) return parent;
    return null;
  }

  function anchorFromTarget(target) {
    var node = target;
    while (node && node.nodeType === 1) {
      if (elementTag(node) === "a") return node;
      node = parentElement(node);
    }
    return null;
  }

  // Nearest header/footer ancestor, unless the link or an ancestor sets
  // data-cta-location. Chrome stays unmarked; the founder-post button uses
  // article_footer so it is distinct from the site footer badge.
  function ctaLocation(element) {
    var node = element;
    while (node && node.nodeType === 1) {
      if (typeof node.getAttribute === "function") {
        var explicit = node.getAttribute("data-cta-location");
        if (explicit) return explicit;
      }
      var tag = elementTag(node);
      if (tag === "header") return "header";
      if (tag === "footer") return "footer";
      node = parentElement(node);
    }
    return "inline";
  }

  function applyAttribution(ph, search) {
    if (!ph || typeof ph.register !== "function" || typeof ph.register_once !== "function") return null;
    var attribution = readAttribution(search);
    var hasInitial = false;
    var hasLatest = false;
    var key;
    for (key in attribution.initial) {
      if (Object.prototype.hasOwnProperty.call(attribution.initial, key)) hasInitial = true;
    }
    for (key in attribution.latest) {
      if (Object.prototype.hasOwnProperty.call(attribution.latest, key)) hasLatest = true;
    }
    if (hasInitial) ph.register_once(attribution.initial);
    if (hasLatest) ph.register(attribution.latest);
    return attribution;
  }

  function appStoreClickProps(event, pagePath, baseUrl) {
    if (!event) return null;
    if (event.type === "auxclick" && event.button !== 1) return null;
    if (event.type === "click" && event.button != null && event.button !== 0) return null;
    var link = anchorFromTarget(event.target);
    if (!link) return null;
    var href = link.getAttribute ? link.getAttribute("href") : link.href;
    if (!isAppStoreHref(href, baseUrl)) return null;
    return {
      page_path: pagePath,
      cta_location: ctaLocation(link),
    };
  }

  var api = {
    readAttribution: readAttribution,
    isAppStoreHref: isAppStoreHref,
    ctaLocation: ctaLocation,
    appStoreClickProps: appStoreClickProps,
    applyAttribution: applyAttribution,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  var win = root && root.document ? root : null;
  if (!win) return;

  var host = win.location.hostname;
  var skip = host === "localhost" || host === "127.0.0.1";
  // Captures that happen before posthog.init. Flushed into the SDK stub
  // once init runs, so an App Store click during deferral is not dropped.
  // Not used for $pageview: the SDK sends that once, from init.
  var pendingCaptures = [];
  var booted = false;

  function track(name, props, options) {
    if (skip) return;
    if (booted && win.posthog && typeof win.posthog.capture === "function") {
      win.posthog.capture(name, props, options);
      return;
    }
    pendingCaptures.push([name, props, options]);
  }

  function flushPendingCaptures() {
    booted = true;
    var batch = pendingCaptures.splice(0, pendingCaptures.length);
    for (var i = 0; i < batch.length; i++) {
      win.posthog.capture(batch[i][0], batch[i][1], batch[i][2]);
    }
  }

  if (!skip) {
    // Array, matching the official snippet, which queues with `.push`.
    // capture stays ours until init() replaces it with the SDK stub.
    var bridge = [];
    bridge.capture = function (name, props, options) {
      track(name, props, options);
    };
    win.posthog = bridge;
  }

  function captureAppStoreClick(event) {
    var props = appStoreClickProps(event, win.location.pathname, win.location.href);
    if (!props) return;
    // Same-tab App Store navigations unload the page immediately.
    // Queued until init, then sent with sendBeacon via the SDK stub.
    track("app_store_click", props, { transport: "sendBeacon" });
  }

  win.document.addEventListener("click", captureAppStoreClick, true);
  win.document.addEventListener("auxclick", captureAppStoreClick, true);

  if (skip) return;

  var started = false;

  function startPosthog() {
    if (started) return;
    started = true;

    !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="du vu fu pu yu init Bu Hu Nu qu Vu Kl ju Zu Ou Yu Xu th capture getExtension zu hu nh calculateEventProperties ih register register_once register_for_session unregister unregister_for_session ah Lu sh getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync uh identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset hh shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty rh Ku createPersonProfile setInternalOrTestUser oh bu opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Qu debug Yl Os getPageViewId captureTraceFeedback captureTraceMetric Pu".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

    posthog.init("phc_xodXQZqTdFLNgATiavzQaXRFg2b98MAwNytsS8udcRiA", {
      api_host: "https://us.i.posthog.com",
      defaults: "2026-05-30",
      // Anonymous visitors are never identified on this site. Person properties
      // would not stick, and `always` would create a profile per visitor.
      // Attribution is stored as event super properties instead. See POSTHOG.md.
      person_profiles: "identified_only",
      // The SDK fires the first $pageview once, on a timeout after `loaded`.
      // Do not capture $pageview here. register() still lands on that pageview.
      loaded: function (ph) {
        applyAttribution(ph, win.location.search);
      },
    });

    // init() has replaced bridge.capture with the SDK queue. Flush in this
    // same turn, before array.js can run, so earlier captures are replayed
    // once and the automatic $pageview is not duplicated.
    flushPendingCaptures();
  }

  // After window load, then idle (or 2000ms). setTimeout only if
  // requestIdleCallback is missing. The script tag itself is `defer`.
  function startPosthogWhenIdle() {
    if (typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(startPosthog, { timeout: 2000 });
    } else {
      win.setTimeout(startPosthog, 1);
    }
  }

  if (win.document.readyState === "complete") startPosthogWhenIdle();
  else win.addEventListener("load", startPosthogWhenIdle, { once: true });
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
