import {
  loginAdmin,
  fetchUsers,
  submitUser,
  updateUser,
  deleteUser,
  toggleStatus as toggleStatusApi,
  resetData,
} from "./api.js";

// ─────────────────────────────────────────────────────────
// ✅ State & References

let isAdmin = false;
let editRow = null;
let rowToDelete = null;

const adminLoginForm = document.getElementById("admin-login-form");
const adminControls = document.getElementById("admin-controls");
const logoutBtn = document.getElementById("logout-btn");
const loginStatus = document.getElementById("login-status");

const tableBody = document.querySelector("#user-table tbody");
const userForm = document.getElementById("user-form");
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const formErrors = document.getElementById("form-errors");

const adminDeleteError = document.getElementById("admin-delete-error");
const confirmDeleteModal = document.getElementById("confirm-delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

const resetBtn = document.getElementById("reset-btn");
const resetModal = document.getElementById("confirm-reset-modal");
const confirmReset = document.getElementById("confirm-reset");
const cancelReset = document.getElementById("cancel-reset");

const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const searchInput = document.getElementById("search-input");

let allUsers = [];
let currentPage = 1;
const pageSize = 5;

// ─────────────────────────────────────────────────────────
// ✅ Admin Login / Logout
adminLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  try {
    const res = await loginAdmin(email, password);
    if (res.success) {
      isAdmin = true;
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
  isAdmin = false;
  adminControls.style.display = "none";
  alert("Logged out as admin.");
});

// ─────────────────────────────────────────────────────────
// ✅ User Form Submission
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const role = roleInput.value;
  const age = ageInput.value.trim();
  const email = emailInput.value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const subscriptions = Array.from(document.querySelectorAll('input[name="subscribe"]:checked'))
    .map((cb) => cb.value)
    .join(", ") || "None";

  clearErrors();

  const errors = validateForm(name, role, age, email, gender);
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  try {
    if (editRow) {
      const id = editRow.dataset.id;
      const updated = await updateUser(id, { name, role, age, email, gender, subscriptions });
      editRow.innerHTML = generateRowHTML(updated.name, updated.role, updated.age, updated.email, updated.gender, updated.subscriptions, updated.status);
      editRow = null;
      document.getElementById("form-title").textContent = "Add New User";
    } else {
      const created = await submitUser({ name, role, age, email, gender, subscriptions });
      allUsers.push(created);
      applySearchAndRender();
    }

    userForm.reset();
  } catch (err) {
    showErrors([err.error || "Server error"]);
  }
});

// ─────────────────────────────────────────────────────────
// ✅ Table Actions
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

function toggleStatus(row, btn) {
  const current = row.children[6].textContent;
  const newStatus = current === "Active" ? "Inactive" : "Active";
  toggleStatusApi(row.dataset.id, newStatus)
    .then((res) => {
      row.children[6].textContent = res.status;
      btn.textContent = res.status === "Active" ? "Deactivate" : "Activate";
    })
    .catch((err) => {
      adminDeleteError.textContent = err.error || "Server error";
      adminDeleteError.style.display = "block";
    });
}

// ─────────────────────────────────────────────────────────
// ✅ Delete Modal Confirmation
confirmDeleteBtn.addEventListener("click", async () => {
  if (!rowToDelete) return;
  try {
    await deleteUser(rowToDelete.dataset.id, isAdmin);
    allUsers = allUsers.filter((u) => u.id !== +rowToDelete.dataset.id);
    applySearchAndRender();
  } catch (err) {
    adminDeleteError.textContent = err.error || "Server error";
    adminDeleteError.style.display = "block";
  } finally {
    confirmDeleteModal.style.display = "none";
    rowToDelete = null;
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  confirmDeleteModal.style.display = "none";
});

// ─────────────────────────────────────────────────────────
// ✅ Reset Modal Confirmation
confirmReset.addEventListener("click", async () => {
  try {
    await resetData();
    await loadUsers();
  } catch (err) {
    console.error("Reset failed:", err);
  } finally {
    resetModal.style.display = "none";
  }
});

cancelReset.addEventListener("click", () => {
  resetModal.style.display = "none";
});
resetBtn.addEventListener("click", () => {
  resetModal.style.display = "flex";
});

// ─────────────────────────────────────────────────────────
// ✅ Pagination & Filtering Logic
searchInput.addEventListener("input", () => {
  currentPage = 1;
  applySearchAndRender();
});

prevPageBtn.addEventListener("click", () => {
  currentPage--;
  applySearchAndRender();
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  applySearchAndRender();
});

function applySearchAndRender() {
  const query = searchInput.value;
  const filtered = allUsers.filter((u) =>
    u.name.includes(query) || u.email.includes(query) || u.role.includes(query)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  if (currentPage > totalPages) {
    currentPage = totalPages > 0 ? totalPages : 1;
  }

  renderTable(filtered);
}

function renderTable(users) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);
  tableBody.innerHTML = "";

  updatePaginationInfo(users.length);

  if (paginatedUsers.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="8" style="text-align: center; color: #888;">No users found.</td>`;
    tableBody.appendChild(emptyRow);
    return;
  }

  paginatedUsers.forEach((u) => {
    const row = document.createElement("tr");
    row.dataset.id = u.id;
    row.innerHTML = generateRowHTML(u.name, u.role, u.age, u.email, u.gender, u.subscriptions, u.status);
    tableBody.appendChild(row);
  });
}

function updatePaginationInfo(totalUsers) {
  const totalPages = Math.ceil(totalUsers / pageSize);
  const hasUsers = totalUsers > 0;

  pageInfo.textContent = hasUsers ? `Page ${currentPage} of ${totalPages}` : "No results";
  prevPageBtn.disabled = !hasUsers || currentPage <= 1;
  nextPageBtn.disabled = !hasUsers || currentPage >= totalPages;
}

// ─────────────────────────────────────────────────────────
// ✅ Utilities

function loadUsers() {
  fetchUsers()
    .then((users) => {
      allUsers = users;
      currentPage = 1;
      applySearchAndRender();
    })
    .catch((err) => {
      formErrors.textContent = err.error || "Failed to load users";
      formErrors.style.display = "block";
    });
}

function generateRowHTML(name, role, age, email, gender, subscriptions, status) {
  return `<td>${name}</td><td>${role}</td><td>${age}</td><td>${email}</td><td>${gender}</td><td>${subscriptions}</td><td>${status}</td>
  <td>
    <button class="btn-secondary edit-btn">Edit</button>
    <button class="btn-danger delete-btn">Delete</button>
    <button class="btn-primary status-btn">${status === "Active" ? "Deactivate" : "Activate"}</button>
  </td>`;
}

function validateForm(name, role, age, email, gender) {
  const errors = [];

  if (!name || !/^[a-zA-Z]{1,20}$/.test(name)) {
    nameInput.classList.add("error-input");
    errors.push("Name must be 1–20 letters only (no spaces or symbols).");
  }
  if (!role) {
    roleInput.classList.add("error-input");
    errors.push("Role is required.");
  }
  if (!age || isNaN(age) || age < 1 || age > 99) {
    ageInput.classList.add("error-input");
    errors.push("Age must be between 1 and 99.");
  }

  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    emailInput.classList.add("error-input");
    errors.push("Valid email is required.");
  }
  if (!gender) {
    errors.push("Gender selection is required.");
  }

  return errors;
}

function showErrors(errors) {
  formErrors.innerHTML = "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
  formErrors.style.display = "block";
}

function clearErrors() {
  formErrors.style.display = "none";
  formErrors.innerHTML = "";
  [nameInput, roleInput, ageInput, emailInput].forEach((input) => input.classList.remove("error-input"));
}

function populateFormForEdit(row) {
  editRow = row;
  document.getElementById("form-title").textContent = "Edit User";

  nameInput.value = row.children[0].textContent;
  roleInput.value = row.children[1].textContent;
  ageInput.value = row.children[2].textContent;
  emailInput.value = row.children[3].textContent;

  userForm.querySelectorAll('input[name="gender"]').forEach((r) => {
    r.checked = r.value === row.children[4].textContent;
  });

  const subs = row.children[5].textContent.split(", ").map((s) => s.trim());
  userForm.querySelectorAll('input[name="subscribe"]').forEach((cb) => {
    cb.checked = subs.includes(cb.value);
  });
}

// Initial Load
loadUsers();