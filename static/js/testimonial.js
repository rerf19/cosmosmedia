// Testimonial carousel - supports both static data and Django-injected data
(function () {
    // Default testimonials (fallback if no Django data)
    const defaultTestimonials = [
        {
            text: "Sem dúvida a escolha mais acertada do profissional com quem trabalho! O José tem uma dedicação enorme e trabalhar com ele é saber que o trabalho sairá perfeito.",
            author: "Rita Rocha",
            role: "CEO, Dulari Store",
        },
        {
            text: "Adorei trabalhar com o José! A entrega, empatia e profissionalismo deixaram-me fã desde o primeiro contacto. Todo o serviço foi 5 estrelas e fiquei extremamente satisfeita.",
            author: "Maria Monteiro",
            role: "CEO, Pura - Atelier de Beleza",
        },
        {
            text: "Recomendo a Cosmos Media. Adapta-se ao teu projeto e/ou visão da tua marca. Ajuda-te em todo o teu processo e ideias.",
            author: "Domingos Castro",
            role: "CEO, Transportes Domingo Castro",
        },
        {
            text: "O José Mário tem sido uma peça fundamental no projeto Sr. Saudável. É um profissional extremamente competente, perfecionista e comprometido com a excelência em cada detalhe.",
            author: "Sr.Saudável",
            role: "CEO, Rafaela Silva & Catarina Silva",
        },
    ];

    // Use Django-injected testimonials if available, otherwise use defaults
    const testimonials =
        window.djangoTestimonials && window.djangoTestimonials.length > 0
            ? window.djangoTestimonials
            : defaultTestimonials;

    let currentIndex = 0;

    function updateTestimonial(index) {
        currentIndex = (index + testimonials.length) % testimonials.length;
        const t = testimonials[currentIndex];
        const textEl = document.getElementById("testimonial-text");
        const authorEl = document.getElementById("testimonial-author");
        const roleEl = document.getElementById("testimonial-role");
        const dots = document.querySelectorAll("[data-index]");

        if (textEl) textEl.textContent = '"' + t.text + '"';
        if (authorEl) authorEl.textContent = t.author;
        if (roleEl) roleEl.textContent = t.role;

        dots.forEach((dot) => {
            const idx = parseInt(dot.getAttribute("data-index"), 10);
            if (idx === currentIndex) {
                dot.classList.add("bg-primary", "w-8");
                dot.classList.remove("bg-border", "w-2");
            } else {
                dot.classList.remove("bg-primary", "w-8");
                dot.classList.add("bg-border", "w-2");
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const prevBtn = document.getElementById("testimonial-prev");
        const nextBtn = document.getElementById("testimonial-next");
        const dots = document.querySelectorAll("[data-index]");

        if (prevBtn) {
            prevBtn.addEventListener("click", () =>
                updateTestimonial(currentIndex - 1),
            );
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", () =>
                updateTestimonial(currentIndex + 1),
            );
        }
        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                const i = parseInt(dot.getAttribute("data-index"), 10);
                updateTestimonial(i);
            });
        });

        // render first testimonial so indicators are correct
        updateTestimonial(currentIndex);

        /* make marquee draggable with mouse/pointer, plus automatic scrolling */
        const marquee = document.querySelector(".marquee");
        if (marquee) {
            let isDown = false;
            let startX;
            let scrollLeft;
            let repeatWidth = 0;
            let speed = 0;
            let lastFrame = null;
            let paused = false;

            const updateRepeatWidth = () => {
                repeatWidth = marquee.scrollWidth / 2;
                if (repeatWidth > 0) {
                    speed = repeatWidth / 30;
                }
            };

            const normalizeScroll = () => {
                if (repeatWidth === 0) return;
                if (marquee.scrollLeft >= repeatWidth) {
                    marquee.scrollLeft -= repeatWidth;
                } else if (marquee.scrollLeft < 0) {
                    marquee.scrollLeft += repeatWidth;
                }
            };

            const animate = (time) => {
                if (!lastFrame) {
                    lastFrame = time;
                }
                const dt = time - lastFrame;
                lastFrame = time;
                if (!paused) {
                    marquee.scrollLeft += speed * (dt / 1000);
                    if (repeatWidth > 0 && marquee.scrollLeft >= repeatWidth) {
                        marquee.scrollLeft -= repeatWidth;
                    }
                }
                requestAnimationFrame(animate);
            };

            updateRepeatWidth();
            window.addEventListener("resize", updateRepeatWidth);
            requestAnimationFrame(animate);

            marquee.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                isDown = true;
                paused = true;
                marquee.setPointerCapture(e.pointerId);
                startX = e.clientX;
                scrollLeft = marquee.scrollLeft;
                marquee.classList.add("grabbing");
            });

            marquee.addEventListener("pointermove", (e) => {
                if (!isDown) return;
                const x = e.clientX;
                const walk = x - startX;
                marquee.scrollLeft = scrollLeft - walk;
                normalizeScroll();
            });

            const stopDrag = (e) => {
                if (!isDown) return;
                isDown = false;
                paused = false;
                marquee.releasePointerCapture(e.pointerId);
                marquee.classList.remove("grabbing");
            };

            marquee.addEventListener("pointerup", stopDrag);
            marquee.addEventListener("pointercancel", stopDrag);
        }
    });
})();
