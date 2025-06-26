import { fetchUsers } from "../api.js";
import { applySearchAndRender } from "./pagination.js";
import { state } from "./state.js";

export function loadUsers() {
  fetchUsers()
    .then((users) => {
      state.allUsers = users;
      state.currentPage = 1;
      applySearchAndRender();
    })
    .catch((err) => {
      const formErrors = document.getElementById("form-errors");
      formErrors.textContent = err.error || "Failed to load users";
      formErrors.style.display = "block";
    });
}

export function setAdminState(value) {
  state.isAdmin = value;
}