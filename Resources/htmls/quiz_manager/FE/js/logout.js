// logout.js
import { apiPost } from "./api.js";
import {showToast} from "./toast.js"

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await apiPost("/api/logout", {});
      window.location.href = "login.html";
    } catch (err) {
      showToast("Failed to log out.", "error");
    }
  });
}