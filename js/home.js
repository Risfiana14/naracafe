document.addEventListener("DOMContentLoaded", () => {

    mobileMenuBtn.addEventListener("click", () => {
        nav.classList.toggle("active");
        console.log("Nav classes:", nav.className);
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu");
    const nav = document.querySelector("nav");

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (
                nav.classList.contains("active") &&
                !e.target.closest("nav") &&
                !e.target.closest(".mobile-menu")
            ) {
                nav.classList.remove("active");
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector("input[type='email']").value;
            alert(`Thanks for subscribing, ${email}!`);
            newsletterForm.reset();
        });
    }
});
