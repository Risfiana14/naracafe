document.addEventListener("DOMContentLoaded", () => {
  console.log("Products page script loaded");

  // Load products from admin data
  loadProducts();
  setupCategoryFiltering();
  setupSearch();
  setupQuickView();
  setupPriceRangeSlider();
});

// Load products from localStorage
function loadProducts() {
  const productsGrid = document.querySelector(".products-grid");
  if (!productsGrid) {
    console.error("Products grid not found");
    return;
  }

  try {
    // Get products from localStorage (managed by admin)
    const adminProducts = localStorage.getItem("adminProducts");

    if (!adminProducts) {
      console.log("No products found in localStorage, initializing defaults");
      initializeDefaultProducts();
      return;
    }

    const products = JSON.parse(adminProducts);
    console.log("Loaded products from localStorage:", products.length);

    if (products && products.length > 0) {
      renderProducts(products);
    } else {
      console.log("Empty products array, initializing defaults");
      initializeDefaultProducts();
    }
  } catch (e) {
    console.error("Error loading products:", e);
    initializeDefaultProducts();
  }
}

// Initialize default products if none exist
function initializeDefaultProducts() {
  const defaultProducts = [
    {
      id: 1,
      name: "Matcha",
      description: "Minuman teh hijau yang disajikan dengan susu segar.",
      category: "Non Coffee",
      price: 44000,
      stock: 100,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Matcha",
    },
    {
      id: 2,
      name: "Butter Croissant",
      description:
        "Kue kering beraroma mentega yang dipanggang hingga keemasan sempurna.",
      category: "Pastries",
      price: 36000,
      stock: 50,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Butter+Croissant",
    },
    {
      id: 3,
      name: "Caramel Macchiato",
      description: "Latte manis dengan lapisan karamel dan sentuhan espresso.",
      category: "Coffee",
      price: 40000,
      stock: 80,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Caramel+Macchiato",
    },
    {
      id: 4,
      name: "Caramel Latte",
      description: "Espresso lembut dengan susu dan sirup karamel.",
      category: "Coffee",
      price: 37000,
      stock: 75,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Caramel+Latte",
    },
    {
      id: 5,
      name: "Jasmine Green Tea",
      description: "Teh hijau harum dengan bunga melati.",
      category: "Non Coffee",
      price: 29000,
      stock: 60,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Jasmine+Green+Tea",
    },
    {
      id: 6,
      name: "Crispy Chicken",
      description: "Tekstur renyah dan lapisan luar yang lezat.",
      category: "Heavy Food",
      price: 25000,
      stock: 30,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Crispy+Chicken",
    },
    {
      id: 7,
      name: "Chicken Katsu",
      description: "Ayam fillet digoreng renyah dengan saus katsu.",
      category: "Heavy Food",
      price: 41000,
      stock: 35,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Chicken+Katsu",
    },
    {
      id: 8,
      name: "Nasi Goreng",
      description: "Nasi goreng spesial dengan topping udang dan telor.",
      category: "Heavy Food",
      price: 20000,
      stock: 25,
      status: "active",
      image: "https://via.placeholder.com/300x200?text=Nasi+Goreng",
    },
  ];

  localStorage.setItem("adminProducts", JSON.stringify(defaultProducts));
  renderProducts(defaultProducts);
}


// Render products to the grid
function renderProducts(products) {
  const productsGrid = document.querySelector(".products-grid");

  // Clear existing products
  productsGrid.innerHTML = "";

  // Filter active products with stock > 0
  const availableProducts = products.filter(
    (product) => product.status === "active" && product.stock > 0
  );

  console.log("Available products:", availableProducts.length);

  if (availableProducts.length === 0) {
    productsGrid.innerHTML = `
        <div class="no-products" style="text-align: center; padding: 40px; font-size: 18px; color: #666; grid-column: 1 / -1;">
          No products available at the moment.
        </div>
      `;
    return;
  }

  // Store available products for filtering
  productsGrid.setAttribute("data-products", JSON.stringify(availableProducts));

  // Add products to grid
  availableProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.setAttribute(
      "data-category",
      product.category.toLowerCase().replace(/ /g, "-")
    );
    productCard.setAttribute("data-id", product.id);

    productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${
      product.name
    }" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          <div class="product-actions">
            <button class="action-btn quick-view" data-id="${
              product.id
            }"><i class="fas fa-eye"></i></button>
            <button class="action-btn add-to-cart" data-id="${
              product.id
            }"><i class="fas fa-shopping-cart"></i></button>
          </div>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-meta">
            <p class="price">Rp ${product.price.toLocaleString("id-ID")}</p>
            <div class="rating">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
              <span>(${Math.floor(Math.random() * 50) + 10})</span>
            </div>
          </div>
         
        </div>
      `;

    productsGrid.appendChild(productCard);
  });

  // Add event listeners to product cards
  setupProductEventListeners();
}

// Set up category filtering
function setupCategoryFiltering() {
  const categoryLinks = document.querySelectorAll(".filter-list a");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the selected category
      const selectedCategory = this.getAttribute("data-category");
      console.log("Category clicked:", selectedCategory);

      // Remove active class from all links
      categoryLinks.forEach((item) => item.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Get all product cards
      const productCards = document.querySelectorAll(".product-card");

      // Show/hide products based on category
      if (selectedCategory === "all") {
        // Show all products
        productCards.forEach((card) => {
          card.style.display = "block";
        });
      } else {
        // Filter products by category
        productCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");
          if (cardCategory === selectedCategory) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      }
    });
  });
}

// Set up search functionality
function setupSearch() {
  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      console.log("Searching for:", searchTerm);

      const productCards = document.querySelectorAll(".product-card");

      productCards.forEach((card) => {
        const productName = card.querySelector("h3").textContent.toLowerCase();
        const productDesc = card
          .querySelector(".product-desc")
          .textContent.toLowerCase();

        if (
          productName.includes(searchTerm) ||
          productDesc.includes(searchTerm)
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Set up quick view functionality
function setupQuickView() {
  let quickViewModal = document.getElementById("quick-view-modal");

  if (!quickViewModal) {
    // Create quick view modal if it doesn't exist
    quickViewModal = document.createElement("div");
    quickViewModal.id = "quick-view-modal";
    quickViewModal.className = "modal";
    quickViewModal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div class="product-quick-view">
            <div class="product-quick-image">
              <img src="/placeholder.svg" alt="">
            </div>
            <div class="product-quick-info">
              <h2></h2>
              <p class="price"></p>
              <p class="description"></p>
              <div class="quantity-group">
                <h4>Quantity</h4>
                <div class="quantity-buttons">
                  <button class="quantity-btn minus">-</button>
                  <input type="number" value="1" min="1" max="10">
                  <button class="quantity-btn plus">+</button>
                </div>
              </div>
              <button class="btn add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    document.body.appendChild(quickViewModal);

    // Add close functionality
    const closeModal = quickViewModal.querySelector(".close-modal");
    closeModal.addEventListener("click", () => {
      quickViewModal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === quickViewModal) {
        quickViewModal.style.display = "none";
      }
    });

    // Quantity controls
    const minusBtn = quickViewModal.querySelector(".quantity-btn.minus");
    const plusBtn = quickViewModal.querySelector(".quantity-btn.plus");
    const quantityInput = quickViewModal.querySelector(
      ".quantity-buttons input"
    );

    minusBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
      }
    });

    plusBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value);
      if (quantity < 10) {
        quantityInput.value = quantity + 1;
      }
    });

    quantityInput.addEventListener("change", () => {
      const quantity = Number.parseInt(quantityInput.value);
      if (isNaN(quantity) || quantity < 1) {
        quantityInput.value = 1;
      } else if (quantity > 10) {
        quantityInput.value = 10;
      }
    });
  }
}

// Set up price range slider
function setupPriceRangeSlider() {
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-value");

  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      const maxPrice = Number.parseInt(this.value);
      priceValue.textContent = "Rp " + maxPrice.toLocaleString("id-ID");

      // Filter products by price
      const productCards = document.querySelectorAll(".product-card");

      productCards.forEach((card) => {
        const priceText = card.querySelector(".price").textContent;
        const price = Number.parseInt(priceText.replace(/[^\d]/g, ""));

        if (price <= maxPrice) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Set up product event listeners
function setupProductEventListeners() {
  // Quick view buttons
  document.querySelectorAll(".quick-view").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();

      const productId = this.getAttribute("data-id");
      const adminProducts =
        JSON.parse(localStorage.getItem("adminProducts")) || [];
      const product = adminProducts.find((p) => p.id.toString() === productId);

      if (product) {
        const quickViewModal = document.getElementById("quick-view-modal");
        const modalImage = quickViewModal.querySelector(
          ".product-quick-image img"
        );
        const modalTitle = quickViewModal.querySelector("h2");
        const modalPrice = quickViewModal.querySelector(".price");
        const modalDesc = quickViewModal.querySelector(".description");
        const addToCartBtn = quickViewModal.querySelector(".add-to-cart-btn");

        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `Rp ${product.price.toLocaleString("id-ID")}`;
        modalDesc.textContent = product.description;

        // Reset quantity
        quickViewModal.querySelector(".quantity-buttons input").value = 1;

        // Set up add to cart button
        addToCartBtn.setAttribute("data-id", productId);
        addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));

        const newAddToCartBtn =
          quickViewModal.querySelector(".add-to-cart-btn");
        newAddToCartBtn.addEventListener("click", () => {
          const quantity = Number.parseInt(
            quickViewModal.querySelector(".quantity-buttons input").value
          );
          addToCart(
            productId,
            product.name,
            product.price,
            product.image,
            quantity
          );
          quickViewModal.style.display = "none";
        });

        // Show modal
        quickViewModal.style.display = "block";
      }
    });
  });

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const productId = this.getAttribute("data-id");
      const adminProducts =
        JSON.parse(localStorage.getItem("adminProducts")) || [];
      const product = adminProducts.find((p) => p.id.toString() === productId);

      if (product) {
        addToCart(productId, product.name, product.price, product.image, 1);
      }
    });
  });
}

// Add product to cart
function addToCart(
  productId,
  productName,
  productPrice,
  productImage,
  quantity = 1
) {
  console.log("Adding to cart:", productName, "Quantity:", quantity);

  // Create or retrieve cart from localStorage
  let cart = [];
  try {
    const existingCart = localStorage.getItem("cart");
    if (existingCart) {
      cart = JSON.parse(existingCart);
    }
  } catch (e) {
    console.error("Error parsing cart from localStorage:", e);
    cart = [];
  }

  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex((item) => item.id === productId);

  if (existingProductIndex > -1) {
    // Increment quantity if product already in cart
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: quantity,
    });
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Cart updated:", cart);

  // Show confirmation
  showNotification(`${quantity} ${productName} added to cart!`);

  // Redirect to cart page after a short delay
  setTimeout(() => {
    window.location.href = "cart.html";
  }, 1000);
}

// Show notification
function showNotification(message) {
  let notificationContainer = document.querySelector(".notification-container");
  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notificationContainer.contains(notification)) {
        notificationContainer.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add CSS for modals and notifications
const style = document.createElement("style");
style.textContent = `
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    
    .modal-content {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    
    .close-modal {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    
    .product-quick-view {
      display: flex;
      gap: 20px;
    }
    
    .product-quick-image {
      flex: 0 0 40%;
    }
    
    .product-quick-image img {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .product-quick-info {
      flex: 1;
    }
    
    .quantity-group {
      margin: 20px 0;
    }
    
    .quantity-group h4 {
      margin-bottom: 10px;
    }
    
    .quantity-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .quantity-btn {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: #f9f9f9;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .quantity-btn:hover {
      background: #e9e9e9;
    }
    
    .quantity-buttons input {
      width: 60px;
      text-align: center;
      border: 1px solid #ddd;
      padding: 5px;
      border-radius: 4px;
    }
    
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
    }
    
    .notification {
      background-color: #4a3520;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      margin-bottom: 10px;
      opacity: 0;
      transform: translateX(50px);
      transition: opacity 0.3s, transform 0.3s;
    }
    
    .notification.show {
      opacity: 1;
      transform: translateX(0);
    }
    
    .no-products {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: #666;
      grid-column: 1 / -1;
    }
    
    @media (max-width: 768px) {
      .product-quick-view {
        flex-direction: column;
      }
      
      .product-quick-image {
        flex: 0 0 auto;
      }
    }
  `;
document.head.appendChild(style);
