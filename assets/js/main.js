(function () {
  "use strict";

  var STORAGE_THEME = "lantern-theme";
  var STORAGE_PROGRESS = "lantern-last-read";

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var buttons = document.querySelectorAll(".theme-toggle button");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });
  }

  function initTheme() {
    var saved = localStorage.getItem(STORAGE_THEME);
    var preferred = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    applyTheme(preferred);

    document.querySelectorAll(".theme-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var theme = btn.dataset.theme;
        localStorage.setItem(STORAGE_THEME, theme);
        applyTheme(theme);
      });
    });
  }

  /* ---------- Reading progress bar ---------- */
  function initProgressBar() {
    var bar = document.querySelector(".progress-bar");
    if (!bar) return;
    var body = document.querySelector(".chapter-body");
    if (!body) return;

    function update() {
      var rect = body.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = -rect.top;
      var pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      bar.style.width = pct + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Continue reading (localStorage) ---------- */
  function trackChapter() {
    var meta = document.querySelector("[data-day]");
    if (!meta) return;
    var day = meta.getAttribute("data-day");
    var title = meta.getAttribute("data-chapter-title");
    var url = window.location.pathname;
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify({ day: day, title: title, url: url }));
  }

  function renderContinueCard() {
    var card = document.querySelector(".continue-card");
    if (!card) return;
    var raw = localStorage.getItem(STORAGE_PROGRESS);
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      if (!data || !data.url) return;
      card.querySelector(".title").textContent = "Chapter " + data.day + " — " + data.title;
      card.querySelector("a.resume-btn").setAttribute("href", data.url);
      card.classList.add("visible");
    } catch (e) { /* ignore malformed data */ }
  }

  /* ---------- Chapter search/filter ---------- */
  function initSearch() {
    var input = document.querySelector(".search-wrap input");
    if (!input) return;
    var items = document.querySelectorAll(".chapter-list li");
    var noResults = document.querySelector(".no-results");
    var actHeadings = document.querySelectorAll(".act-heading");

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var visibleCount = 0;
      items.forEach(function (li) {
        var text = li.textContent.toLowerCase();
        var match = text.indexOf(q) !== -1;
        li.classList.toggle("is-hidden", !match);
        if (match) visibleCount++;
      });
      actHeadings.forEach(function (h) {
        var next = h.nextElementSibling;
        var anyVisible = false;
        while (next && next.tagName === "OL") {
          next.querySelectorAll("li").forEach(function (li) {
            if (!li.classList.contains("is-hidden")) anyVisible = true;
          });
          next = next.nextElementSibling;
        }
        h.style.display = q === "" ? "" : (anyVisible ? "" : "none");
      });
      if (noResults) noResults.classList.toggle("visible", visibleCount === 0);
    });
  }

  /* ---------- Keyboard navigation ---------- */
  function initKeyboardNav() {
    var prev = document.querySelector(".chapter-nav-link.prev");
    var next = document.querySelector(".chapter-nav-link.next");
    if (!prev && !next) return;

    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft" && prev) window.location.href = prev.getAttribute("href");
      if (e.key === "ArrowRight" && next) window.location.href = next.getAttribute("href");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initProgressBar();
    trackChapter();
    renderContinueCard();
    initSearch();
    initKeyboardNav();
  });
})();
