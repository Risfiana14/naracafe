document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

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
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    return; // This should be handled by auth-check.js
  }

  // Initialize the page
  initializeUsersPage();

  // Set up event listeners
  setupEventListeners();
});

function initializeUsersPage() {
  // Get all users from localStorage
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Show all users in the admin panel
  const users = allUsers;

  // Render the users table
  renderUsersTable(users);

  // Update user count in table header
  updateUserCount(users.length);
}

function renderUsersTable(users) {
  const tableBody = document.querySelector(".admin-table tbody");
  if (!tableBody) return;

  // Clear existing rows
  tableBody.innerHTML = "";

  if (users.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
        <td colspan="6" class="empty-table">No users found</td>
      `;
    tableBody.appendChild(emptyRow);
    return;
  }

  // Add user rows
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", user.id);

    const joinDate = new Date(user.joinDate);
    const formattedDate = joinDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Removed profile image as requested, showing only name
    row.innerHTML = `
        <td>
          <div class="user-info-row">
            <div>
              <h4>${user.name}</h4>
              <p>@${user.username || user.email.split("@")[0]}</p>
            </div>
          </div>
        </td>
        <td>${user.email}</td>
        <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
        <td>${formattedDate}</td>
        <td><span class="status-${user.status || "active"}">${user.status
        ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
        : "Active"
      }</span></td>
        <td>
          <button class="action-btn delete-user" data-id="${user.id
      }"><i class="fas fa-trash"></i></button>
        </td>
      `;

    tableBody.appendChild(row);
  });

  // Important: Call setupActionButtons after adding rows to the table
  setTimeout(() => {
    setupActionButtons();
  }, 100);
}

function updateUserCount(count) {
  const tableHeader = document.querySelector(".table-header h2");
  if (tableHeader) {
    tableHeader.textContent = `All Users (${count})`;
  }

  const showingEntries = document.querySelector(".showing-entries");
  if (showingEntries) {
    showingEntries.textContent = `Showing 1 to ${count} of ${count} entries`;
  }
}

// Fix the setupEventListeners function to ensure action buttons work
function setupEventListeners() {
  // Search functionality
  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  // Role filter
  const roleFilter = document.querySelector(".filter-select");
  if (roleFilter) {
    roleFilter.addEventListener("change", handleRoleFilter);
  }

  // New user button
  const newUserBtn = document.querySelector(".header-actions .btn");
  if (newUserBtn) {
    newUserBtn.addEventListener("click", showNewUserModal);
  }

  // Setup logout button
  const logoutBtn = document.querySelector(
    '.sidebar-menu a[href="index.html"]'
  );
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "login.html"; // Direct to login page instead of home
    });
  }

  // Setup action buttons immediately
  setupActionButtons();
}

// Fix the setupActionButtons function to ensure it properly attaches event listeners
function setupActionButtons() {
  console.log("Setting up action buttons");

  // View user
  document.querySelectorAll(".view-user").forEach((btn) => {
    btn.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      console.log("View user clicked for ID:", userId);
      viewUser(userId);
    });
  });

  // Edit user
  document.querySelectorAll(".edit-user").forEach((btn) => {
    btn.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      console.log("Edit user clicked for ID:", userId);
      editUser(userId);
    });
  });

  // Delete user
  document.querySelectorAll(".delete-user").forEach((btn) => {
    btn.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      console.log("Delete user clicked for ID:", userId);
      deleteUser(userId);
    });
  });
}

function handleSearch() {
  const searchTerm = this.value.toLowerCase();
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Apply search filter
  let filteredUsers = allUsers;
  if (searchTerm) {
    filteredUsers = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.username && user.username.toLowerCase().includes(searchTerm))
    );
  }

  renderUsersTable(filteredUsers);
}

function handleRoleFilter() {
  const role = this.value.toLowerCase();
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Apply role filter - fixed to properly filter by role
  let filteredUsers = allUsers;
  if (role !== "all") {
    filteredUsers = allUsers.filter((user) => user.role.toLowerCase() === role);
  }

  renderUsersTable(filteredUsers);
}

function viewUser(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.id === userId);

  if (!user) {
    showNotification("User not found", "error");
    return;
  }

  // Create modal
  const modal = createModal("User Details");

  // Add user details to modal - removed profile image
  const modalContent = modal.querySelector(".modal-content");
  const userDetails = document.createElement("div");
  userDetails.className = "user-details";

  const joinDate = new Date(user.joinDate);
  const formattedDate = joinDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  userDetails.innerHTML = `
      <div class="user-profile">
        <div class="user-info-large">
          <h2>${user.name}</h2>
          <p class="user-username">@${user.username || user.email.split("@")[0]
    }</p>
          <p class="user-role">${user.role.charAt(0).toUpperCase() + user.role.slice(1)
    }</p>
        </div>
      </div>
      
      <div class="user-details-grid">
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${user.email}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Joined Date:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value status-${user.status || "active"}">${user.status
      ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
      : "Active"
    }</span>
        </div>
      </div>
    `;

  modalContent.appendChild(userDetails);

  // Add buttons
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalFooter.innerHTML = `
      <button class="btn btn-primary edit-btn" data-id="${user.id}">Edit User</button>
      <button class="btn btn-outline close-btn">Close</button>
    `;

  modalContent.appendChild(modalFooter);

  // Add event listeners
  modalFooter.querySelector(".edit-btn").addEventListener("click", () => {
    closeModal(modal);
    editUser(userId);
  });

  modalFooter.querySelector(".close-btn").addEventListener("click", () => {
    closeModal(modal);
  });

  // Show modal
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function editUser(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.id === userId);

  if (!user) {
    showNotification("User not found", "error");
    return;
  }

  // Create modal
  const modal = createModal("Edit User");

  // Add form to modal
  const modalContent = modal.querySelector(".modal-content");
  const form = document.createElement("form");
  form.id = "edit-user-form";

  form.innerHTML = `
      <div class="form-group">
        <label for="edit-name">Full Name</label>
        <input type="text" id="edit-name" value="${user.name}" required>
      </div>
      
      <div class="form-group">
        <label for="edit-email">Email</label>
        <input type="email" id="edit-email" value="${user.email}" required>
      </div>
      
      <div class="form-group">
        <label for="edit-username">Username</label>
        <input type="text" id="edit-username" value="${user.username || user.email.split("@")[0]
    }">
      </div>
      
      <div class="form-group">
        <label for="edit-role">Role</label>
        <select id="edit-role" required>
          <option value="admin" ${user.role === "admin" ? "selected" : ""
    }>Administrator</option>
          <option value="staff" ${user.role === "staff" ? "selected" : ""
    }>Staff</option>
          <option value="user" ${user.role === "user" ? "selected" : ""
    }>User</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="edit-status">Status</label>
        <select id="edit-status" required>
          <option value="active" ${user.status === "active" || !user.status ? "selected" : ""
    }>Active</option>
          <option value="inactive" ${user.status === "inactive" ? "selected" : ""
    }>Inactive</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="edit-password">New Password (leave blank to keep current)</label>
        <input type="password" id="edit-password" placeholder="Enter new password">
      </div>
      
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
      </div>
    `;

  modalContent.appendChild(form);

  // Add event listeners
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("edit-name").value;
    const email = document.getElementById("edit-email").value;
    const username = document.getElementById("edit-username").value;
    const role = document.getElementById("edit-role").value;
    const status = document.getElementById("edit-status").value;
    const password = document.getElementById("edit-password").value;

    // Validate
    if (!name || !email || !role || !status) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // Update user
    const updatedUser = {
      ...user,
      name,
      email,
      username,
      role,
      status,
    };

    // Update password if provided
    if (password) {
      updatedUser.password = password;
    }

    // Update in users array
    const userIndex = users.findIndex((u) => u.id === userId);
    users[userIndex] = updatedUser;

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Update current user if editing self
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...currentUser,
          name,
          email,
          username,
          role,
        })
      );

      // Update sidebar user info
      updateNavigation(currentUser);
    }

    // Close modal
    closeModal(modal);

    // Refresh table
    initializeUsersPage();

    // Show success message
    showNotification("User updated successfully", "success");
  });

  form.querySelector(".cancel-btn").addEventListener("click", () => {
    closeModal(modal);
  });

  // Show modal
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function deleteUser(userId) {
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Cannot delete yourself
  if (currentUser.id === userId) {
    showNotification(
      "You cannot delete your own account while logged in",
      "error"
    );
    return;
  }

  // Confirm deletion
  if (
    !confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    )
  ) {
    return;
  }

  // Get users
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Remove user
  const updatedUsers = users.filter((user) => user.id !== userId);

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  // Refresh table
  initializeUsersPage();

  // Show success message
  showNotification("User deleted successfully", "success");
}

function showNewUserModal() {
  // Create modal
  const modal = createModal("Add New User");

  // Add form to modal
  const modalContent = modal.querySelector(".modal-content");
  const form = document.createElement("form");
  form.id = "new-user-form";

  form.innerHTML = `
      <div class="form-group">
        <label for="new-name">Full Name</label>
        <input type="text" id="new-name" placeholder="Enter full name" required>
      </div>
      
      <div class="form-group">
        <label for="new-email">Email</label>
        <input type="email" id="new-email" placeholder="Enter email" required>
      </div>
      
      <div class="form-group">
        <label for="new-username">Username</label>
        <input type="text" id="new-username" placeholder="Enter username">
      </div>
      
      <div class="form-group">
        <label for="new-password">Password</label>
        <input type="password" id="new-password" placeholder="Enter password" required>
      </div>
      
      <div class="form-group">
        <label for="new-role">Role</label>
        <select id="new-role" required>
          <option value="admin">Administrator</option>
          <option value="staff">Staff</option>
          <option value="user" selected>User</option>
        </select>
      </div>
      
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Add User</button>
        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
      </div>
    `;

  modalContent.appendChild(form);

  // Add event listeners
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("new-name").value;
    const email = document.getElementById("new-email").value;
    const username =
      document.getElementById("new-username").value || email.split("@")[0];
    const password = document.getElementById("new-password").value;
    const role = document.getElementById("new-role").value;

    // Validate
    if (!name || !email || !password || !role) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // Get users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      showNotification("A user with this email already exists", "error");
      return;
    }

    // Create new user
    const newUser = {
      id: generateUserId(),
      name,
      email,
      username,
      password,
      role,
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    };

    // Add to users array
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Close modal
    closeModal(modal);

    // Refresh table
    initializeUsersPage();

    // Show success message
    showNotification("User added successfully", "success");
  });

  form.querySelector(".cancel-btn").addEventListener("click", () => {
    closeModal(modal);
  });

  // Show modal
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function createModal(title) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="close-modal">&times;</button>
        </div>
      </div>
    `;

  // Close button
  modal.querySelector(".close-modal").addEventListener("click", () => {
    closeModal(modal);
  });

  // Close when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  return modal;
}

function closeModal(modal) {
  modal.classList.remove("show");
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 300);
}

// Generate a unique user ID
function generateUserId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

// Update navigation based on user role
function updateNavigation(user) {
  // Update sidebar user info if it exists
  const userInfo = document.querySelector(".user-info");
  if (userInfo && user) {
    const userName = userInfo.querySelector(".user-name");
    const userRole = userInfo.querySelector(".user-role");

    if (userName) {
      userName.textContent = user.name;
    }

    if (userRole) {
      userRole.textContent =
        user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
  }
}
