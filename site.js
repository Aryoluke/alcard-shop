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

    /* 5) Back-to-top button — injected so every page gets it with zero markup */
    var topBtn = document.createElement("button");
    topBtn.className = "back-top";
    topBtn.setAttribute("type", "button");
    topBtn.setAttribute("aria-label", "Back to top");
    topBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(topBtn);
    var onScrollTop = function () {
        if (window.scrollY > 500) topBtn.classList.add("show");
        else topBtn.classList.remove("show");
    };
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* 6) Floating WhatsApp bubble — the real support channel, on every page
       except the customer-facing tap demo (model.html marks itself .no-wa-bubble) */
    if (!document.body.classList.contains("no-wa-bubble")) {
        var waBubble = document.createElement("a");
        waBubble.className = "wa-bubble";
        waBubble.href = "https://wa.me/447777940152?text=Hi!%20I%27ve%20got%20a%20question%20about%20Alcard.";
        waBubble.target = "_blank";
        waBubble.rel = "noopener";
        waBubble.setAttribute("aria-label", "Chat with Alcard on WhatsApp");
        waBubble.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.19 4.23-9.42 9.43-9.42a9.36 9.36 0 0 1 6.66 2.76 9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.24 9.42-9.44 9.42zm8.3-17.72A11.26 11.26 0 0 0 12.04.71 11.29 11.29 0 0 0 .75 12.03c0 1.99.52 3.93 1.51 5.64L.63 23.37l5.82-1.53a11.27 11.27 0 0 0 5.59 1.42h.01c6.22 0 11.28-5.06 11.28-11.28 0-3.01-1.17-5.85-3.3-7.99z"/></svg>';
        document.body.appendChild(waBubble);
    }

    /* 7) Count-up stats — any element with [data-count] animates once when visible */
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length && "IntersectionObserver" in window) {
        var countIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                countIO.unobserve(el);
                var target = parseFloat(el.getAttribute("data-count"));
                var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
                var prefix = el.getAttribute("data-prefix") || "";
                var suffix = el.getAttribute("data-suffix") || "";
                var t0 = null;
                var dur = 1200;
                var step = function (ts) {
                    if (!t0) t0 = ts;
                    var p = Math.min((ts - t0) / dur, 1);
                    p = 1 - Math.pow(1 - p, 3); // ease-out
                    el.textContent = prefix + (target * p).toFixed(dec) + suffix;
                    if (p < 1) requestAnimationFrame(step);
                    else el.textContent = prefix + target.toFixed(dec) + suffix;
                };
                requestAnimationFrame(step);
            });
        }, { threshold: 0.4 });
        counters.forEach(function (el) { countIO.observe(el); });
    }

    /* 8) 3D tilt on the hero tap-card (desktop pointer only) */
    var tapCard = document.querySelector(".tap-card");
    if (tapCard && window.matchMedia("(hover: hover) and (min-width: 961px)").matches) {
        var stage = tapCard.closest(".stage") || tapCard.parentElement;
        var raf = null;
        stage.addEventListener("mousemove", function (e) {
            var r = stage.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(function () {
                tapCard.classList.add("tilt"); // pause the float animation
                tapCard.style.transform =
                    "perspective(900px) rotateY(" + (px * 14).toFixed(2) + "deg) rotateX(" + (-py * 12).toFixed(2) + "deg) translateZ(6px)";
            });
        });
        stage.addEventListener("mouseleave", function () {
            if (raf) cancelAnimationFrame(raf);
            tapCard.classList.remove("tilt");
            tapCard.style.transform = "";
        });
    }
})();
