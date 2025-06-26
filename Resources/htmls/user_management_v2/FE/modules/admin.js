import { loginAdmin } from "../api.js";
import { state } from "./state.js";

export function setupAdminAuth() {
  document.addEventListener("DOMContentLoaded", () => {
    const adminLoginForm = document.getElementById("admin-login-form");
    const adminControls = document.getElementById("admin-controls");
    const logoutBtn = document.getElementById("logout-btn");
    const loginStatus = document.getElementById("login-status");

    if (!adminLoginForm || !logoutBtn) return;

    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("admin-email").value;
      const password = document.getElementById("admin-password").value;

      try {
        const res = await loginAdmin(email, password);
        if (res.success) {
          state.isAdmin = true;
          loginStatus.style.display = "none";
          adminControls.style.display = "block";
          adminLoginForm.reset();
        } else {
          loginStatus.style.display = "block";
        }
      } catch {
        loginStatus.style.display = "block";
      }
    });

    logoutBtn.addEventListener("click", () => {
      state.isAdmin = false;
      adminControls.style.display = "none";
      alert("Logged out as admin.");
    });
  });
}
