// logout.js
import { apiPost } from "./api.js";

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await apiPost("/api/logout", {});
      window.location.href = "login.html";
    } catch (err) {
      alert("Failed to log out.");
    }
  });
}