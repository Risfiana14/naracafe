document.addEventListener("DOMContentLoaded", () => {
    // Toggle menu mobile
    const mobileMenuBtn = document.querySelector(".mobile-menu");
    const nav = document.querySelector("nav");
  
    if (mobileMenuBtn && nav) {
      mobileMenuBtn.addEventListener("click", () => {
        nav.classList.toggle("active");
        document.body.classList.toggle("menu-open");
        console.log("Nav toggled:", nav.className);
      });
  
      // Tutup nav jika klik di luar
      document.addEventListener("click", (e) => {
        if (
          nav.classList.contains("active") &&
          !e.target.closest("nav") &&
          !e.target.closest(".mobile-menu")
        ) {
          nav.classList.remove("active");
          document.body.classList.remove("menu-open");
        }
      });
  
      // Tutup nav saat klik menu link (UX)
      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      });
    }
  
    // Newsletter form handler
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector("input[type='email']");
        const email = emailInput ? emailInput.value.trim() : "";
  
        if (email) {
          alert(`Thanks for subscribing, ${email}!`);
          newsletterForm.reset();
        } else {
          alert("Please enter a valid email address.");
        }
      });
    }
  });
document.addEventListener("DOMContentLoaded", () => {
  // Toggle menu mobile
  const mobileMenuBtn = document.querySelector(".mobile-menu");
  const nav = document.querySelector("nav");

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      document.body.classList.toggle("menu-open");
      console.log("Nav toggled:", nav.className);
    });

    // Tutup nav jika klik di luar
    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("active") &&
        !e.target.closest("nav") &&
        !e.target.closest(".mobile-menu")
      ) {
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });

    // Tutup nav saat klik menu link (UX)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // Newsletter form handler
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector("input[type='email']");
      const email = emailInput ? emailInput.value.trim() : "";

      if (email) {
        alert(`Thanks for subscribing, ${email}!`);
        newsletterForm.reset();
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }
});
  