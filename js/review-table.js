/* Review table for /blog/what-people-want-from-progress-photo-apps/.
   Loaded by a tiny inline loader only when the table scrolls near view or its button is clicked.
   Fetches the compact JSON once, then filters, sorts and paginates in memory.
   Review text is untrusted: every value is written with textContent, never innerHTML. */
(function () {
  "use strict";
  var root = document.querySelector("[data-review-table]");
  if (!root || root.getAttribute("data-state") === "loading" || root.getAttribute("data-state") === "ready") return;
  root.setAttribute("data-state", "loading");
  var PAGE = 25;
  var CTRL = "rounded-sm border border-card-border bg-bg px-2 py-1.5 text-micro text-fg";
  var BTN = "cursor-pointer rounded-sm border border-card-border bg-card px-3 py-1.5 text-micro text-fg";
  var TH = "whitespace-nowrap border-b border-card-border px-3 py-2 align-bottom font-semibold text-fg";
  var TD = "border-b border-card-border px-3 py-2 align-top text-muted";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = String(text);
    return e;
  }
  function option(sel, value, label) {
    var o = el("option", null, label);
    o.value = value;
    sel.appendChild(o);
  }
  function field(label, control) {
    var l = el("label", "flex min-w-0 flex-col gap-1 text-micro text-muted");
    l.style.maxWidth = "100%";
    l.appendChild(el("span", null, label));
    l.appendChild(control);
    return l;
  }
  function stars(n) {
    return "\u2605\u2605\u2605\u2605\u2605".slice(0, n) + "\u2606\u2606\u2606\u2606\u2606".slice(0, 5 - n);
  }
  function fmtDate(iso) {
    var p = iso.split("-");
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+p[1] - 1];
    return m + " " + +p[2] + ", " + p[0];
  }

  function status(msg) {
    root.textContent = "";
    root.appendChild(el("p", "text-micro text-muted", msg));
  }

  status("Loading reviews\u2026");
  fetch(root.getAttribute("data-src"), { credentials: "omit" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(build)
    .catch(function (err) {
      root.removeAttribute("data-state");
      status("Couldn't load the reviews (" + err.message + "). The raw file is linked above.");
    });

  function build(data) {
    var apps = data.apps; // [[slug, name], ...]
    var rows = data.r; // [appIndex, stars, "YYYY-MM-DD", version, author, title, text, id]
    var minD = rows.reduce(function (a, r) { return r[2] < a ? r[2] : a; }, "9999");
    var maxD = rows.reduce(function (a, r) { return r[2] > a ? r[2] : a; }, "0000");
    var counts = {};
    rows.forEach(function (r) { counts[r[0]] = (counts[r[0]] || 0) + 1; });
    var state = { app: "", stars: "", from: "", to: "", q: "", sort: "date-desc", page: 0 };

    root.textContent = "";
    root.setAttribute("data-state", "ready");
    var form = el("div", "flex flex-wrap gap-3");
    form.setAttribute("role", "search");
    form.setAttribute("aria-label", "Filter reviews");

    var appSel = el("select", CTRL);
    appSel.name = "app";
    appSel.style.maxWidth = "100%";
    option(appSel, "", "All apps (" + rows.length + ")");
    apps.map(function (a, i) { return [i, a[1], counts[i] || 0]; })
      .filter(function (a) { return a[2] > 0; })
      .sort(function (a, b) { return b[2] - a[2]; })
      .forEach(function (a) { option(appSel, String(a[0]), a[1] + " (" + a[2] + ")"); });

    var starSel = el("select", CTRL);
    starSel.name = "stars";
    option(starSel, "", "Any rating");
    [5, 4, 3, 2, 1].forEach(function (s) { option(starSel, String(s), s + (s === 1 ? " star" : " stars")); });
    option(starSel, "1-2", "1 or 2 stars");
    option(starSel, "4-5", "4 or 5 stars");

    function dateInput(name, val) {
      var d = el("input", CTRL);
      d.type = "date";
      d.name = name;
      d.min = minD;
      d.max = maxD;
      d.placeholder = val;
      return d;
    }
    var fromIn = dateInput("from", minD);
    var toIn = dateInput("to", maxD);

    var qIn = el("input", CTRL);
    qIn.type = "search";
    qIn.name = "q";
    qIn.placeholder = "e.g. backup";

    var sortSel = el("select", CTRL);
    sortSel.name = "sort";
    option(sortSel, "date-desc", "Newest first");
    option(sortSel, "date-asc", "Oldest first");
    option(sortSel, "stars-desc", "Highest rating");
    option(sortSel, "stars-asc", "Lowest rating");

    form.appendChild(field("App", appSel));
    form.appendChild(field("Rating", starSel));
    form.appendChild(field("From", fromIn));
    form.appendChild(field("To", toIn));
    form.appendChild(field("Contains", qIn));
    form.appendChild(field("Sort", sortSel));
    var reset = el("button", BTN, "Reset");
    reset.type = "button";
    reset.style.alignSelf = "flex-end";
    form.appendChild(reset);
    root.appendChild(form);

    var summary = el("p", "mt-3 text-micro text-muted");
    summary.setAttribute("aria-live", "polite");
    root.appendChild(summary);

    var wrap = el("div", "-mx-gutter overflow-x-auto overscroll-x-contain px-gutter");
    wrap.setAttribute("tabindex", "0");
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "All reviews");
    var table = el("table", "w-full border-collapse text-left text-micro");
    var thead = el("thead");
    table.appendChild(thead);
    // Narrow screens get one stacked column so long reviews don't scroll sideways.
    var narrowQ = window.matchMedia ? window.matchMedia("(max-width: 639px)") : { matches: false };
    var narrow = narrowQ.matches;
    function head() {
      thead.textContent = "";
      var hr = el("tr");
      (narrow ? ["Review"] : ["Date", "App", "Rating", "Review"]).forEach(function (h) {
        var th = el("th", TH, h);
        th.scope = "col";
        hr.appendChild(th);
      });
      thead.appendChild(hr);
    }
    head();
    var tbody = el("tbody");
    table.appendChild(tbody);
    wrap.appendChild(table);
    root.appendChild(wrap);

    var pager = el("div", "mt-3 flex flex-wrap items-center justify-between gap-3");
    var prev = el("button", BTN, "\u2190 Previous");
    prev.type = "button";
    var pageInfo = el("span", "text-micro text-muted");
    var next = el("button", BTN, "Next \u2192");
    next.type = "button";
    pager.appendChild(prev);
    pager.appendChild(pageInfo);
    pager.appendChild(next);
    root.appendChild(pager);

    var view = rows;
    function compute() {
      var a = state.app === "" ? -1 : +state.app;
      var s = state.stars, lo = 1, hi = 5;
      if (s.indexOf("-") > 0) { lo = +s.split("-")[0]; hi = +s.split("-")[1]; } else if (s) { lo = hi = +s; }
      var q = state.q.trim().toLowerCase();
      view = rows.filter(function (r) {
        if (a >= 0 && r[0] !== a) return false;
        if (r[1] < lo || r[1] > hi) return false;
        if (state.from && r[2] < state.from) return false;
        if (state.to && r[2] > state.to) return false;
        if (q && (r[5] + " " + r[6]).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      var k = state.sort;
      view.sort(function (x, y) {
        if (k === "stars-desc" && x[1] !== y[1]) return y[1] - x[1];
        if (k === "stars-asc" && x[1] !== y[1]) return x[1] - y[1];
        if (k === "date-asc") return x[2] < y[2] ? -1 : x[2] > y[2] ? 1 : 0;
        return x[2] < y[2] ? 1 : x[2] > y[2] ? -1 : 0;
      });
    }
    function render() {
      var pages = Math.max(1, Math.ceil(view.length / PAGE));
      if (state.page >= pages) state.page = pages - 1;
      var start = state.page * PAGE;
      var slice = view.slice(start, start + PAGE);
      var frag = document.createDocumentFragment();
      slice.forEach(function (r) {
        var tr = el("tr");
        tr.setAttribute("data-id", r[7]);
        var d = el(narrow ? "span" : "td", narrow ? "whitespace-nowrap" : TD + " whitespace-nowrap", fmtDate(r[2]));
        d.setAttribute("data-date", r[2]);
        var ap = el(narrow ? "span" : "td", narrow ? null : TD, apps[r[0]][1]);
        ap.setAttribute("data-app", "");
        var st = el(narrow ? "span" : "td", narrow ? "whitespace-nowrap" : TD + " whitespace-nowrap", stars(r[1]));
        st.setAttribute("aria-label", r[1] + " of 5 stars");
        st.setAttribute("data-stars", r[1]);
        var rv = el("td", TD);
        if (narrow) {
          var top = el("p", "flex flex-wrap gap-3 text-caption text-muted");
          top.appendChild(d);
          top.appendChild(st);
          top.appendChild(ap);
          top.style.marginBottom = "0.25rem";
          rv.appendChild(top);
        } else {
          tr.appendChild(d);
          tr.appendChild(ap);
          tr.appendChild(st);
          rv.style.minWidth = "18rem";
        }
        rv.appendChild(el("strong", "font-semibold text-fg", r[5]));
        var body = el("p", "text-muted", r[6]);
        body.style.whiteSpace = "pre-line";
        body.style.marginTop = "0.25rem";
        rv.appendChild(body);
        var meta = el("p", "text-caption text-muted", (r[4] ? r[4] : "anonymous") + (r[3] ? " \u00b7 v" + r[3] : ""));
        meta.style.marginTop = "0.25rem";
        meta.style.opacity = "0.75";
        rv.appendChild(meta);
        tr.appendChild(rv);
        frag.appendChild(tr);
      });
      tbody.textContent = "";
      if (!slice.length) {
        var tr0 = el("tr");
        var td0 = el("td", TD, "No reviews match these filters.");
        td0.colSpan = narrow ? 1 : 4;
        tr0.appendChild(td0);
        frag.appendChild(tr0);
      }
      tbody.appendChild(frag);
      summary.textContent = view.length
        ? "Showing " + (start + 1) + "\u2013" + (start + slice.length) + " of " + view.length + " matching reviews (" + rows.length + " total)."
        : "0 of " + rows.length + " reviews match.";
      pageInfo.textContent = "Page " + (state.page + 1) + " of " + pages;
      prev.disabled = state.page === 0;
      next.disabled = state.page >= pages - 1;
      prev.style.opacity = prev.disabled ? "0.4" : "";
      next.style.opacity = next.disabled ? "0.4" : "";
    }
    function update(resetPage) {
      if (resetPage) state.page = 0;
      compute();
      render();
    }
    var timer;
    function bind(input, key, evt) {
      input.addEventListener(evt, function () {
        state[key] = input.value;
        if (evt === "input") {
          clearTimeout(timer);
          timer = setTimeout(function () { update(true); }, 150);
        } else update(true);
      });
    }
    if (narrowQ.addEventListener) {
      narrowQ.addEventListener("change", function (e) { narrow = e.matches; head(); render(); });
    }
    bind(appSel, "app", "change");
    bind(starSel, "stars", "change");
    bind(fromIn, "from", "change");
    bind(toIn, "to", "change");
    bind(qIn, "q", "input");
    bind(sortSel, "sort", "change");
    prev.addEventListener("click", function () { state.page--; render(); root.scrollIntoView({ block: "start" }); });
    next.addEventListener("click", function () { state.page++; render(); root.scrollIntoView({ block: "start" }); });
    reset.addEventListener("click", function () {
      state = { app: "", stars: "", from: "", to: "", q: "", sort: "date-desc", page: 0 };
      appSel.value = starSel.value = fromIn.value = toIn.value = qIn.value = "";
      sortSel.value = "date-desc";
      update(true);
    });
    update(true);
  }
})();
