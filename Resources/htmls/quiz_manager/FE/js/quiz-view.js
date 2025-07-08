// quiz-view.js
import { apiGet, apiPost } from "./api.js";
import "./logout.js";

// Extract query params
const params = new URLSearchParams(window.location.search);
const quizId = params.get("quiz");
const submissionId = params.get("submission");

// DOM elements
const quizForm  = document.getElementById("quiz-form");
const submitBtn = document.getElementById("submit-btn");
const titleEl   = document.getElementById("quiz-title");
const descEl    = document.getElementById("quiz-description");

let quiz = null;

(async function init() {
  // 1) Auth guard: redirect if not logged in
  try {
    await apiGet("/api/auth/me");
  } catch {
    return window.location.href = "login.html";
  }

  // 2) Validate quizId
  if (!quizId) {
    titleEl.textContent = "Quiz not specified.";
    submitBtn.style.display = "none";
    return;
  }

  // 3) Fetch quiz details
  try {
    quiz = await apiGet(`/api/quizzes/${quizId}`);
  } catch {
    alert("Quiz not found.");
    return;
  }

  titleEl.textContent = quiz.title;
  descEl.textContent  = quiz.description;

  // 4) Fetch existing answers (if editing)
  let existingAnswers = {};
  if (submissionId) {
    try {
      const submission = await apiGet(`/api/submissions/${submissionId}`);
      existingAnswers = submission.answers || {};
    } catch {
      existingAnswers = {};
    }
  }

  // 5) Render dynamic form
  renderForm(quiz.questions, existingAnswers);

  // 6) Hide submit if read-only
  const isReadOnly = quiz.status === "archived"
    || (submissionId && quiz.status !== "active");
  submitBtn.style.display = isReadOnly ? "none" : "";
})();

function renderForm(questions, answers) {
  quizForm.innerHTML = "";

  questions.forEach(q => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";

    // Label
    const label = document.createElement("label");
    label.textContent = q.label;
    wrapper.appendChild(label);

    const value = answers[q.id] || "";

    // Input types
    switch (q.type) {
      case "input": {
        const input = document.createElement("input");
        input.type = "text";
        input.name = q.id;
        input.value = value;
        wrapper.appendChild(input);
        break;
      }
      case "radio":
      case "checkbox": {
        q.options.forEach(opt => {
          const optLabel = document.createElement("label");
          const input    = document.createElement("input");
          input.type     = q.type;
          input.name     = q.id;
          input.value    = opt;
          if (q.type === "radio" && value === opt) input.checked = true;
          if (q.type === "checkbox" && Array.isArray(value) && value.includes(opt)) input.checked = true;
          optLabel.appendChild(input);
          optLabel.appendChild(document.createTextNode(opt));
          wrapper.appendChild(optLabel);
        });
        break;
      }
      case "dropdown": {
        const select = document.createElement("select");
        select.name = q.id;
        q.options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          if (opt === value) option.selected = true;
          select.appendChild(option);
        });
        wrapper.appendChild(select);
        break;
      }
    }

    quizForm.appendChild(wrapper);
  });
}

// Handle submission
submitBtn.addEventListener("click", async () => {
  if (!quiz) return;

  const formData = new FormData(quizForm);
  const answers  = {};

  quiz.questions.forEach(q => {
    if (q.type === "checkbox") {
      answers[q.id] = formData.getAll(q.id);
    } else {
      answers[q.id] = formData.get(q.id);
    }
  });

  try {
    await apiPost(`/api/quizzes/${quizId}/submissions`, { quizId, answers });
    alert("Submission successful");
    window.location.href = "user.html";
  } catch (err) {
    alert("Failed to submit: " + err.message);
  }
});
