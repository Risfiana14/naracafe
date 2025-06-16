function formatRupiah(number) {
  return number.toLocaleString("id-ID");
}

function getTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkedStates = JSON.parse(localStorage.getItem("checkedStates")) || [];
  const selectedItems = cart.filter((_, i) => checkedStates[i] ?? true);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.floor(subtotal * 0.1);
  return subtotal + tax;
}

function saveOrderDetails(method) {
  const emailInput = document.getElementById("email");
  const nameInput = document.getElementById("nama");

  if (!emailInput || !nameInput) {
    alert("Input email atau nama tidak ditemukan");
    return;
  }

  const email = emailInput.value.trim();
  const name = nameInput.value.trim();
  const total = getTotal();
  const tax = Math.floor((total / 1.1) * 0.1);
  const subtotal = total - tax;

  if (!email || !name) {
    alert("Mohon isi nama dan email terlebih dahulu.");
    return;
  }

  const orderData = {
    id: "#NARA-" + Math.floor(10000 + Math.random() * 90000),
    name,
    email,
    method,
    subtotal,
    tax,
    total,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    status: "processing",
  };

  localStorage.setItem("orderData", JSON.stringify(orderData));

  const allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
  allTransactions.push(orderData);
  localStorage.setItem("transactions", JSON.stringify(allTransactions));
}

document.addEventListener("DOMContentLoaded", () => {
  const total = getTotal();
  document.getElementById("total-amount").textContent = "Total: Rp " + formatRupiah(total);

  const qrCodeDiv = document.getElementById("qr-code");
  const confirmQrisBtn = document.getElementById("confirm-qris-btn");
  const qrisInput = document.getElementById("qris");
  const tunaiInput = document.getElementById("tunai");
  const placeOrderBtn = document.getElementById("place-order-btn");

  qrisInput.addEventListener("change", () => {
    qrCodeDiv.style.display = "block";
    confirmQrisBtn.style.display = "inline-block";
  });

  tunaiInput.addEventListener("change", () => {
    qrCodeDiv.style.display = "none";
    confirmQrisBtn.style.display = "none";
  });

  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveOrderDetails("Tunai");
    window.location.href = "order-confirmation.html";
  });

  confirmQrisBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveOrderDetails("QRIS");
    window.location.href = "order-confirmation.html";
  });

  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.email) {
    document.getElementById("email").value = userData.email;
  }
});
