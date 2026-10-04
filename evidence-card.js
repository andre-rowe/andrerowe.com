/*
 * Evidence card component for andrerowe.com
 * Category: PROFESSIONAL EXPERIENCE (component code; every card carries its own category label)
 * Version 1.1, October 3, 2026 (reconstructed banner on every RECONSTRUCTED card). Vanilla JS, no dependencies, works from file://.
 *
 * Data comes from the evidence registry, embedded in each page as window.EVIDENCE_REGISTRY by the site build.
 *
 * Usage:
 *   1. <evidence-card data-id="CS-1"></evidence-card>      (looks the record up in window.EVIDENCE_REGISTRY)
 *   2. EvidenceCard.render(record)                         (returns an <article> element)
 *   3. EvidenceCard.mountAll(container, records)           (renders a list into a container)
 */
(function () {
  "use strict";

  var CATEGORIES = {
    "PROFESSIONAL EXPERIENCE": { key: "pro", icon: "◆" },              // diamond
    "RECONSTRUCTED PROFESSIONAL ARTIFACT": { key: "rec", icon: "■" },  // square
    "ACADEMIC PROJECT": { key: "aca", icon: "▲" },                     // triangle
    "SIMULATED PROFESSIONAL PROJECT": { key: "sim", icon: "●" },       // circle
    "HANDS-ON LAB": { key: "lab", icon: "★" }                          // star
  };

  var RECONSTRUCTED_BANNER = [
    "RECONSTRUCTED FROM PROFESSIONAL EXPERIENCE",
    "USES FICTIONAL DATA",
    "NOT AN ORIGINAL EMPLOYER DOCUMENT"
  ];

  var LANES = {
    endpoint: "Endpoint and Enterprise IT",
    cyber: "Cybersecurity",
    iam: "IAM",
    grc: "GRC",
    ops: "Technical Operations"
  };

  /*
   * Status shown on the public page. "Offline until push" and "Ready to publish" describe the
   * state before the site is pushed; the public page only exists after that push, so they show as Published.
   */
  var STATUS_DISPLAY = {
    "Published": { label: "Published", key: "published" },
    "Offline until push": { label: "Published", key: "published" },
    "Ready to publish": { label: "Published", key: "published" },
    "IMPLEMENTED / TESTED / VERIFIED": { label: "IMPLEMENTED / TESTED / VERIFIED", key: "implemented", icon: "✓" },
    "DESIGNED / READY TO IMPLEMENT": { label: "DESIGNED / READY TO IMPLEMENT", key: "designed", icon: "○" },
    "In progress": { label: "In progress", key: "progress" },
    "Draft": { label: "Draft", key: "draft" },
    "Complete (private)": { label: "Complete", key: "complete" },
    "Complete (link pending)": { label: "Complete", key: "complete" },
    "Archive": { label: "Archive", key: "archive" }
  };

  function statusInfo(status) {
    return STATUS_DISPLAY[status] || { label: status || "Unknown", key: "other" };
  }

  /* Text shown instead of a link when a record has no public artifact. Never a broken link. */
  function fallbackText(record) {
    var s = (record.status || "").toLowerCase();
    if (s.indexOf("designed") !== -1 || s.indexOf("draft") !== -1 || s.indexOf("in progress") !== -1) {
      return "In progress";
    }
    return "Available on request";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function srOnly(text) {
    return el("span", "ev-sr", text);
  }

  function findRecord(id) {
    var list = window.EVIDENCE_REGISTRY || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function categoryBadge(category) {
    var info = CATEGORIES[category] || { key: "other", icon: "" };
    var badge = el("span", "ev-badge ev-cat ev-cat--" + info.key);
    badge.appendChild(srOnly("Category: "));
    var icon = el("span", "ev-badge__icon", info.icon);
    icon.setAttribute("aria-hidden", "true");
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(category));
    return badge;
  }

  function statusBadge(status) {
    var info = statusInfo(status);
    var badge = el("span", "ev-badge ev-status ev-status--" + info.key);
    badge.appendChild(srOnly("Status: "));
    if (info.icon) {
      var icon = el("span", "ev-badge__icon", info.icon);
      icon.setAttribute("aria-hidden", "true");
      badge.appendChild(icon);
    }
    badge.appendChild(document.createTextNode(info.label));
    return badge;
  }

  function field(dl, label, value, node) {
    var wrap = el("div", "ev-field");
    wrap.appendChild(el("dt", "ev-field__label", label));
    var dd = el("dd", "ev-field__value");
    if (node) dd.appendChild(node); else dd.textContent = value || "Not applicable";
    wrap.appendChild(dd);
    dl.appendChild(wrap);
  }

  function relatedNode(id, selfId) {
    if (!id) return null;
    if (id === selfId) return document.createTextNode(id + " (this item)");
    var target = findRecord(id);
    if (!target) return document.createTextNode(id);
    var a = el("a", "ev-link", id + ": " + target.artifact_name);
    a.href = "evidence.html#ev-" + id;
    return a;
  }

  function render(record, options) {
    options = options || {};
    var headingLevel = options.headingLevel || 3;
    var cat = CATEGORIES[record.category] || { key: "other" };
    var st = statusInfo(record.status);

    var card = el("article", "ev-card ev-card--" + cat.key);
    card.id = "ev-" + record.id;
    card.setAttribute("data-id", record.id);
    card.setAttribute("data-category", record.category);
    card.setAttribute("data-status", st.label);
    card.setAttribute("data-lanes", (record.lanes || []).join(" "));

    var head = el("div", "ev-card__head");
    var badges = el("div", "ev-card__badges");
    badges.appendChild(categoryBadge(record.category));
    badges.appendChild(statusBadge(record.status));
    head.appendChild(badges);

    var idLine = el("p", "ev-card__id", record.id);
    head.appendChild(idLine);
    var titleId = "ev-title-" + record.id;
    var h = el("h" + headingLevel, "ev-card__title", record.artifact_name);
    h.id = titleId;
    card.setAttribute("aria-labelledby", titleId);
    head.appendChild(h);
    card.appendChild(head);

    /* Every reconstructed card carries the three-line banner (canonical record section 7). */
    if (record.category === "RECONSTRUCTED PROFESSIONAL ARTIFACT") {
      var banner = el("p", "ev-card__banner");
      RECONSTRUCTED_BANNER.forEach(function (line) { banner.appendChild(el("span", null, line)); });
      card.appendChild(banner);
    }

    var dl = el("dl", "ev-card__fields");
    field(dl, "Problem", record.problem);
    field(dl, "What it demonstrates", record.what_it_demonstrates);
    field(dl, "Environment", record.environment);
    field(dl, "Evidence type", record.evidence_type);
    field(dl, "Related skill", record.related_skill);
    var rel = relatedNode(record.related_case_study, record.id);
    field(dl, "Related case study", record.related_case_study ? null : "None", rel);
    card.appendChild(dl);

    var foot = el("div", "ev-card__foot");
    foot.appendChild(el("span", "ev-card__foot-label", "View artifact"));
    if (record.public && record.view_artifact) {
      var a = el("a", "ev-card__cta", "Open");
      a.href = record.view_artifact;
      a.appendChild(srOnly(" " + record.artifact_name));
      if (/^https?:\/\//.test(record.view_artifact)) {
        a.rel = "noopener";
        a.appendChild(srOnly(" (external site)"));
      }
      foot.appendChild(a);
    } else {
      var text = fallbackText(record);
      var span = el("span", "ev-card__unavailable ev-card__unavailable--" + (text === "In progress" ? "progress" : "request"), text);
      foot.appendChild(span);
    }
    card.appendChild(foot);
    return card;
  }

  function mountAll(container, records, options) {
    container.textContent = "";
    for (var i = 0; i < records.length; i++) container.appendChild(render(records[i], options));
  }

  function pick(ids) {
    var out = [];
    for (var i = 0; i < ids.length; i++) {
      var r = findRecord(ids[i]);
      if (r) out.push(r);
    }
    return out;
  }

  /* Custom element: <evidence-card data-id="AR-02" data-heading-level="3"></evidence-card> */
  if (window.customElements && !window.customElements.get("evidence-card")) {
    class EvidenceCardElement extends HTMLElement {
      connectedCallback() {
        if (this._rendered) return;
        var record = findRecord(this.getAttribute("data-id"));
        if (!record) return;
        this._rendered = true;
        var level = parseInt(this.getAttribute("data-heading-level"), 10) || 3;
        this.appendChild(render(record, { headingLevel: level }));
      }
    }
    window.customElements.define("evidence-card", EvidenceCardElement);
  }

  window.EvidenceCard = {
    render: render,
    mountAll: mountAll,
    pick: pick,
    find: findRecord,
    statusLabel: function (status) { return statusInfo(status).label; },
    fallbackText: fallbackText,
    CATEGORIES: CATEGORIES,
    LANES: LANES
  };
})();
