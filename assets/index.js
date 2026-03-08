// Navbar scroll effect
window.addEventListener("scroll", function () {
    const nav = document.querySelector(".js-header");
    nav.classList.toggle("nav-scrolled", window.scrollY > 50);
});

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const hero = document.getElementById("hero");

    if (toggle && menu && hero) {
        toggle.addEventListener("click", () => {
            const isOpen = menu.style.display === "flex";
            menu.style.display = isOpen ? "none" : "flex";
            hero.style.opacity = isOpen ? "1" : "0";
            document.body.style.overflow = isOpen ? "auto" : "hidden";
        });
    }
});

function closeMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const hero = document.getElementById("hero");
    if (menu && hero) {
        menu.style.display = "none";
        hero.style.opacity = "1";
        document.body.style.overflow = "auto";
    }
}

// Testimonial carousel
(function () {
    const testimonials = [
        {
            text: "Sem dúvida a escolha mais acertada do profissional com quem trabalho! O José tem uma dedicação enorme e trabalhar com ele é saber que o trabalho sairá perfeito. Faz jus a todas as minhas ideias e consegue melhorá-las e concretizá-las da melhor forma. Confio a 100% no trabalho",
            author: "Rita Rocha",
            role: "CEO, Dulari Store",
        },
        {
            text: "Adorei trabalhar com o José! A entrega, empatia e profissionalismo deixaram-me fã desde o primeiro contacto. Todo o serviço foi 5 estrelas e fiquei extremamente satisfeita. Foi tudo entregue rapidamente e o resultado simplesmente incrível! Com toda a certeza voltarei a trabalhar convosco.",
            author: "Maria Monteiro",
            role: "CEO, Pura - Atelier de Beleza",
        },
        {
            text: "Recomendo a Cosmos Media. Adapta-se ao teu projeto e/ou visão da tua marca . Ajuda-te em todo o teu processo e ideias.",
            author: "Domingos Castro",
            role: "CEO, Transportes Domingo Castro",
        },
        {
            text: "O José Mário tem sido uma peça fundamental no projeto Sr. Saudável. É um profissional extremamente competente, perfecionista e comprometido com a excelência em cada detalhe. Dá-nos uma enorme segurança em todo o processo e é alguém em quem confiamos plenamente. Para além do talento técnico, destaca-se pelo companheirismo e espírito de entreajuda. Um verdadeiro profissional de referência.",
            author: "Sr.Saudável",
            role: "CEO, Rafaela Silva & Catarina Silva",
        },
    ];

    let currentIndex = 0;

    function updateTestimonial(index) {
        currentIndex = (index + testimonials.length) % testimonials.length;
        const t = testimonials[currentIndex];
        const textEl = document.getElementById("testimonial-text");
        const authorEl = document.getElementById("testimonial-author");
        const roleEl = document.getElementById("testimonial-role");
        const dots = document.querySelectorAll("[data-index]");

        if (textEl) textEl.textContent = `"${t.text}"`;
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
            // width of one repetition (half of total scrollWidth)
            let repeatWidth = 0;
            // scrolling speed in pixels per second
            let speed = 0;
            let lastFrame = null;
            let paused = false;
            let direction = 1; // 1 for right, -1 for left

            const updateRepeatWidth = () => {
                repeatWidth = marquee.scrollWidth / 2;
                // calculate speed so that one repeat takes 30s
                if (repeatWidth > 0) {
                    speed = repeatWidth / 30; // px per second
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
                    marquee.scrollLeft += speed * direction * (dt / 1000);
                    if (marquee.scrollLeft >= repeatWidth) {
                        direction = -1;
                        marquee.scrollLeft =
                            repeatWidth - (marquee.scrollLeft - repeatWidth);
                    } else if (marquee.scrollLeft < 0) {
                        direction = 1;
                        marquee.scrollLeft = -marquee.scrollLeft;
                    }
                }
                requestAnimationFrame(animate);
            };

            // start animation loop
            updateRepeatWidth();
            window.addEventListener("resize", updateRepeatWidth);
            requestAnimationFrame(animate);

            marquee.addEventListener("pointerdown", (e) => {
                // prevent default text selection/drag behavior
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
                const walk = x - startX; // distance moved
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
