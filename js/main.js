document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector(".mobile-menu");
  const navMenu = document.querySelector("nav");
  const body = document.body;

  if (mobileMenuButton && navMenu) {
    mobileMenuButton.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      body.classList.toggle("menu-open");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("active") &&
        !e.target.closest("nav") &&
        !e.target.closest(".mobile-menu")
      ) {
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });
  }

  // Sticky header
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    });
  }

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector("input[type='email']");
      if (emailInput && emailInput.value) {
        alert(
          `Thank you for subscribing to our newsletter with email: ${emailInput.value}`
        );
        emailInput.value = "";
      }
    });
  }

  // Scroll to top button
  const scrollTopButton = document.querySelector(".scroll-top");
  if (scrollTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopButton.classList.add("active");
      } else {
        scrollTopButton.classList.remove("active");
      }
    });

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Product quantity buttons
  const quantityButtons = document.querySelectorAll(".quantity-btn");
  if (quantityButtons.length > 0) {
    quantityButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const input = this.parentElement.querySelector("input");
        const currentValue = Number.parseInt(input.value);

        if (this.classList.contains("minus") && currentValue > 1) {
          input.value = currentValue - 1;
        } else if (this.classList.contains("plus")) {
          input.value = currentValue + 1;
        }

        // Trigger change event to update cart if needed
        const event = new Event("change");
        input.dispatchEvent(event);
      });
    });
  }

  // Tabs functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabContainer = this.closest(".tabs-container");
        const tabName = this.getAttribute("data-tab");

        // Remove active class from all buttons and content
        tabContainer
          .querySelectorAll(".tab-btn")
          .forEach((btn) => btn.classList.remove("active"));
        tabContainer
          .querySelectorAll(".tab-content")
          .forEach((content) => content.classList.remove("active"));

        // Add active class to clicked button and corresponding content
        this.classList.add("active");
        tabContainer
          .querySelector(`.tab-content[data-tab="${tabName}"]`)
          .classList.add("active");
      });
    });
  }

  // Dropdown menus
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  if (dropdownToggles.length > 0) {
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const dropdown = this.nextElementSibling;

        // Close all other dropdowns
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          if (menu !== dropdown) {
            menu.classList.remove("active");
          }
        });

        // Toggle current dropdown
        dropdown.classList.toggle("active");
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("active");
      });
    });
  }

  // Initialize sliders if any
  if (typeof initSliders === "function") {
    initSliders();
  }
});

// Function to initialize sliders (if needed)
function initSliders() {
  // This is a placeholder for slider initialization
  // In a real application, you would use a library like Swiper or create your own slider functionality
  console.log("Sliders initialized");
}
