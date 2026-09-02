/* ============================================
   VENERA main.js - interactions
   ============================================ */

(function () {
  "use strict";

  /* ---------- i18n apply ---------- */
  var LANG_KEY = "venera_lang";
  var PAGE = document.body.dataset.page || detectPage();

  function detectPage() {
    var p = location.pathname.split("/").pop();
    if (p === "about.html") return "about";
    if (p === "services.html") return "services";
    if (p === "contact.html") return "contact";
    return "index";
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.cn;
    document.documentElement.lang = lang === "cn" ? "zh-CN" : lang;

    // page title
    var titleKey = "title." + PAGE;
    if (dict[titleKey]) document.title = dict[titleKey];

    // text nodes
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        if (dict[key].indexOf("<") !== -1) {
          nodes[i].innerHTML = dict[key];
        } else {
          nodes[i].textContent = dict[key];
        }
      }
    }

    // placeholders
    var phNodes = document.querySelectorAll("[data-i18n-ph]");
    for (var j = 0; j < phNodes.length; j++) {
      var phKey = phNodes[j].getAttribute("data-i18n-ph");
      if (dict[phKey] !== undefined) phNodes[j].setAttribute("placeholder", dict[phKey]);
    }

    // buttons state
    var btns = document.querySelectorAll("#langSwitch button");
    for (var k = 0; k < btns.length; k++) {
      btns[k].classList.toggle("active", btns[k].getAttribute("data-lang") === lang);
    }

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* noop */ }
  }

  var langSwitch = document.getElementById("langSwitch");
  if (langSwitch) {
    langSwitch.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-lang]");
      if (btn) applyLang(btn.getAttribute("data-lang"));
    });
  }

  // restore saved language
  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* noop */ }
  if (saved && saved !== "cn" && I18N[saved]) {
    applyLang(saved);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") mainNav.classList.remove("open");
    });
  }

  /* ---------- Scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    var reveals = document.querySelectorAll(".reveal");
    for (var r = 0; r < reveals.length; r++) io.observe(reveals[r]);
  } else {
    var all = document.querySelectorAll(".reveal");
    for (var q = 0; q < all.length; q++) all[q].classList.add("visible");
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  for (var f = 0; f < faqItems.length; f++) {
    (function (item) {
      item.querySelector(".faq-q").addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        for (var m = 0; m < faqItems.length; m++) faqItems[m].classList.remove("open");
        if (!isOpen) item.classList.add("open");
      });
    })(faqItems[f]);
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = document.getElementById("formSuccess");
      if (success) {
        success.style.display = "block";
        form.reset();
        showToast();
      }
    });
  }

  /* ---------- Toast ---------- */
  function showToast() {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = "✓ OK";
    document.body.appendChild(toast);
    // replace text with current lang
    var lang = "cn";
    try { lang = localStorage.getItem(LANG_KEY) || "cn"; } catch (e) { /* noop */ }
    var dict = I18N[lang] || I18N.cn;
    toast.textContent = dict["ct.f.success"] || toast.textContent;
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.remove(); }, 400);
    }, 3000);
  }
})();
