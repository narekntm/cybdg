import { submitUser, updateUser } from "../api.js";
import { validateForm, clearErrors, showErrors } from "./utils.js";
import { applySearchAndRender } from "./pagination.js";
import { state } from "./state.js";

export function setupUserForm() {
  const userForm = document.getElementById("user-form");
  const nameInput = document.getElementById("name");
  const roleInput = document.getElementById("role");
  const ageInput = document.getElementById("age");
  const emailInput = document.getElementById("email");

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
      if (state.editRow) {
        const id = state.editRow.dataset.id;
        const updated = await updateUser(id, { name, role, age, email, gender, subscriptions });
        state.editRow.innerHTML = generateRowHTML(updated);
        state.editRow = null;
        document.getElementById("form-title").textContent = "Add New User";
      } else {
        const created = await submitUser({ name, role, age, email, gender, subscriptions });
        state.allUsers.push(created);
        applySearchAndRender();
      }

      userForm.reset();
    } catch (err) {
      showErrors([err.error || "Server error"]);
    }
  });
}

function generateRowHTML(u) {
  return `<td>${u.name}</td><td>${u.role}</td><td>${u.age}</td><td>${u.email}</td><td>${u.gender}</td><td>${u.subscriptions}</td><td>${u.status}</td>
  <td>
    <button class="btn-secondary edit-btn">Edit</button>
    <button class="btn-danger delete-btn">Delete</button>
    <button class="btn-primary status-btn">${u.status === "Active" ? "Deactivate" : "Activate"}</button>
  </td>`;
}