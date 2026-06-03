// Counter animation - numbers count up when they scroll into view
(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const counters = document.querySelectorAll("[data-count]");
        if (!counters.length) return;

        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute("data-count"), 10);
            const suffix = el.getAttribute("data-suffix") || "";
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic for smooth deceleration
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.5,
            },
        );

        counters.forEach((counter) => {
            // Set initial value to 0
            const suffix = counter.getAttribute("data-suffix") || "";
            counter.textContent = "0" + suffix;
            observer.observe(counter);
        });
    });
})();
