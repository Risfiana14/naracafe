document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    // Redirect based on role
    if (currentUser.role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "index.html";
    }
  }

  // Initialize users array from localStorage or create default admin if none exists
  initializeUsers();

  // Tab switching
  const tabButtons = document.querySelectorAll(".auth-tab");
  const authForms = document.querySelectorAll(".auth-form");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Remove active class from all tabs and forms
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      authForms.forEach((form) => form.classList.remove("active"));

      // Add active class to selected tab and form
      this.classList.add("active");
      document.getElementById(`${tabName}-form`).classList.add("active");
    });
  });

  // Password visibility toggle
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling;
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // Login form submission
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      const rememberCheckbox = document.getElementById("remember");

      if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberCheckbox && rememberCheckbox.checked;

        // Simple validation
        if (!email || !password) {
          showNotification("Please fill in all fields", "error");
          return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find user
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // Store user info in localStorage
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar:
                user.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
              username: user.username || email.split("@")[0],
              joinDate: user.joinDate,
              remember: remember,
            })
          );

          // Redirect based on role
          if (user.role === "admin") {
            window.location.href = "dashboard.html";
          } else {
            window.location.href = "index.html";
          }
        } else {
          showNotification("Invalid email or password", "error");
        }
      }
    });
  }

  // Registration form submission
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("register-name");
      const emailInput = document.getElementById("register-email");
      const passwordInput = document.getElementById("register-password");
      const confirmPasswordInput = document.getElementById(
        "register-confirm-password"
      );
      const termsCheckbox = document.getElementById("terms");

      if (nameInput && emailInput && passwordInput && confirmPasswordInput) {
        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAccepted = termsCheckbox && termsCheckbox.checked;

        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
          showNotification("Please fill in all fields", "error");
          return;
        }

        if (password !== confirmPassword) {
          showNotification("Passwords do not match", "error");
          return;
        }

        if (!termsAccepted) {
          showNotification("Please accept the terms and conditions", "error");
          return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if email already exists
        if (users.some((user) => user.email === email)) {
          showNotification("Email already registered", "error");
          return;
        }

        // Create new user - always as a regular user (not admin)
        const newUser = {
          id: generateUserId(),
          name,
          email,
          password,
          role: "user", // Always set role to "user" for new registrations
          username: email.split("@")[0],
          avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1
            }.jpg`,
          joinDate: new Date().toISOString().split("T")[0],
          status: "active",
        };

        // Add user to array
        users.push(newUser);

        // Save to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        // Show success message and redirect to login tab
        showNotification(
          "Registration successful! Please log in with your new account.",
          "success"
        );

        // Switch to login tab
        document.querySelector('.auth-tab[data-tab="login"]').click();

        // Pre-fill the login email field
        const loginEmailInput = document.getElementById("login-email");
        if (loginEmailInput) {
          loginEmailInput.value = email;
        }
      }
    });
  }

  // Forgot password link
  const forgotPasswordLink = document.querySelector(".forgot-password");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification(
        "Password reset functionality is not implemented in this demo",
        "info"
      );
    });
  }
});

// Initialize users array with default admin if none exists
function initializeUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // If no users exist, create a default admin
  if (users.length === 0) {
    const defaultAdmin = {
      id: generateUserId(),
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      username: "admin",
      role: "admin",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      joinDate: "2023-01-01",
      status: "active",
    };

    users.push(defaultAdmin);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Default admin user created");
  }
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
