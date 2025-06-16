document.addEventListener("DOMContentLoaded", () => {
    const order = JSON.parse(localStorage.getItem("orderData"));
    if (!order) {
        console.error("Order data not found");
        return;
    }

    const randomOrderNumber = "#NARA-" + Math.floor(10000 + Math.random() * 90000);

    // Ubah order number
    const orderNumberEl = document.querySelector(".order-number strong");
    if (orderNumberEl) orderNumberEl.textContent = randomOrderNumber;

    // Ubah email
    const emailEl = document.querySelector(".confirmation-message p strong");
    if (emailEl) emailEl.textContent = order.email;

    // Cari semua detail rows
    const detailRows = document.querySelectorAll(".details-section .detail-row");
    if (detailRows.length >= 3) {
        // Order Date
        detailRows[0].querySelector(".detail-value").textContent = order.date;

        // Order Status → fix: ubah jadi "Diterima"
        detailRows[1].querySelector(".detail-value").textContent = "Diterima";

        // Payment Method → fix: isi dengan "QRIS" atau "Tunai"
        detailRows[2].querySelector(".detail-value").textContent = order.method;
    }

    // Total
    const totalRows = document.querySelectorAll(".order-totals .total-row span:nth-child(2)");
    if (totalRows.length === 4) {
        totalRows[0].textContent = "Rp " + order.subtotal.toLocaleString("id-ID");
        totalRows[1].textContent = "Rp " + order.tax.toLocaleString("id-ID");
        totalRows[3].textContent = "Rp " + order.total.toLocaleString("id-ID");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const historyBtn = document.getElementById("go-to-history");
    if (historyBtn) {
        historyBtn.addEventListener("click", () => {
            window.location.href = "transaction-history.html";
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const order = JSON.parse(localStorage.getItem("orderData"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkedStates = JSON.parse(localStorage.getItem("checkedStates")) || [];

    if (!order || !currentUser) {
        console.error("Order data or user not found");
        return;
    }

    // Generate random order number
    const randomOrderNumber = "#NARA-" + Math.floor(10000 + Math.random() * 90000);
    const orderNumberEl = document.querySelector(".order-number strong");
    if (orderNumberEl) orderNumberEl.textContent = randomOrderNumber;

    const emailEl = document.querySelector(".confirmation-message p strong");
    if (emailEl) emailEl.textContent = order.email;

    const detailRows = document.querySelectorAll(".details-section .detail-row");
    if (detailRows.length >= 3) {
        detailRows[0].querySelector(".detail-value").textContent = order.date;
        detailRows[1].querySelector(".detail-value").textContent = "Diterima";
        detailRows[2].querySelector(".detail-value").textContent = order.method;
    }

    const totalRows = document.querySelectorAll(".order-totals .total-row span:nth-child(2)");
    if (totalRows.length === 4) {
        totalRows[0].textContent = "Rp " + order.subtotal.toLocaleString("id-ID");
        totalRows[1].textContent = "Rp " + order.tax.toLocaleString("id-ID");
        totalRows[3].textContent = "Rp " + order.total.toLocaleString("id-ID");
    }

    // ✅ Tambahkan ke riwayat transaksi (satu kali)
    const selectedItems = cart.filter((_, index) => checkedStates[index] ?? true);
    const newOrder = {
        id: randomOrderNumber.replace("#", ""),
        date: order.date,
        status: "processing",
        items: selectedItems.map(item => `${item.name} (${item.quantity})`),
        shipping: "Store Pickup",
        payment: order.method,
        total: {
            subtotal: "Rp " + order.subtotal.toLocaleString("id-ID"),
            shipping: "Rp 0",
            tax: "Rp " + order.tax.toLocaleString("id-ID"),
            final: "Rp " + order.total.toLocaleString("id-ID"),
        }
    };

    let histories = JSON.parse(localStorage.getItem("transactionHistories")) || [];
    let userHistory = histories.find(h => h.userId === currentUser.id);
    if (!userHistory) {
        userHistory = { userId: currentUser.id, orders: [] };
        histories.push(userHistory);
    }

    // Cegah duplikat: hanya tambahkan jika order.id belum ada
    const alreadyExists = userHistory.orders.some(o => o.id === newOrder.id);
    if (!alreadyExists) {
        userHistory.orders.push(newOrder);
        localStorage.setItem("transactionHistories", JSON.stringify(histories));
    }

    // Bersihkan item yang dibeli dari cart
    const newCart = cart.filter((_, index) => !checkedStates[index]);
    const newChecked = checkedStates.filter((_, index) => !checkedStates[index]);
    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.setItem("checkedStates", JSON.stringify(newChecked));
});