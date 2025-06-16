document.addEventListener("DOMContentLoaded", () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    loadProductDetails(productId);
  }

  // Option buttons (Size, Milk, Sugar)
  document.querySelectorAll(".option-group").forEach((group) => {
    const buttons = group.querySelectorAll(".option-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  });

  // Quantity buttons
  const minusBtn = document.querySelector(".quantity-btn.minus");
  const plusBtn = document.querySelector(".quantity-btn.plus");
  const quantityInput = document.querySelector(".quantity-buttons input");

  if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener("click", () => {
      let quantity = Number.parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
      }
    });

    plusBtn.addEventListener("click", () => {
      let quantity = Number.parseInt(quantityInput.value);
      if (quantity < 10) {
        quantityInput.value = quantity + 1;
      }
    });

    quantityInput.addEventListener("change", () => {
      let quantity = Number.parseInt(quantityInput.value);
      if (isNaN(quantity) || quantity < 1) {
        quantityInput.value = 1;
      } else if (quantity > 10) {
        quantityInput.value = 10;
      }
    });
  }

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Add to cart button
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const productName = document.querySelector("h1").textContent;
      const productPrice = parsePrice(
        document.querySelector(".current-price").textContent
      );
      const productImage = document.querySelector("#main-product-image").src;
      const quantity = Number.parseInt(quantityInput.value);

      // Get selected options
      const size =
        document.querySelector(
          ".option-group:nth-of-type(1) .option-btn.active"
        )?.textContent || "Medium";
      const milk =
        document.querySelector(
          ".option-group:nth-of-type(2) .option-btn.active"
        )?.textContent || "Whole";
      const sugar =
        document.querySelector(
          ".option-group:nth-of-type(3) .option-btn.active"
        )?.textContent || "None";

      // Adjust price based on size
      let adjustedPrice = productPrice;
      if (size === "Small") adjustedPrice *= 0.8;
      else if (size === "Large") adjustedPrice *= 1.2;

      // Adjust price based on milk
      if (milk === "Almond" || milk === "Oat") adjustedPrice += 5000;

      const product = {
        id: productId,
        name: productName,
        price: adjustedPrice,
        image: productImage,
        quantity: quantity,
        options: {
          size: size,
          milk: milk,
          sugar: sugar,
        },
      };

      // Add to cart
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = cart.findIndex(
        (item) =>
          item.id === productId &&
          item.options.size === size &&
          item.options.milk === milk &&
          item.options.sugar === sugar
      );

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${quantity} ${productName} added to cart!`);
      window.location.href = "cart.html";
    });
  }

  // Buy now button
  const buyNowBtn = document.querySelector(".buy-now-btn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      addToCartBtn.click();
      window.location.href = "checkout.html";
    });
  }
});

// Function to load product details from admin data
function loadProductDetails(productId) {
  const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [
    {
      id: "1",
      name: "Cappuccino",
      price: 34000,
      image: "/images/cappuccino.jpg",
      description: "Espresso yang kaya dengan susu dan busa lembut.",
      category: "Coffee",
      stock: 100,
      status: "active",
    },
    {
      id: "2",
      name: "Butter Croissant",
      price: 36000,
      image: "/images/croissant.jpg",
      description:
        "Kue kering beraroma mentega yang dipanggang hingga keemasan sempurna.",
      category: "Pastries",
      stock: 50,
      status: "active",
    },
    {
      id: "3",
      name: "Caramel Macchiato",
      price: 40000,
      image: "/images/caramel-macchiato.jpg",
      description: "Latte manis dengan lapisan karamel dan sentuhan espresso.",
      category: "Coffee",
      stock: 80,
      status: "active",
    },
    // Add other products as needed
  ];

  const product = adminProducts.find((p) => p.id.toString() === productId);

  if (product) {
    document.querySelector("h1").textContent = product.name;
    document.querySelector(".current-price").textContent = `Rp ${formatNumber(
      product.price
    )}`;
    document.querySelector("#main-product-image").src = product.image;
    document.querySelector("#main-product-image").alt = product.name;
    document.querySelector(".breadcrumb .current").textContent = product.name;
    document.querySelectorAll(".product-description p")[0].textContent =
      product.description;
    document.querySelector("#description p").textContent = product.description;
    const availabilityElement = document.querySelector(".availability");
    if (product.stock > 0) {
      availabilityElement.innerHTML =
        '<i class="fas fa-check-circle"></i> In Stock';
      availabilityElement.classList.remove("out-of-stock");
      availabilityElement.classList.add("in-stock");
      document.querySelector(".add-to-cart-btn").disabled = false;
      document.querySelector(".buy-now-btn").disabled = false;
    } else {
      availabilityElement.innerHTML =
        '<i class="fas fa-times-circle"></i> Out of Stock';
      availabilityElement.classList.remove("in-stock");
      availabilityElement.classList.add("out-of-stock");
      document.querySelector(".add-to-cart-btn").disabled = true;
      document.querySelector(".buy-now-btn").disabled = true;
    }
    document.querySelector(".meta-item:nth-child(2) .meta-value").textContent =
      product.category;
    document.title = `Nara Café | ${product.name}`;
  }
}

// Helper function to parse price
function parsePrice(priceString) {
  return Number.parseFloat(
    priceString.replace(/[^\d,]/g, "").replace(",", ".")
  );
}

// Helper function to format number
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
