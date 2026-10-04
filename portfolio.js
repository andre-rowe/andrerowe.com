/*
 * andrerowe.com evidence pages: card mounting and evidence filters
 * Category: PROFESSIONAL EXPERIENCE (site script)
 * Version 1, October 2026. Requires evidence-card.js and window.EVIDENCE_REGISTRY.
 */
(function () {
  "use strict";
  var EC = window.EvidenceCard;
  var REG = window.EVIDENCE_REGISTRY || [];
  if (!EC) return;

  /* <div data-evidence-ids="AR-02,AR-28"> renders those cards in that order. */
  var lists = document.querySelectorAll("[data-evidence-ids]");
  for (var i = 0; i < lists.length; i++) {
    var node = lists[i];
    var ids = node.getAttribute("data-evidence-ids").split(",").map(function (s) { return s.trim(); });
    var level = parseInt(node.getAttribute("data-heading-level"), 10) || 3;
    EC.mountAll(node, EC.pick(ids), { headingLevel: level });
  }

  /* Evidence library filters */
  var grid = document.getElementById("evidence-grid");
  if (grid) {
    var catSel = document.getElementById("filter-category");
    var laneSel = document.getElementById("filter-lane");
    var statusSel = document.getElementById("filter-status");
    var reset = document.getElementById("filter-reset");
    var count = document.getElementById("result-count");
    var empty = document.getElementById("evidence-empty");

    Object.keys(EC.CATEGORIES).forEach(function (c) { catSel.appendChild(new Option(c, c)); });
    Object.keys(EC.LANES).forEach(function (k) { laneSel.appendChild(new Option(EC.LANES[k], k)); });
    var order = ["Published", "Complete", "Draft", "In progress", "DESIGNED / READY TO IMPLEMENT", "IMPLEMENTED / TESTED / VERIFIED", "Archive"];
    var seen = {};
    REG.forEach(function (r) { seen[EC.statusLabel(r.status)] = true; });
    order.forEach(function (s) { if (seen[s]) statusSel.appendChild(new Option(s, s)); });
    Object.keys(seen).forEach(function (s) { if (order.indexOf(s) === -1) statusSel.appendChild(new Option(s, s)); });

    var params = new URLSearchParams(window.location.search);
    if (params.get("category")) catSel.value = params.get("category");
    if (params.get("lane")) laneSel.value = params.get("lane");
    if (params.get("status")) statusSel.value = params.get("status");

    var apply = function () {
      var c = catSel.value, l = laneSel.value, s = statusSel.value;
      var shown = REG.filter(function (r) {
        return (!c || r.category === c) &&
          (!l || (r.lanes || []).indexOf(l) !== -1) &&
          (!s || EC.statusLabel(r.status) === s);
      });
      EC.mountAll(grid, shown, { headingLevel: 3 });
      count.textContent = "Showing " + shown.length + " of " + REG.length + " items";
      empty.hidden = shown.length !== 0;
    };
    [catSel, laneSel, statusSel].forEach(function (sel) { sel.addEventListener("change", apply); });
    reset.addEventListener("click", function () {
      catSel.value = ""; laneSel.value = ""; statusSel.value = "";
      apply();
      catSel.focus();
    });
    apply();
  }

  /* Cards are rendered by script, so jump to a #ev-ID target after rendering. */
  if (window.location.hash && window.location.hash.indexOf("#ev-") === 0) {
    var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    }
  }
})();
