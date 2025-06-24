document.addEventListener("DOMContentLoaded", () => {
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

      // Optional: Tutup menu saat klik link di mobile
      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            body.classList.remove("menu-open");
          }
        });
      });
    }
  });
  
  const cartItemsContainer = document.querySelector(".cart-items");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let checkedStates = JSON.parse(localStorage.getItem("checkedStates")) || [];

  function formatRupiah(number) {
    return number.toLocaleString("id-ID");
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <input type="checkbox" class="item-check" data-index="${index}">
        <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
            <h3>${item.name}</h3>
            <div class="item-price-mobile">
                <span class="price">Rp ${formatRupiah(itemTotal)}</span>
            </div>
        </div>
        <div class="item-quantity">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <input type="number" value="${item.quantity
        }" min="1" max="10" data-index="${index}">
            <button class="quantity-btn plus" data-index="${index}">+</button>
        </div>
        <div class="item-price">
            <span class="price">Rp ${formatRupiah(itemTotal)}</span>
        </div>
        <div class="item-actions">
            <button class="action-btn remove-item" data-index="${index}">
              <i class="fas fa-trash-alt"></i>
            </button>
        </div>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    applyCheckedStates();
    attachEventListeners();
  }

  function applyCheckedStates() {
    const checkboxes = document.querySelectorAll(".item-check");
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = checkedStates[index] ?? true;
    });
  }

  function saveCheckedStates() {
    const checkboxes = document.querySelectorAll(".item-check");
    checkedStates = Array.from(checkboxes).map((cb) => cb.checked);
    localStorage.setItem("checkedStates", JSON.stringify(checkedStates));
  }

  function attachEventListeners() {
    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        if (cart[index].quantity < 10) {
          cart[index].quantity += 1;
          saveAndRender();
        }
      });
    });

    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          saveAndRender();
        }
      });
    });

    document
      .querySelectorAll(".cart-item input[type='number']")
      .forEach((input) => {
        input.addEventListener("change", () => {
          const index = input.getAttribute("data-index");
          let val = parseInt(input.value);
          if (isNaN(val) || val < 1) val = 1;
          if (val > 10) val = 10;
          cart[index].quantity = val;
          saveAndRender();
        });
      });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        cart.splice(index, 1);
        checkedStates.splice(index, 1);
        saveAndRender();
      });
    });

    document.querySelectorAll(".item-check").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        saveCheckedStates();
      });
    });

    document.querySelector(".clear-cart-btn")?.addEventListener("click", () => {
      localStorage.removeItem("cart");
      localStorage.removeItem("checkedStates");
      location.reload();
    });
  }

  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    saveCheckedStates();
    renderCart();
  }

  renderCart();
});
