document.addEventListener("DOMContentLoaded", () => {
  // Filter functionality
  const orderFilter = document.getElementById("order-filter");
  const orderCards = document.querySelectorAll(".order-card");

  if (orderFilter) {
    orderFilter.addEventListener("change", function () {
      const filterValue = this.value;

      orderCards.forEach((card) => {
        const statusElement = card.querySelector(".order-status");
        if (!statusElement) return;

        const statusClass = statusElement.className;

        if (filterValue === "all") {
          card.style.display = "block";
        } else if (statusClass.includes(filterValue)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Filter transactions by status
  const statusFilters = document.querySelectorAll(".status-filter");
  const transactionCards = document.querySelectorAll(".transaction-card");

  if (statusFilters.length > 0) {
    statusFilters.forEach((filter) => {
      filter.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all filters
        statusFilters.forEach((f) => f.classList.remove("active"));

        // Add active class to clicked filter
        this.classList.add("active");

        const status = this.getAttribute("data-status");

        // Show all transactions if "all" is selected, otherwise filter by status
        transactionCards.forEach((card) => {
          if (status === "all") {
            card.style.display = "flex";
          } else {
            const cardStatus = card
              .querySelector(".transaction-status")
              .getAttribute("data-status");
            if (cardStatus === status) {
              card.style.display = "flex";
            } else {
              card.style.display = "none";
            }
          }
        });
      });
    });
  }

  // Search functionality
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();

      transactionCards.forEach((card) => {
        const orderId = card
          .querySelector(".transaction-id")
          .textContent.toLowerCase();
        const date = card
          .querySelector(".transaction-date")
          .textContent.toLowerCase();
        const amount = card
          .querySelector(".transaction-amount")
          .textContent.toLowerCase();

        if (
          orderId.includes(searchTerm) ||
          date.includes(searchTerm) ||
          amount.includes(searchTerm)
        ) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Sort functionality
  const sortSelect = document.querySelector(".sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortValue = this.value;
      const transactionsContainer =
        document.querySelector(".transactions-list");
      const transactions = Array.from(transactionCards);

      // Sort transactions based on selected option
      transactions.sort((a, b) => {
        if (sortValue === "date-desc") {
          // Sort by date (newest first)
          const dateA = new Date(
            a.querySelector(".transaction-date").textContent
          );
          const dateB = new Date(
            b.querySelector(".transaction-date").textContent
          );
          return dateB - dateA;
        } else if (sortValue === "date-asc") {
          // Sort by date (oldest first)
          const dateA = new Date(
            a.querySelector(".transaction-date").textContent
          );
          const dateB = new Date(
            b.querySelector(".transaction-date").textContent
          );
          return dateA - dateB;
        } else if (sortValue === "amount-desc") {
          // Sort by amount (highest first)
          const amountA = Number.parseFloat(
            a
              .querySelector(".transaction-amount")
              .textContent.replace(/[^\d.-]/g, "")
          );
          const amountB = Number.parseFloat(
            b
              .querySelector(".transaction-amount")
              .textContent.replace(/[^\d.-]/g, "")
          );
          return amountB - amountA;
        } else if (sortValue === "amount-asc") {
          // Sort by amount (lowest first)
          const amountA = Number.parseFloat(
            a
              .querySelector(".transaction-amount")
              .textContent.replace(/[^\d.-]/g, "")
          );
          const amountB = Number.parseFloat(
            b
              .querySelector(".transaction-amount")
              .textContent.replace(/[^\d.-]/g, "")
          );
          return amountA - amountB;
        }
        return 0;
      });

      // Remove all transactions from container
      transactionsContainer.innerHTML = "";

      // Add sorted transactions back to container
      transactions.forEach((transaction) => {
        transactionsContainer.appendChild(transaction);
      });
    });
  }

  // View transaction details
  const viewButtons = document.querySelectorAll(".view-transaction");
  if (viewButtons.length > 0) {
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const transactionId =
          this.closest(".transaction-card").querySelector(
            ".transaction-id"
          ).textContent;
        alert(`Viewing details for transaction ${transactionId}`);
        // In a real application, this would open a modal or navigate to a transaction detail page
      });
    });
  }

  // Track order buttons
  const trackButtons = document.querySelectorAll(".track-order");
  if (trackButtons.length > 0) {
    trackButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const transactionId =
          this.closest(".transaction-card").querySelector(
            ".transaction-id"
          ).textContent;
        alert(`Tracking order ${transactionId}`);
        // In a real application, this would open a tracking modal or navigate to a tracking page
      });
    });
  }

  // Cancel order buttons
  const cancelButtons = document.querySelectorAll(".cancel-order");
  if (cancelButtons.length > 0) {
    cancelButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const transactionCard = this.closest(".transaction-card");
        const transactionId =
          transactionCard.querySelector(".transaction-id").textContent;
        const status = transactionCard
          .querySelector(".transaction-status")
          .getAttribute("data-status");

        if (status === "completed" || status === "cancelled") {
          alert(
            `Cannot cancel ${transactionId} because it is already ${status}`
          );
        } else {
          if (
            confirm(`Are you sure you want to cancel order ${transactionId}?`)
          ) {
            alert(`Order ${transactionId} has been cancelled`);
            // In a real application, this would send a request to cancel the order
            // and then update the UI
            transactionCard.querySelector(".transaction-status").textContent =
              "Cancelled";
            transactionCard
              .querySelector(".transaction-status")
              .setAttribute("data-status", "cancelled");
            transactionCard.querySelector(".transaction-status").className =
              "transaction-status status-cancelled";
          }
        }
      });
    });
  }

  // Pagination functionality
  const paginationLinks = document.querySelectorAll(".pagination a");

  if (paginationLinks.length > 0) {
    paginationLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all links
        paginationLinks.forEach((l) => l.classList.remove("active"));

        // Add active class to clicked link if it's not a navigation button
        if (
          !this.classList.contains("prev") &&
          !this.classList.contains("next")
        ) {
          this.classList.add("active");
        }

        // In a real application, this would load the next page of transactions
        // For this demo, we'll just scroll to the top of the transactions section
        document
          .querySelector(".transactions-container")
          .scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // View Details button functionality
  const viewDetailsButtons = document.querySelectorAll(".btn-outline");

  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const orderId =
        this.closest(".order-card").querySelector(".order-id").textContent;
      alert(`Viewing details for ${orderId}`);
      // In a real application, this would navigate to an order detail page
      // window.location.href = `order-detail.html?id=${orderId.replace("Order #", "")}`;
    });
  });

  // Reorder button functionality
  const reorderButtons = document.querySelectorAll(".order-actions .btn");

  reorderButtons.forEach((button) => {
    if (button.textContent === "Reorder") {
      button.addEventListener("click", function () {
        const orderId =
          this.closest(".order-card").querySelector(".order-id").textContent;
        alert(`Items from ${orderId} have been added to your cart!`);
        // In a real application, this would add the items to the cart
        // and redirect to the cart page
        // window.location.href = "cart.html";
      });
    } else if (button.textContent === "Track Order") {
      button.addEventListener("click", function () {
        const orderId =
          this.closest(".order-card").querySelector(".order-id").textContent;
        alert(`Tracking ${orderId}. Your order is on its way!`);
        // In a real application, this would navigate to an order tracking page
      });
    }
  });
});
