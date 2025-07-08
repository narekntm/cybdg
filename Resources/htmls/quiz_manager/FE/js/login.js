// login.js
import { apiGet, apiPost } from "./api.js";

// 1) Auto-redirect if already logged in
(async function() {
  try {
    const user = await apiGet("/api/auth/me");    // parsed JSON
    if (user.role === "admin") {
      return window.location.href = "admin.html";
    }
    if (user.role === "user") {
      return window.location.href = "user.html";
    }
  } catch {
    // not logged in → stay on this page
  }
})();

// 2) Login form handling
const form = document.getElementById("login-form");
const errorDiv = document.getElementById("error-message");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorDiv.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await apiPost("/api/login", { email, password });        // throws if bad creds
    const user = await apiGet("/api/auth/me");              // now fetch the user
    window.location.href = user.role === "admin"
      ? "admin.html"
      : "user.html";
  } catch (err) {
    errorDiv.textContent = err.message || "Login failed.";
  }
});
