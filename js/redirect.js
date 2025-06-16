// This script redirects from index.html to login.html if the user is not logged in
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If this is the index page and no user is logged in, redirect to login
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === ""
  ) {
    if (!currentUser) {
      window.location.href = "login.html";
    }
  }
});
