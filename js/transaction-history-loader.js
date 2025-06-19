document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("orderList");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const histories =
    JSON.parse(localStorage.getItem("transactionHistories")) || [];

  if (!currentUser || !orderList) return;

  const userHistory = histories.find((h) => h.userId === currentUser.id);
  if (!userHistory || userHistory.orders.length === 0) {
    orderList.innerHTML = `<p class="empty-message">You have no transactions yet.</p>`;
    return;
  }

  userHistory.orders.reverse().forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";

    const statusClass =
      {
        completed: "status-completed",
        processing: "status-processing",
        cancelled: "status-cancelled",
      }[order.status] || "status-processing";

    const itemsHTML = order.items.map((item) => `<p>${item}</p>`).join("");

    card.innerHTML = `
        <div class="order-header">
          <div class="order-id">Order #${order.id}</div>
          <div class="order-date">${order.date}</div>
          <div class="order-status ${statusClass}">${capitalize(
      order.status
    )}</div>
        </div>
        <div class="order-content">
          <div class="order-summary">
            <div class="summary-col">
              <h3>Items</h3>
              ${itemsHTML}
            </div>
            <div class="summary-col">
              <h3>Shipping</h3>
              <p>${order.shipping}</p>
            </div>
            <div class="summary-col">
              <h3>Payment</h3>
              <p>${order.payment}</p>
            </div>
          </div>
          <div class="order-total">
            <div class="total-col">
              <div class="total-row"><span>Subtotal:</span><span>${
                order.total.subtotal
              }</span></div>
              <div class="total-row"><span>Shipping:</span><span>${
                order.total.shipping
              }</span></div>
              <div class="total-row"><span>Tax:</span><span>${
                order.total.tax
              }</span></div>
              <div class="total-row final"><span>Total:</span><span>${
                order.total.final
              }</span></div>
            </div>
          </div>
          <div class="order-actions">
            <button class="btn view-details">View Details</button>
            <button class="btn reorder">Reorder</button>
          </div>
        </div>
      `;

    card.querySelector(".view-details").addEventListener("click", () => {
      alert(`Viewing details for ${order.id}`);
    });

    card.querySelector(".reorder").addEventListener("click", () => {
      alert(`Reordering items from ${order.id}`);
      // Implementasi sesungguhnya: tambah item ke cart
    });

    orderList.appendChild(card);
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
