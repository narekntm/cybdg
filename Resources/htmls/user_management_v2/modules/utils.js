export function validateForm(name, role, age, email, gender) {
  const errors = [];
  const nameInput = document.getElementById("name");
  const roleInput = document.getElementById("role");
  const ageInput = document.getElementById("age");
  const emailInput = document.getElementById("email");

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    emailInput.classList.add("error-input");
    errors.push("Valid email is required.");
  }
  if (!gender) {
    errors.push("Gender selection is required.");
  }

  return errors;
}

export function showErrors(errors) {
  const formErrors = document.getElementById("form-errors");
  formErrors.innerHTML = "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
  formErrors.style.display = "block";
}

export function clearErrors() {
  const formErrors = document.getElementById("form-errors");
  formErrors.style.display = "none";
  formErrors.innerHTML = "";
  ["name", "role", "age", "email"].forEach((id) => {
    document.getElementById(id).classList.remove("error-input");
  });
}