/**
 * Displays form error messages in a formatted list.
 * @param {string[]} errors
 */
export function showErrors(errors) {
  const formErrors = document.getElementById("form-errors");
  formErrors.innerHTML = "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
  formErrors.style.display = "block";
}

/**
 * Clears all form error messages and styling.
 */
export function clearErrors() {
  const formErrors = document.getElementById("form-errors");
  formErrors.style.display = "none";
  formErrors.innerHTML = "";

  // Clear any red borders or styles
  ["name", "role", "age", "email"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("error-input");
  });
}
