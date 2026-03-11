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
