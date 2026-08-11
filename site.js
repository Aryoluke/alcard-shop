/* Alcard — site-wide behaviours (no dependencies) */
(function () {
    "use strict";

    /* 1) Sticky nav gains a border once the page is scrolled */
    var nav = document.querySelector("nav");
    var onScroll = function () {
        if (!nav) return;
        if (window.scrollY > 8) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* 2) Scroll-reveal for elements marked .reveal
       Content is hidden only under @media (scripting: enabled), so a broken
       script can never leave the page blank — and if the observer itself
       fails, everything is revealed as a fallback. */
    var revealEls = document.querySelectorAll(".reveal");
    try {
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add("in"); });
        }
    } catch (err) {
        revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* 3) Mobile menu (hamburger) */
    var menuBtn = document.getElementById("menuBtn");
    var navLinks = document.getElementById("navLinks");
    function closeMenu() {
        if (!navLinks || !menuBtn) return;
        navLinks.classList.remove("open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
    }
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", function () {
            var open = navLinks.classList.toggle("open");
            menuBtn.classList.toggle("open", open);
            menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
            menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });
        navLinks.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", closeMenu);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeMenu();
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth > 960) closeMenu();
        }, { passive: true });
    }

    /* 4) Add current year to any .js-year placeholder (keeps copyright fresh) */
    var yr = new Date().getFullYear();
    document.querySelectorAll(".js-year").forEach(function (el) {
        el.textContent = yr;
    });
})();
