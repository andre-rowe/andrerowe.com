/* andrerowe.com - progressive enhancement only.
   Everything on this site works with JS disabled; this file adds
   scroll reveals, chapter scrollspy, and the systems/design lens. */

document.documentElement.classList.add("js");

/* ---------- scroll reveals ---------- */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
}

/* ---------- chapter scrollspy ---------- */
const chapterNav = document.querySelector(".chapters");
if (chapterNav && "IntersectionObserver" in window) {
  const links = [...chapterNav.querySelectorAll("a[href^='#']")];
  const map = new Map();
  links.forEach((a) => {
    const sec = document.querySelector(a.getAttribute("href"));
    if (sec) map.set(sec, a);
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.remove("now"));
        const a = map.get(e.target);
        if (a) a.classList.add("now");
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  map.forEach((_, sec) => spy.observe(sec));
}

/* ---------- systems / design lens ---------- */
const lens = document.querySelector(".lens");
if (lens) {
  const buttons = lens.querySelectorAll("button");
  const swap = (mode) => {
    document.querySelectorAll("[data-lens]").forEach((el) => {
      el.classList.add("lens-fade");
    });
    setTimeout(() => {
      document.querySelectorAll("[data-lens]").forEach((el) => {
        const next = el.getAttribute(mode === "design" ? "data-design" : "data-systems");
        if (next) el.textContent = next;
        el.classList.remove("lens-fade");
      });
    }, 250);
    document.body.classList.toggle("lens-design", mode === "design");
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  };
  buttons.forEach((b) => b.addEventListener("click", () => swap(b.dataset.mode)));
}
