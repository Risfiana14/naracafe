document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupCategoryFiltering();
    setupSearch();
    setupQuickView();
    setupPriceRangeSlider();
});

function loadProducts() {
    const productsGrid = document.querySelector(".products-grid");
    if (!productsGrid) {
        console.error("Products grid not found");
        return;
    }

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
            description: "Kue kering beraroma mentega yang dipanggang hingga keemasan sempurna.",
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

    localStorage.setItem("adminProducts", JSON.stringify(adminProducts));

    productsGrid.innerHTML = "";
    const availableProducts = adminProducts.filter(
        (product) => product.status === "active" && product.stock > 0
    );

    if (availableProducts.length === 0) {
        productsGrid.innerHTML = `<div class="no-products" style="text-align: center; padding: 40px; font-size: 18px; color: #666;">No products available at the moment.</div>`;
        return;
    }

    productsGrid.setAttribute("data-products", JSON.stringify(availableProducts));

    availableProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.setAttribute("data-category", product.category.toLowerCase().replace(/ /g, "-"));
        productCard.setAttribute("data-id", product.id);

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="action-btn add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <p class="price">Rp ${formatNumber(product.price)}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(${Math.floor(Math.random() * 50) + 10})</span>
                    </div>
                </div>
                <a href="product-detail.html?id=${product.id}" class="btn-small">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    setupProductEventListeners();
}

function setupCategoryFiltering() {
    const categoryLinks = document.querySelectorAll(".filter-list a");

    categoryLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedCategory = this.getAttribute("data-category");
            categoryLinks.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");
            const productCards = document.querySelectorAll(".product-card");

            if (selectedCategory === "all") {
                productCards.forEach((card) => (card.style.display = "block"));
            } else {
                productCards.forEach((card) => {
                    const cardCategory = card.getAttribute("data-category");
                    card.style.display = cardCategory === selectedCategory ? "block" : "none";
                });
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();
            const productCards = document.querySelectorAll(".product-card");

            productCards.forEach((card) => {
                const productName = card.querySelector("h3").textContent.toLowerCase();
                const productDesc = card.querySelector(".product-desc").textContent.toLowerCase();
                card.style.display =
                    productName.includes(searchTerm) || productDesc.includes(searchTerm) ? "block" : "none";
            });
        });
    }
}

function setupQuickView() {
    const quickViewModal = document.getElementById("quick-view-modal");
    if (!quickViewModal) return;

    const closeModal = quickViewModal.querySelector(".close-modal");
    closeModal.addEventListener("click", () => {
        quickViewModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === quickViewModal) {
            quickViewModal.style.display = "none";
        }
    });

    // Option buttons in quick view
    quickViewModal.querySelectorAll(".option-group").forEach((group) => {
        const buttons = group.querySelectorAll(".option-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
            });
        });
    });

    // Quantity buttons in quick view
    const minusBtn = quickViewModal.querySelector(".quantity-btn.minus");
    const plusBtn = quickViewModal.querySelector(".quantity-btn.plus");
    const quantityInput = quickViewModal.querySelector(".quantity-buttons input");

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
}

function setupProductEventListeners() {
    document.querySelectorAll(".quick-view").forEach((button) => {
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            const productId = this.getAttribute("data-id");
            const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
            const product = adminProducts.find((p) => p.id.toString() === productId);

            if (product) {
                const quickViewModal = document.getElementById("quick-view-modal");
                const modalImage = quickViewModal.querySelector(".product-quick-image img");
                const modalTitle = quickViewModal.querySelector("h2");
                const modalPrice = quickViewModal.querySelector(".price");
                const modalDesc = quickViewModal.querySelector(".description");

                modalImage.src = product.image;
                modalImage.alt = product.name;
                modalTitle.textContent = product.name;
                modalPrice.textContent = `Rp ${formatNumber(product.price)}`;
                modalDesc.textContent = product.description;

                // Show/hide options based on product category
                const optionGroups = quickViewModal.querySelectorAll(".option-group");
                optionGroups.forEach((group) => {
                    group.style.display = product.category === "Coffee" ? "block" : "none";
                });

                const addToCartBtn = quickViewModal.querySelector(".add-to-cart-btn");
                addToCartBtn.setAttribute("data-id", productId);
                addToCartBtn.addEventListener("click", () => {
                    const quantity = Number.parseInt(quickViewModal.querySelector(".quantity-buttons input").value);
                    const size = quickViewModal.querySelector(".option-group:nth-of-type(1) .option-btn.active")?.textContent || "Medium";
                    const milk = quickViewModal.querySelector(".option-group:nth-of-type(2) .option-btn.active")?.textContent || "Whole";
                    const sugar = quickViewModal.querySelector(".option-group:nth-of-type(3) .option-btn.active")?.textContent || "None";

                    let adjustedPrice = product.price;
                    if (size === "Small") adjustedPrice *= 0.8;
                    else if (size === "Large") adjustedPrice *= 1.2;
                    if (milk === "Almond" || milk === "Oat") adjustedPrice += 5000;

                    const cartItem = {
                        id: productId,
                        name: product.name,
                        price: adjustedPrice,
                        image: product.image,
                        quantity: quantity,
                        options: product.category === "Coffee" ? { size, milk, sugar } : {},
                    };

                    const cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const existingProductIndex = cart.findIndex(
                        (item) =>
                            item.id === productId &&
                            (!item.options || (item.options.size === size && item.options.milk === milk && item.options.sugar === sugar))
                    );

                    if (existingProductIndex !== -1) {
                        cart[existingProductIndex].quantity += quantity;
                    } else {
                        cart.push(cartItem);
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                    showNotification(`${quantity} ${product.name} added to cart!`);
                    quickViewModal.style.display = "none";
                    setTimeout(() => {
                        window.location.href = "cart.html";
                    }, 1000);
                });

                quickViewModal.style.display = "block";
            }
        });
    });

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute("data-id");
            const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
            const product = adminProducts.find((p) => p.id.toString() === productId);

            if (product) {
                const cartItem = {
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                    options: product.category === "Coffee" ? { size: "Medium", milk: "Whole", sugar: "None" } : {},
                };

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProductIndex = cart.findIndex(
                    (item) =>
                        item.id === productId &&
                        (!item.options || (item.options.size === "Medium" && item.options.milk === "Whole" && item.options.sugar === "None"))
                );

                if (existingProductIndex !== -1) {
                    cart[existingProductIndex].quantity += 1;
                } else {
                    cart.push(cartItem);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                showNotification(`${product.name} added to cart!`);
                setTimeout(() => {
                    window.location.href = "cart.html";
                }, 1000);
            }
        });
    });
}

function setupPriceRangeSlider() {
    const priceRange = document.getElementById("price-range");
    const priceValue = document.getElementById("price-value");

    if (priceRange && priceValue) {
        priceRange.addEventListener("input", function () {
            const maxPrice = Number.parseInt(this.value);
            priceValue.textContent = `Rp ${formatNumber(maxPrice)}`;
            const productCards = document.querySelectorAll(".product-card");

            productCards.forEach((card) => {
                const price = Number.parseFloat(card.querySelector(".price").textContent.replace(/[^\d]/g, ""));
                card.style.display = price <= maxPrice ? "block" : "none";
            });
        });
    }
}

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
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
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
    .option-group {
        margin-bottom: 15px;
    }
    .option-group h4 {
        margin-bottom: 5px;
    }
    .option-btn {
        padding: 8px 12px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }
    .option-btn.active {
        background-color: #4a3520;
        color: white;
        border-color: #4a3520;
    }
    .quantity-group {
        margin-bottom: 15px;
    }
    .quantity-buttons {
        display: flex;
        align-items: center;
    }
    .quantity-btn {
        padding: 8px;
        border: 1px solid #ccc;
        background: #f9f9f9;
        cursor: pointer;
    }
    .quantity-buttons input {
        width: 50px;
        text-align: center;
        margin: 0 10px;
        border: 1px solid #ccc;
        padding: 8px;
    }
    @media (max-width: 768px) {
        .product-quick-view {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);
