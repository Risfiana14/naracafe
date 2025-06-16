document.addEventListener("DOMContentLoaded", () => {
  const subtotalEl = document.querySelector(
    ".summary-row:nth-of-type(1) span:last-child"
  );
  const taxEl = document.querySelector(
    ".summary-row:nth-of-type(2) span:last-child"
  );
  const totalEl = document.querySelector(".summary-row.total span:last-child");
  const cashInput = document.getElementById("cash-input");
  const changeEl = document.getElementById("change-amount");
  const productList = document.getElementById("product-list");
  const checkoutBtn = document.getElementById("checkout-button");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkedStates = JSON.parse(localStorage.getItem("checkedStates")) || [];

  function formatRupiah(number) {
    return number.toLocaleString("id-ID");
  }

  function calculateSummary() {
    const selectedItems = cart.filter(
      (_, index) => checkedStates[index] ?? true
    );

    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    subtotalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
    taxEl.textContent = `Rp ${formatRupiah(tax)}`;
    totalEl.textContent = `Rp ${formatRupiah(total)}`;

    const cash = parseInt(cashInput?.value || 0);
    const change = cash - total;
    changeEl.textContent = change >= 0 ? `Rp ${formatRupiah(change)}` : "Rp 0";
  }

  function renderSelectedProducts() {
    productList.innerHTML = "";

    const selectedItems = cart.filter(
      (_, index) => checkedStates[index] ?? true
    );

    selectedItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const itemDiv = document.createElement("div");
      itemDiv.className = "selected-product-item";
      itemDiv.innerHTML = `
        <div class="product-image">
          <img src="${item.image}" alt="${item.name}" width="60">
        </div>
        <div class="product-details">
          <p><strong>${item.name}</strong></p>
          <p>Jumlah: ${item.quantity}</p>
          <p>Harga: Rp ${formatRupiah(item.price)} x ${item.quantity
        } = <strong>Rp ${formatRupiah(itemTotal)}</strong></p>
        </div>
      `;
      productList.appendChild(itemDiv);
    });
  }

  function generateOrderId() {
    const rand = Math.floor(Math.random() * 100000);
    return `ARO-${rand.toString().padStart(5, "0")}`;
  }

  function handleCheckout() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu.");
      window.location.href = "login.html";
      return;
    }

    const selectedItems = cart.filter(
      (_, index) => checkedStates[index] ?? true
    );

    if (selectedItems.length === 0) {
      alert("Tidak ada item yang dipilih untuk checkout.");
      return;
    }

    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    const newOrder = {
      id: generateOrderId(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: "processing",
      items: selectedItems.map((item) => `${item.name} (${item.quantity})`),
      shipping: "Standard Delivery",
      payment: "Credit Card ending in 1234",
      total: {
        subtotal: `Rp ${formatRupiah(subtotal)}`,
        shipping: "Rp 0",
        tax: `Rp ${formatRupiah(tax)}`,
        final: `Rp ${formatRupiah(total)}`,
      },
    };

    let allHistories =
      JSON.parse(localStorage.getItem("transactionHistories")) || [];

    let userHistory = allHistories.find(
      (entry) => entry.userId === currentUser.id
    );

    if (!userHistory) {
      userHistory = { userId: currentUser.id, orders: [] };
      allHistories.push(userHistory);
    }

    userHistory.orders.push(newOrder);
    localStorage.setItem("transactionHistories", JSON.stringify(allHistories));

    // Bersihkan hanya item yang dicentang dari cart
    const newCart = cart.filter((_, index) => !checkedStates[index]);
    const newChecked = checkedStates.filter(
      (_, index) => !checkedStates[index]
    );

    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.setItem("checkedStates", JSON.stringify(newChecked));

    alert("Pesanan Anda berhasil dibuat!");
    window.location.href = "transaction-history.html";
  }

  checkoutBtn?.addEventListener("click", handleCheckout);
  cashInput?.addEventListener("input", calculateSummary);

  calculateSummary();
  renderSelectedProducts();
});
