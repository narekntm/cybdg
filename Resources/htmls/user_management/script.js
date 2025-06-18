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

// ─────────────────────────────────────────────────────────
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

const resetBtn       = document.getElementById('reset-btn');
const resetModal     = document.getElementById('confirm-reset-modal');
const confirmReset   = document.getElementById('confirm-reset');
const cancelReset    = document.getElementById('cancel-reset');

// ─────────────────────────────────────────────────────────
// ✅ Admin Login / Logout
// ─────────────────────────────────────────────────────────
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
// ─────────────────────────────────────────────────────────
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
      const row = document.createElement("tr");
      row.dataset.id = created.id;
      row.innerHTML = generateRowHTML(created.name, created.role, created.age, created.email, created.gender, created.subscriptions, created.status);
      tableBody.appendChild(row);
    }

    userForm.reset();
  } catch (err) {
    showErrors([err.error || "Server error"]);
  }
});

// ─────────────────────────────────────────────────────────
// ✅ Table Actions: Edit, Delete, Toggle Status
// ─────────────────────────────────────────────────────────
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
// ─────────────────────────────────────────────────────────
confirmDeleteBtn.addEventListener("click", async () => {
  if (!rowToDelete) return;
  try {
    await deleteUser(rowToDelete.dataset.id, isAdmin);
    rowToDelete.remove();
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
// ─────────────────────────────────────────────────────────
confirmReset.addEventListener('click', async () => {
  try {
    await resetData();
    await loadUsers();        // re-fetch & re-render the table
    // optionally: showToast('Data has been reset');
  } catch (err) {
    console.error('Reset failed:', err);
    // optionally: showToast('Reset failed', 'error');
  } finally {
    resetModal.style.display = 'none';
  }
});

// if they cancel
cancelReset.addEventListener('click', () => {
  resetModal.style.display = 'none';
});
resetBtn.addEventListener('click', () => {
  // show the modal instead of window.confirm
  resetModal.style.display = 'flex';
});

// ─────────────────────────────────────────────────────────
// ✅ Utility Functions
// ─────────────────────────────────────────────────────────
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
  const emailRegex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
  
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

function handleDelete(row) {
  if (!isAdmin && row.children[1].textContent === "Admin") {
    adminDeleteError.textContent = "Admin login required to delete Admin-level users.";
    adminDeleteError.style.display = "block";
    return;
  }
  rowToDelete = row;
  confirmDeleteModal.style.display = "flex";
}

// ─────────────────────────────────────────────────────────
// ✅ Load Users from API
// ─────────────────────────────────────────────────────────
function loadUsers() {
  fetchUsers()
    .then((users) => {
      tableBody.innerHTML = "";
      users.forEach((u) => {
        const row = document.createElement("tr");
        row.dataset.id = u.id;
        row.innerHTML = generateRowHTML(u.name, u.role, u.age, u.email, u.gender, u.subscriptions, u.status);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      formErrors.textContent = err.error || "Failed to load users";
      formErrors.style.display = "block";
    });
}

loadUsers();

