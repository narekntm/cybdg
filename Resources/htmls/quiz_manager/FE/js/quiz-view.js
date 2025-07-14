// quiz-view.js
import { apiGet, apiPost, apiPut } from './api.js'
import "./logout.js";
import {showToast} from "./toast.js"

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
  try {
    await apiGet("/api/auth/me");
  } catch {
    return window.location.href = "login.html";
  }

  if (!quizId) {
    titleEl.textContent = "Quiz not specified.";
    submitBtn.style.display = "none";
    return;
  }

  try {
    quiz = await apiGet(`/api/quizzes/${quizId}`);
  } catch {
    showToast("Quiz not found.", "error");
    return;
  }

  titleEl.textContent = quiz.title;
  descEl.textContent  = quiz.description;

  let existingAnswers = {};
  if (submissionId) {
    try {
      const submission = await apiGet(`/api/submissions/${submissionId}`);
      existingAnswers = submission.answers || {};
    } catch {
      existingAnswers = {};
    }
  }

  renderForm(quiz.questions, existingAnswers);

  const isReadOnly = quiz.status === "archived"
    || (submissionId && quiz.status !== "active");
  submitBtn.style.display = isReadOnly ? "none" : "";
})();

function renderForm(questions, answers) {
  quizForm.innerHTML = "";

  questions.forEach(q => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";

    const title = document.createElement("div");
    title.className = "question-header";
    title.textContent = q.label;
    wrapper.appendChild(title);

    const value = answers[q.id] || "";

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
        const group = document.createElement("div");
        group.className = "option-list horizontal";

        q.options.forEach(opt => {
          const optLabel = document.createElement("label");
          optLabel.textContent = opt;

          const input = document.createElement("input");
          input.type = q.type;
          input.name = q.id;
          input.value = opt;

          if (q.type === "radio" && value === opt) input.checked = true;
          if (q.type === "checkbox" && Array.isArray(value) && value.includes(opt)) input.checked = true;

          optLabel.prepend(input); // ensure input is inside label
          console.log("Rendering label:", optLabel.outerHTML);

          group.appendChild(optLabel);
        });

        wrapper.appendChild(group);
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
    submissionId ? await apiPut(`/api/submissions/${submissionId}`, { answers }) : await apiPost(`/api/quizzes/${quizId}/submissions`, { quizId, answers });
    showToast("Submission successful", "success");
    window.location.href = "user.html";
  } catch (err) {
    showToast("Failed to submit: " + err.message, "error");
  }
});
