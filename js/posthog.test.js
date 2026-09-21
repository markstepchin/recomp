var assert = require("assert");
var fs = require("fs");
var path = require("path");
var ph = require("./posthog");

function el(tag, parent) {
  var node = {
    nodeType: 1,
    tagName: tag,
    parentElement: parent || null,
    attrs: {},
    getAttribute: function (name) {
      return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
    },
  };
  return node;
}

function click(target, type, button) {
  return { type: type || "click", button: button == null ? 0 : button, target: target };
}

var landing = ph.readAttribution(
  "?utm_source=tiktok&utm_medium=social&utm_campaign=spring&utm_content=bio&gclid=G123&ttclid=T456&utm_term=ignored&foo=bar"
);
assert.deepStrictEqual(landing.latest, {
  utm_source: "tiktok",
  utm_medium: "social",
  utm_campaign: "spring",
  utm_content: "bio",
  gclid: "G123",
  ttclid: "T456",
});
assert.deepStrictEqual(landing.initial, {
  initial_utm_source: "tiktok",
  initial_utm_medium: "social",
  initial_utm_campaign: "spring",
  initial_utm_content: "bio",
  initial_gclid: "G123",
  initial_ttclid: "T456",
});

assert.deepStrictEqual(ph.readAttribution("").latest, {});
assert.deepStrictEqual(ph.readAttribution("?utm_source=").latest, {});
assert.deepStrictEqual(ph.readAttribution("?utm_source=newsletter").latest, {
  utm_source: "newsletter",
});

function fakePosthog() {
  return {
    once: [],
    latest: [],
    register_once: function (props) {
      this.once.push(props);
    },
    register: function (props) {
      this.latest.push(props);
    },
  };
}

var direct = fakePosthog();
assert.deepStrictEqual(ph.applyAttribution(direct, ""), { latest: {}, initial: {} });
assert.deepStrictEqual(direct.once, []);
assert.deepStrictEqual(direct.latest, []);

var campaign = fakePosthog();
ph.applyAttribution(campaign, "?utm_source=tiktok&gclid=G1");
assert.deepStrictEqual(campaign.once, [{ initial_utm_source: "tiktok", initial_gclid: "G1" }]);
assert.deepStrictEqual(campaign.latest, [{ utm_source: "tiktok", gclid: "G1" }]);

assert.strictEqual(
  ph.isAppStoreHref("https://apps.apple.com/us/app/recomp-your-physique-tracker/id6760444125"),
  true
);
assert.strictEqual(ph.isAppStoreHref("http://itunes.apple.com/app/id6760444125"), true);
assert.strictEqual(ph.isAppStoreHref("https://example.com/apps.apple.com"), false);
assert.strictEqual(ph.isAppStoreHref("https://apps.apple.com.evil.test/app"), false);
assert.strictEqual(ph.isAppStoreHref("mailto:markstepchin@gmail.com"), false);
assert.strictEqual(ph.isAppStoreHref("#hero"), false);

var header = el("header");
var headerLink = el("a", header);
headerLink.attrs.href = "https://apps.apple.com/us/app/recomp-your-physique-tracker/id6760444125";
var headerImg = el("img", headerLink);
assert.strictEqual(ph.ctaLocation(headerLink), "header");
assert.deepStrictEqual(ph.appStoreClickProps(click(headerImg), "/about/", "https://progressphotos.app/about/"), {
  page_path: "/about/",
  cta_location: "header",
});

var footer = el("footer");
var footerLink = el("a", footer);
footerLink.attrs.href = "https://apps.apple.com/us/app/recomp-your-physique-tracker/id6760444125";
assert.deepStrictEqual(ph.appStoreClickProps(click(footerLink), "/blog/", "https://progressphotos.app/blog/"), {
  page_path: "/blog/",
  cta_location: "footer",
});

var main = el("main");
var badge = el("a", main);
badge.attrs.href = "https://apps.apple.com/us/app/recomp-your-physique-tracker/id6760444125";
assert.deepStrictEqual(ph.appStoreClickProps(click(badge), "/", "https://progressphotos.app/"), {
  page_path: "/",
  cta_location: "inline",
});

var internal = el("a", header);
internal.attrs.href = "../privacy/";
assert.strictEqual(ph.appStoreClickProps(click(internal), "/about/", "https://progressphotos.app/about/"), null);
assert.strictEqual(ph.appStoreClickProps(click(headerLink, "auxclick", 2), "/about/", "https://progressphotos.app/about/"), null);
assert.deepStrictEqual(
  ph.appStoreClickProps(click(headerLink, "auxclick", 1), "/about/", "https://progressphotos.app/about/"),
  { page_path: "/about/", cta_location: "header" }
);

var root = path.join(__dirname, "..");
var tracked = [
  "index.html",
  "blog/index.html",
  "blog/how-to-take-progress-photos-for-recomp/index.html",
  "blog/why-i-built-recomp/index.html",
  "about/index.html",
  "privacy/index.html",
  "faq/index.html",
  "support/index.html",
];
tracked.forEach(function (file) {
  var html = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(html.indexOf("posthog.js") !== -1, file + " should load posthog.js");
});

["privacy.html", "support.html"].forEach(function (file) {
  var html = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(html.indexOf("posthog.js") === -1, file + " should stay untracked");
});

var source = fs.readFileSync(path.join(__dirname, "posthog.js"), "utf8");
assert.ok(source.indexOf('person_profiles: "identified_only"') !== -1);
assert.ok(source.indexOf('host === "localhost"') !== -1);
assert.ok(source.indexOf("app_store_click") !== -1);
assert.ok(source.indexOf("register_once") !== -1);

console.log("posthog tests passed");
