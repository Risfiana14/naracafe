document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
      if (
        sidebar.classList.contains("active") &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".mobile-toggle")
      ) {
        sidebar.classList.remove("active");
      }
    });
  }

  // Chart filters
  const chartFilters = document.querySelectorAll(".chart-filter");
  if (chartFilters.length > 0) {
    chartFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        // Remove active class from all filters
        chartFilters.forEach((f) => f.classList.remove("active"));
        // Add active class to clicked filter
        filter.classList.add("active");

        // In a real application, this would update the chart data
        // For this demo, we'll just show a message
        console.log(`Chart filter changed to: ${filter.textContent}`);
      });
    });
  }

  // Export report button
  const exportButton = document.querySelector(".btn");

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      alert(
        "Exporting report... In a real application, this would generate and download a report."
      );
    });
  }

  // New product button
  const newProductButton = document.querySelector(".btn");

  if (
    newProductButton &&
    newProductButton.textContent.includes("New Product")
  ) {
    newProductButton.addEventListener("click", () => {
      window.location.href = "admin-products.html?action=new";
    });
  }

  // Action buttons in the orders table
  const actionButtons = document.querySelectorAll(".action-btn");

  if (actionButtons.length > 0) {
    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        const action = icon.classList.contains("fa-eye") ? "view" : "edit";
        const orderId = button.closest("tr").querySelector("td").textContent;

        if (action === "view") {
          alert(
            `Viewing order ${orderId}... In a real application, this would show order details.`
          );
        } else {
          alert(
            `Editing order ${orderId}... In a real application, this would open an edit form.`
          );
        }
      });
    });
  }

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Update user info in the sidebar
  if (currentUser) {
    const userNameElement = document.querySelector(".user-name");
    const userRoleElement = document.querySelector(".user-role");

    if (userNameElement) {
      userNameElement.textContent = currentUser.name;
    }

    if (userRoleElement) {
      userRoleElement.textContent =
        currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    }
  }
});
