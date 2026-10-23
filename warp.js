/* =====================================================================
   WARP SCROLL (all pages). You do not need to edit this file.

   When you reach the end of a page and keep scrolling, the background
   zooms in and the next page opens. The next page is the "next" link at
   the bottom of the page. A small bar shows how far you have pulled.

   Mouse wheel, trackpad, keyboard (Down, Page Down, Space, End) and
   touch (drag up at the bottom) all work. Remove the warp.js script tag
   from the html files to turn this off.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;

  /* Arrival: a tiny script at the top of the page adds "warp-in". It is
     removed again once the zoom-out animation has finished. */
  if (root.classList.contains("warp-in")) {
    setTimeout(function () { root.classList.remove("warp-in"); }, 1800);
  }

  var next = document.querySelector('.pager a[rel="next"]');
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!next || calm) return;

  var THRESH_WHEEL = 900;   /* wheel distance needed, in pixels */
  var THRESH_TOUCH = 200;   /* finger drag needed, in pixels */
  var KEY_STEP = 0.34;      /* each key press, as a share of the distance */
  var ARM_DELAY = 650;      /* ms of calm after the last real scroll */

  var label = (next.textContent || "").replace(/[→\s]+$/, "").trim() || "the next page";

  var hint = document.createElement("div");
  hint.className = "warp-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.innerHTML = '<span class="wh-label"></span><span class="wh-bar"><i></i></span>';
  hint.querySelector(".wh-label").textContent = "Keep scrolling to open " + label;
  var bar = hint.querySelector("i");
  var glow = document.createElement("div");
  glow.className = "warp-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(hint);
  document.body.appendChild(glow);

  var acc = 0, target = 0, shown = 0, raf = 0, idle = 0;
  var busy = false, touching = false, touchStart = null;
  var lastScroll = Date.now();

  function atBottom() {
    return Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2;
  }
  function armed() {
    return !busy && atBottom() && Date.now() - lastScroll > ARM_DELAY;
  }

  function apply(p) {
    root.style.setProperty("--wp", p.toFixed(4));
    hint.classList.toggle("on", p > 0.03);
    bar.style.transform = "scaleX(" + p.toFixed(3) + ")";
  }
  function tick() {
    raf = 0;
    var d = target - shown;
    shown += d * (d > 0 ? 0.35 : 0.12);
    if (Math.abs(target - shown) < 0.002) shown = target;
    apply(shown);
    if (shown !== target) raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function setProgress(px, thresh) {
    acc = Math.max(0, Math.min(thresh * 1.05, px));
    target = Math.min(1, acc / thresh);
    kick();
    if (target >= 1) go();
  }
  function relax() { acc = 0; target = 0; kick(); }
  function armIdle() {
    clearTimeout(idle);
    idle = setTimeout(function () { if (!touching && !busy) relax(); }, 550);
  }

  function go() {
    if (busy) return;
    busy = true;
    clearTimeout(idle);
    target = shown = 1;
    apply(1);
    root.classList.add("warp-out");
    try { sessionStorage.setItem("warpIn", "1"); } catch (e) {}
    setTimeout(function () { next.click(); }, 720);
    /* if the page did not change (for example the link was blocked), come back */
    setTimeout(reset, 4500);
  }
  function reset() {
    busy = false; touching = false; touchStart = null;
    root.classList.remove("warp-out");
    acc = 0; target = 0; shown = 0;
    apply(0);
  }
  /* coming back with the browser's Back button */
  window.addEventListener("pageshow", function (e) { if (e.persisted) reset(); });

  window.addEventListener("scroll", function () {
    lastScroll = Date.now();
    if (!busy && acc && !atBottom()) relax();
  }, { passive: true });

  /* mouse wheel and trackpad */
  window.addEventListener("wheel", function (e) {
    if (busy || e.ctrlKey) return;
    if (!armed()) { if (acc) relax(); return; }
    var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    if (dy > 0) { setProgress(acc + dy, THRESH_WHEEL); armIdle(); }
    else if (dy < 0) { setProgress(acc + dy * 2, THRESH_WHEEL); armIdle(); }
  }, { passive: true });

  /* keyboard */
  window.addEventListener("keydown", function (e) {
    if (busy || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k !== "ArrowDown" && k !== "PageDown" && k !== "End" && !(k === " " && !e.shiftKey)) return;
    var t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName) || t.isContentEditable)) return;
    if (document.querySelector(".lb:not([hidden])")) return;
    if (!armed()) return;
    setProgress(acc + KEY_STEP * THRESH_WHEEL, THRESH_WHEEL);
    armIdle();
  });

  /* touch: a fresh drag upwards while already at the bottom */
  window.addEventListener("touchstart", function (e) {
    if (busy || e.touches.length !== 1) return;
    touchStart = armed() ? e.touches[0].clientY : null;
    touching = touchStart !== null;
  }, { passive: true });
  window.addEventListener("touchmove", function (e) {
    if (touchStart === null || busy) return;
    if (!atBottom()) { touchStart = null; touching = false; relax(); return; }
    var dy = touchStart - e.touches[0].clientY;
    if (dy <= 0) { relax(); return; }
    setProgress(dy, THRESH_TOUCH);
  }, { passive: true });
  function touchEnd() {
    var was = touchStart !== null;
    touching = false; touchStart = null;
    if (was && !busy) relax();
  }
  window.addEventListener("touchend", touchEnd, { passive: true });
  window.addEventListener("touchcancel", touchEnd, { passive: true });
})();