import { deleteUser, resetData } from "../api.js";
import { applySearchAndRender } from "./pagination.js";
import { loadUsers } from "./data.js";
import { state } from "./state.js";

export function setupModals() {
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const cancelDeleteBtn = document.getElementById("cancel-delete");

  const confirmReset = document.getElementById("confirm-reset");
  const cancelReset = document.getElementById("cancel-reset");
  const resetBtn = document.getElementById("reset-btn");

  confirmDeleteBtn.addEventListener("click", async () => {
    const rowToDelete = state.rowToDelete;
    if (!rowToDelete) return;

    try {
      await deleteUser(rowToDelete.dataset.id, state.isAdmin);
      state.allUsers = state.allUsers.filter((u) => u.id !== +rowToDelete.dataset.id);
      applySearchAndRender();
    } catch (err) {
      const errorEl = document.getElementById("admin-delete-error");
      errorEl.textContent = err.error || "Server error";
      errorEl.style.display = "block";
    } finally {
      document.getElementById("confirm-delete-modal").style.display = "none";
      state.rowToDelete = null;
    }
  });

  cancelDeleteBtn.addEventListener("click", () => {
    document.getElementById("confirm-delete-modal").style.display = "none";
  });

  confirmReset.addEventListener("click", async () => {
    try {
      await resetData();
      await loadUsers();
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      document.getElementById("confirm-reset-modal").style.display = "none";
    }
  });

  cancelReset.addEventListener("click", () => {
    document.getElementById("confirm-reset-modal").style.display = "none";
  });

  resetBtn.addEventListener("click", () => {
    document.getElementById("confirm-reset-modal").style.display = "flex";
  });
}