import { showToast } from './toast.js';
import { clearErrors, showErrors } from './utils.js'

const userId = new URLSearchParams(window.location.search).get("id");

const errorBox = document.getElementById("error");
const userCard = document.getElementById("user-card");
const profilePic = document.getElementById("profile-pic");
const userForm = document.getElementById("user-form");
const userName = document.getElementById("user-name");

const editBtn = document.getElementById("edit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const saveBtn = document.getElementById("save-btn");

const viewButtons = document.getElementById("view-mode-buttons");
const editButtons = document.getElementById("edit-mode-buttons");

let currentUser;

function renderForm(user, isEditable) {
  userForm.innerHTML = "";

  const fields = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "age", label: "Age" },
    { key: "email", label: "Email" },
    { key: "gender", label: "Gender" },
    { key: "subscriptions", label: "Subscriptions" },
    { key: "status", label: "Status" }
  ];

  fields.forEach(({ key, label }) => {
    const row = document.createElement("div");
    row.className = "info-row";

    const labelEl = document.createElement("label");
    labelEl.textContent = `${label}:`;
    labelEl.setAttribute("for", key);

    const container = document.createElement("div");
    container.className = "value";

    const value = user[key] ?? "";

    if (!isEditable) {
      // 🟢 View mode (plain text)
      container.textContent =
        key === "subscriptions"
          ? value.split(",").map(s => s.trim()).join(", ")
          : value || "—";
    } else {
      // ✏️ Edit mode
      let input;

      if (["role", "gender", "status"].includes(key)) {
        input = document.createElement("select");
        const options = {
          role: ["Admin", "Editor", "Viewer"],
          gender: ["Male", "Female", "Other"],
          status: ["Active", "Inactive"],
        }[key];

        options.forEach((opt) => {
          const o = document.createElement("option");
          o.value = opt;
          o.textContent = opt;
          if (opt === value) o.selected = true;
          input.appendChild(o);
        });

        input.id = key;
        input.name = key;
        container.appendChild(input);
      } else if (key === "subscriptions") {
        const selected = value.split(",").map(s => s.trim()).filter(Boolean);
        const allOptions = ["Newsletter", "Product Updates"];

        if (!isEditable) {
          container.textContent = selected.length > 0 ? selected.join(", ") : "—";
        } else {
          const wrapper = document.createElement("div");
          wrapper.className = "checkbox-group";

          allOptions.forEach(opt => {
            const checkboxWrapper = document.createElement("label");
            checkboxWrapper.className = "checkbox-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "subscriptions";
            checkbox.value = opt;
            checkbox.checked = selected.includes(opt);

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.append(` ${opt}`);
            wrapper.appendChild(checkboxWrapper);
          });

          container.appendChild(wrapper);
        }
      }
    else {
        input = document.createElement("input");
        input.type = key === "age" ? "number" : "text";
        input.value = value;
        input.id = key;
        input.name = key;
        container.appendChild(input);
      }
    }

    row.appendChild(labelEl);
    row.appendChild(container);
    userForm.appendChild(row);
  });

  userName.textContent = user.name;
}

const getAvatarForGender = (gender) => {
  if (gender === "Male") return "https://randomuser.me/api/portraits/men/11.jpg";
  if (gender === "Female") return "https://randomuser.me/api/portraits/women/11.jpg";
  return "https://randomuser.me/api/portraits/lego/6.jpg";
};

function loadUser() {
  fetch(`/api/users/${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("User not found.");
      return res.json();
    })
    .then((user) => {
      currentUser = user;

      profilePic.src = getAvatarForGender(user.gender);

      renderForm(user, false);
    })
    .catch((err) => {
      errorBox.textContent = err.message;
      userCard.style.display = "none";
    });
}

editBtn.onclick = () => {
  renderForm(currentUser, true);
  viewButtons.style.display = "none";
  editButtons.style.display = "flex";
};

cancelBtn.onclick = () => {
  renderForm(currentUser, false);
  viewButtons.style.display = "flex";
  editButtons.style.display = "none";
};

document.getElementById("back-btn").onclick = () => {
  window.location.href = "index.html#reload";
};

saveBtn.onclick = (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(userForm);
  const updated = {};

  for (const [key, value] of formData.entries()) {
    updated[key] = key === "age" ? +value : value;
  }

  // ✅ Handle checkbox subscriptions
  const selectedSubs = Array.from(
    userForm.querySelectorAll('input[name="subscriptions"]:checked')
  ).map(cb => cb.value);

  updated.subscriptions = selectedSubs.join(", ");

  fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  })
    .then((res) => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status >= 400) {
        const messages = body.errors || [body.error || "Update failed"];
        showErrors(messages);
        showToast(messages.join(", "), "error");
        return;
      }

      currentUser = body;
      renderForm(body, false);
      viewButtons.style.display = "flex";
      editButtons.style.display = "none";
      showToast("User updated!", "success");
    })
    .catch(() => {
      showErrors(["Something went wrong. Please try again."]);
      showToast("Failed to save user.", "error");
    });
};

if (!userId) {
  errorBox.textContent = "❌ Missing user ID.";
  userCard.style.display = "none";
} else {
  loadUser();
}
