/* =====================================================================
   SHARED SCRIPT (all pages). You do not need to edit this file.
   1. Photo viewer: click any photo inside the page to see it larger.
      Photos in the same gallery can be browsed with the arrows or the
      left and right keys. Esc or a click outside closes the viewer.
   2. Small helpers used by projects.js, certificates.js, experience.js.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function placeholder(label, path, cls) {
    var d = el("div", "ph" + (cls ? " " + cls : ""));
    var s = el("span", "", label || "Photo");
    if (path) {
      s.appendChild(document.createElement("br"));
      s.appendChild(el("small", "", path));
    }
    d.appendChild(s);
    return d;
  }

  /* Returns a photo. With no file (or a missing file) a labelled box is shown instead. */
  function photo(src, alt, cls, caption, label) {
    if (!src) return placeholder(label || alt, "", cls);
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    if (cls) img.className = cls;
    if (caption) img.setAttribute("data-caption", caption);
    img.addEventListener("error", function () {
      img.replaceWith(placeholder(label || alt || "Photo", src, cls));
    }, { once: true });
    return img;
  }
  window.PF = { el: el, photo: photo };

  /* ---------- photo viewer ---------- */
  var box, view, cap, count, prevB, nextB, closeB;
  var items = [], index = 0, opener = null, startX = null, prevOverflow = "";

  function build() {
    if (box) return;
    box = document.createElement("div");
    box.className = "lb";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<div class="lb-top"><span class="lb-count" aria-live="polite"></span>' +
      '<button type="button" class="lb-btn lb-close" aria-label="Close photo viewer">Close &times;</button></div>' +
      '<div class="lb-stage"><button type="button" class="lb-btn lb-prev" aria-label="Previous photo">&lsaquo;</button>' +
      '<img class="lb-img" alt=""><button type="button" class="lb-btn lb-next" aria-label="Next photo">&rsaquo;</button></div>' +
      '<p class="lb-cap"></p>';
    document.body.appendChild(box);
    view = box.querySelector(".lb-img");
    cap = box.querySelector(".lb-cap");
    count = box.querySelector(".lb-count");
    prevB = box.querySelector(".lb-prev");
    nextB = box.querySelector(".lb-next");
    closeB = box.querySelector(".lb-close");

    closeB.addEventListener("click", close);
    prevB.addEventListener("click", function () { show(index - 1); });
    nextB.addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lb-stage")) close();
    });
    box.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50 && items.length > 1) show(index + (dx < 0 ? 1 : -1));
    });
  }

  function groupFor(img) {
    var g = img.closest("[data-gallery]");
    var list = g ? [].slice.call(g.querySelectorAll("img")) : [img];
    return list.filter(function (i) { return !i.hasAttribute("data-nozoom"); });
  }

  function src(i) { return i.getAttribute("data-full") || i.currentSrc || i.src; }

  function show(i) {
    index = (i + items.length) % items.length;
    var it = items[index];
    view.src = src(it);
    view.alt = it.alt || "";
    cap.textContent = it.getAttribute("data-caption") || it.alt || "";
    count.textContent = items.length > 1 ? (index + 1) + " / " + items.length : "";
    prevB.hidden = nextB.hidden = items.length < 2;
    if (items.length > 1) {
      new Image().src = src(items[(index + 1) % items.length]);
      new Image().src = src(items[(index - 1 + items.length) % items.length]);
    }
  }

  function open(img) {
    build();
    items = groupFor(img);
    var at = items.indexOf(img);
    if (at < 0) { items = [img]; at = 0; }
    opener = img;
    show(at);
    box.hidden = false;
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeB.focus();
  }

  function close() {
    if (!box || box.hidden) return;
    box.hidden = true;
    view.removeAttribute("src");
    document.documentElement.style.overflow = prevOverflow;
    if (opener && opener.focus) opener.focus();
  }

  document.addEventListener("click", function (e) {
    var img = e.target.closest ? e.target.closest("main img") : null;
    if (!img || img.hasAttribute("data-nozoom") || img.classList.contains("ico")) return;
    e.preventDefault();
    open(img);
  });

  document.addEventListener("keydown", function (e) {
    if (box && !box.hidden) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowLeft" && items.length > 1) { e.preventDefault(); show(index - 1); }
      else if (e.key === "ArrowRight" && items.length > 1) { e.preventDefault(); show(index + 1); }
      else if (e.key === "Tab") {
        var f = [closeB, prevB, nextB].filter(function (b) { return !b.hidden; });
        var at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    } else if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("main img")) {
      e.preventDefault();
      open(e.target);
    }
  });

  /* Make every photo reachable with the keyboard, including ones added later. */
  function prep() {
    [].forEach.call(document.querySelectorAll("main img:not([data-nozoom]):not(.ico)"), function (img) {
      if (img.hasAttribute("tabindex")) return;
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "View larger: " + (img.alt || "photo"));
    });
  }
  /* Small icons (class "ico"): if the PNG file is missing, show a neutral
     tile with the letters from data-fallback instead of a broken image. */
  function iconFallback(img) {
    var t = el("span", img.className + " ico-fallback", img.getAttribute("data-fallback") || "?");
    t.setAttribute("aria-hidden", "true");
    img.replaceWith(t);
  }
  [].forEach.call(document.querySelectorAll("img.ico"), function (img) {
    if (img.complete && img.naturalWidth === 0) iconFallback(img);
    else img.addEventListener("error", function () { iconFallback(img); }, { once: true });
  });

  [].forEach.call(document.querySelectorAll("img.portrait-img"), function (img) {
    function swap() { img.replaceWith(placeholder("Your photo", img.getAttribute("src"), "portrait")); }
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener("error", swap, { once: true });
  });

  prep();
  new MutationObserver(prep).observe(document.body, { childList: true, subtree: true });
})();