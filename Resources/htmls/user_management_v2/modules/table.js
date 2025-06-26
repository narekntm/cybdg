import { deleteUser, toggleStatus as toggleStatusApi } from "../api.js";
import { applySearchAndRender } from './pagination.js'
import { state } from "./state.js";

export function setupTableActions() {
  const tableBody = document.querySelector("#user-table tbody");

  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (e.target.classList.contains("edit-btn")) {
      populateFormForEdit(row);
    } else if (e.target.classList.contains("delete-btn")) {
      handleDelete(row);
    } else if (e.target.classList.contains("status-btn")) {
      toggleStatus(row, e.target);
    }
  });
}

function toggleStatus(row, btn) {
  const current = row.children[6].textContent;
  const newStatus = current === "Active" ? "Inactive" : "Active";
  toggleStatusApi(row.dataset.id, newStatus)
    .then((res) => {
      row.children[6].textContent = res.status;
      btn.textContent = res.status === "Active" ? "Deactivate" : "Activate";
    })
    .catch((err) => {
      const errorEl = document.getElementById("admin-delete-error");
      errorEl.textContent = err.error || "Server error";
      errorEl.style.display = "block";
    });
}

function handleDelete(row) {
  const isAdmin = state.isAdmin;
  if (!isAdmin && row.children[1].textContent === "Admin") {
    const errorEl = document.getElementById("admin-delete-error");
    errorEl.textContent = "Admin login required to delete Admin-level users.";
    errorEl.style.display = "block";
    return;
  }
  state.rowToDelete = row;
  document.getElementById("confirm-delete-modal").style.display = "flex";
}

function populateFormForEdit(row) {
  state.editRow = row;
  document.getElementById("form-title").textContent = "Edit User";

  document.getElementById("name").value = row.children[0].textContent;
  document.getElementById("role").value = row.children[1].textContent;
  document.getElementById("age").value = row.children[2].textContent;
  document.getElementById("email").value = row.children[3].textContent;

  document.querySelectorAll('input[name="gender"]').forEach((r) => {
    r.checked = r.value === row.children[4].textContent;
  });

  const subs = row.children[5].textContent.split(", ").map((s) => s.trim());
  document.querySelectorAll('input[name="subscribe"]').forEach((cb) => {
    cb.checked = subs.includes(cb.value);
  });

  // 👇 Open modal
  document.getElementById("user-form-modal").style.display = "flex";
}
