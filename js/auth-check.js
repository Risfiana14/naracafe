// This script checks if the user is logged in and has the correct role
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Get current page path
  const currentPath = window.location.pathname;

  // Check if this is an admin page
  const isAdminPage =
    currentPath.includes("dashboard.html") || currentPath.includes("admin-");

  if (isAdminPage) {
    // If no user is logged in or user is not an admin, redirect to login
    if (!currentUser || currentUser.role !== "admin") {
      showNotification(
        "You need to be logged in as an administrator to access this page.",
        "error"
      );
      window.location.href = "login.html";
    }
  }

  // Update navigation based on user role
  updateNavigation(currentUser);
});

function updateNavigation(user) {
  // Update header navigation if it exists
  const headerNav = document.querySelector("header nav ul");
  if (headerNav) {
    const loginLink = headerNav.querySelector('a[href="login.html"]');

    if (loginLink && user) {
      // Replace login link with account/logout links
      const li = loginLink.parentElement;
      if (user.role === "admin") {
        li.innerHTML = `
                      <a href="dashboard.html">Dashboard</a>
                  `;

        // Add logout link
        const logoutLi = document.createElement("li");
        logoutLi.innerHTML = '<a href="#" id="logout-link">Logout</a>';
        headerNav.appendChild(logoutLi);
      } else {
        li.innerHTML = `
                      <a href="transaction-history.html">My Orders</a>
                  `;

        // Add logout link
        const logoutLi = document.createElement("li");
        logoutLi.innerHTML = '<a href="#" id="logout-link">Logout</a>';
        headerNav.appendChild(logoutLi);
      }

      // Add logout event listener
      const logoutLink = document.getElementById("logout-link");
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          window.location.href = "login.html"; // Changed to redirect to login page
        });
      }
    }
  }

  // Update sidebar user info if it exists (for dashboard)
  const userInfo = document.querySelector(".user-info");
  if (userInfo && user) {
    const userName = userInfo.querySelector(".user-name");
    const userRole = userInfo.querySelector(".user-role");
    const userAvatar = document.querySelector(".user-avatar");

    if (userAvatar) {
      userAvatar.src = user.avatar;
      userAvatar.alt = user.name;
    }

    if (userName) {
      userName.textContent = user.name;
    }

    if (userRole) {
      userRole.textContent =
        user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
  }

  // Add logout functionality to sidebar if it exists
  const sidebarLogout = document.querySelector(
    '.sidebar-menu a[href="index.html"]'
  );
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "login.html"; // Changed to redirect to login page
      showNotification("You have been logged out successfully", "success");
    });
  }
}

// Show notification
function showNotification(message, type = "success") {
  // Remove any existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    document.body.removeChild(existingNotification);
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add to body
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
