// login.js
import { apiGet, apiPost } from "./api.js";
import {showToast} from "./toast.js"

// 1) Auto-redirect if already logged in
(async function() {
  try {
    const user = await apiGet("/api/auth/me");
    if (user.role === "manager") {
      return window.location.href = "manager.html";
    }
    if (user.role === "user") {
      return window.location.href = "user.html";
    }
  } catch {
    // not logged in → stay on this page
  }
})();

// 2) Login form handling with validation feedback
const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  form.classList.add("submitted"); // trigger validation styles

  if (!form.checkValidity()) {
    return; // let browser highlight invalid fields
  }

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await apiPost("/api/login", { email, password });
    const user = await apiGet("/api/auth/me");
    window.location.href = user.role === "manager" ? "manager.html" : "user.html";
  } catch (err) {
      showToast(`Login failed: ${err.message ?? "Unknown error"}`, "error");
  }
});
