import { loginAdmin } from "../api.js";
import { setAdminState } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const adminModal = document.getElementById("admin-login-modal");
  const openLoginBtn = document.getElementById("open-login-modal");
  const closeLoginBtn = document.getElementById("close-login-modal");
  const loginForm = document.getElementById("admin-login-form-modal");

  const adminStatusText = document.getElementById("admin-status-text");
  const logoutBtn = document.getElementById("logout-btn");

  let isAdmin = false;

  openLoginBtn?.addEventListener("click", () => {
    adminModal.style.display = "flex";
  });

  closeLoginBtn?.addEventListener("click", () => {
    adminModal.style.display = "none";
    loginForm.reset();
  });

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        isAdmin = true;
        setAdminState(true);
        updateAdminStatus(true);
        adminModal.style.display = "none";

        const errorEl = document.getElementById("admin-delete-error");
        errorEl.style.display = "none";
      } else {
        showLoginError();
      }
    } catch {
      showLoginError();
    }
  });

  logoutBtn?.addEventListener("click", () => {
    isAdmin = false;
    setAdminState(false);
    updateAdminStatus(false);
  });

  function updateAdminStatus(status) {
    if (status) {
      adminStatusText.textContent = "Logged in as Admin";
      logoutBtn.style.display = "inline-block";
      openLoginBtn.style.display = "none";
    } else {
      adminStatusText.textContent = "Not Logged In";
      logoutBtn.style.display = "none";
      openLoginBtn.style.display = "inline-block";
    }
  }

  function showLoginError() {
    const statusEl = document.getElementById("login-status");
    if (statusEl) {
      statusEl.style.display = "block";
      statusEl.textContent = "Invalid credentials.";
    }
  }
});
