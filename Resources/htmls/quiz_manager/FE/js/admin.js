// admin.js (refactored + modularized)
import { apiGet, apiPost, apiDelete, apiPatch } from './api.js'
import "./logout.js";

// DOM References
const quizForm = document.getElementById("quiz-form");
const logoutBtn = document.getElementById("logout-btn");
const questionList = document.getElementById("question-list");
const addQuestionBtn = document.getElementById("add-question-btn");
const quizListEl = document.getElementById("admin-quiz-list");
const assignModeSelect = document.getElementById("assign-mode");
const userCheckboxContainer = document.getElementById("user-checkboxes");

let questionCounter = 0;
let allUsers = [];

initAdminPage();

function initAdminPage() {
  guardAdmin();
  bindLogout();
  bindQuestionBuilder();
  bindAssignmentModeToggle();
  bindFormSubmission();
  loadQuizzes();
  loadUsers();
  bindQuizFormToggle();
}

async function guardAdmin() {
  try {
    const user = await apiGet("/api/auth/me");
    if (user.role !== "admin") throw new Error();
  } catch {
    window.location.href = "login.html";
  }
}

function bindLogout() {
  logoutBtn?.addEventListener("click", async () => {
    try {
      await apiPost("/api/logout", {});
    } catch (_) {}
    window.location.href = "login.html";
  });
}

function bindQuestionBuilder() {
  addQuestionBtn.addEventListener("click", () => {
    const qId = `q${questionCounter++}`;
    const div = document.createElement("div");
    div.className = "question-item";
    div.innerHTML = `
      <input type="text" placeholder="Question text" data-qid="${qId}" class="q-label" required />
      <select class="q-type">
        <option value="input">Input</option>
        <option value="radio">Radio</option>
        <option value="checkbox">Checkbox</option>
        <option value="dropdown">Dropdown</option>
      </select>
      <div class="q-options-container hidden">
        <div class="q-options-list"></div>
        <div class="q-options-controls">
          <input type="text" class="option-input" placeholder="Option text" />
          <button type="button" class="add-option">+</button>
        </div>
      </div>
      <button type="button" class="remove-question">Remove</button>
    `;

    const typeSelect = div.querySelector(".q-type");
    const optionsContainer = div.querySelector(".q-options-container");
    const optionsList = div.querySelector(".q-options-list");
    const addBtn = div.querySelector(".add-option");
    const inputEl = div.querySelector(".option-input");

    // Show/hide options input based on question type
    typeSelect.addEventListener("change", () => {
      const isInput = typeSelect.value === "input";
      optionsContainer.classList.toggle("hidden", isInput);
    });

    // Create and append new option item
    function addOption() {
      const val = inputEl.value.trim();
      if (!val) return;
      const opt = document.createElement("div");
      opt.className = "q-option-item";
      opt.innerHTML = `
        <span>${val}</span>
        <button type="button" class="remove-option">x</button>
      `;
      opt.querySelector(".remove-option").addEventListener("click", () => opt.remove());
      optionsList.appendChild(opt);
      inputEl.value = "";
    }

    addBtn.addEventListener("click", addOption);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addOption();
      }
    });

    div.querySelector(".remove-question").addEventListener("click", () => div.remove());

    questionList.appendChild(div);
  });
}

function bindAssignmentModeToggle() {
  assignModeSelect.addEventListener("change", () => {
    const isCustom = assignModeSelect.value === "custom";
    userCheckboxContainer.classList.toggle("hidden", !isCustom);
    if (isCustom && userCheckboxContainer.innerHTML.trim() === "") {
      loadUsers();
    }
  });
}

function bindQuizFormToggle() {
  const quizSection = document.getElementById("quiz-creator");
  const toggleHeader = quizSection.querySelector(".toggle-header");

  toggleHeader.addEventListener("click", () => {
    quizSection.classList.toggle("open");
  });
}


function bindFormSubmission() {
  quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    quizForm.classList.add("submitted");
    if (!quizForm.checkValidity()) return;

    const payload = buildQuizPayload();
    if (!payload) return; // failed validation inside builder

    try {
      await apiPost("/api/quizzes", payload);
      alert("Quiz saved successfully!");
      resetForm();
      loadQuizzes();
    } catch (err) {
      alert("Failed to save quiz: " + err.message);
    }
  });
}

function buildQuizPayload() {
  const title = document.getElementById("quiz-title").value.trim();
  const description = document.getElementById("quiz-description").value.trim();
  const assignMode = assignModeSelect.value;

  const questions = Array.from(document.querySelectorAll(".question-item")).map((qEl, i) => {
    const label = qEl.querySelector(".q-label").value.trim();
    const type = qEl.querySelector(".q-type").value;
    const options = [];
    if (["radio", "checkbox", "dropdown"].includes(type)) {
      const optItems = qEl.querySelectorAll(".q-option-item span");
      optItems.forEach(opt => options.push(opt.textContent));
    }
    return { id: `q${i}`, label, type, options };
  });

  if (questions.length === 0) {
    alert("At least one question is required.");
    return null;
  }

  let assignedUsers = "all";
  if (assignMode === "custom") {
    assignedUsers = Array.from(userCheckboxContainer.querySelectorAll("input[type=checkbox]:checked"))
      .map(cb => cb.value);
    if (assignedUsers.length === 0) {
      alert("Please select at least one user.");
      return null;
    }
  }

  return { title, description, questions, assignedUsers };
}

function resetForm() {
  quizForm.reset();
  quizForm.classList.remove("submitted");
  questionList.innerHTML = "";
  userCheckboxContainer.innerHTML = "";
  userCheckboxContainer.classList.add("hidden");
}

async function loadQuizzes() {
  try {
    const quizzes = await apiGet("/api/quizzes");
    quizListEl.innerHTML = "";

    const quizzCount = document.getElementById("quiz-count");
    quizzCount.innerText = `(${quizzes.length})`;
    quizzes.forEach(q => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="quiz-title">
            ${q.title} <span class="status-badge ${q.status}">${q.status}</span>
          </div>
          <div class="quiz-actions">
            <button data-id="${q.id}" class="publish-btn">Publish</button>
            <button data-id="${q.id}" class="archive-btn">Archive</button>
            <button data-id="${q.id}" class="delete-btn">Delete</button>
          </div>
          <a class="view-submissions" href="view-submissions.html?quiz=${q.id}">View Submissions</a>
      `;
      quizListEl.appendChild(li);
    });

    quizListEl.querySelectorAll(".publish-btn").forEach(btn =>
      btn.addEventListener("click", async () => {
        try {
          await apiPatch(`/api/quizzes/${btn.dataset.id}/publish`, {});
          loadQuizzes();
        } catch (err) {
          alert("Publish failed: " + err.message);
        }
      })
    );

    quizListEl.querySelectorAll(".archive-btn").forEach(btn =>
      btn.addEventListener("click", async () => {
        try {
          await apiPatch(`/api/quizzes/${btn.dataset.id}/archive`, {});
          loadQuizzes();
        } catch (err) {
          alert("Archive failed: " + err.message);
        }
      })
    );

    quizListEl.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        try {
          await apiDelete(`/api/quizzes/${btn.dataset.id}`);
          loadQuizzes();
        } catch (err) {
          alert("Delete failed: " + err.message);
        }
      })
    );
  } catch (err) {
    console.error("Could not load quizzes:", err);
    quizListEl.innerHTML = "<li>Error loading quizzes.</li>";
  }
}

async function loadUsers() {
  try {
    const users = await apiGet("/api/users");
    allUsers = users.filter(u => u.role !== "admin");

    userCheckboxContainer.innerHTML = allUsers.map(u => `
      <label class="user-checkbox">
        <input type="checkbox" value="${u.email}" />
        <span>${u.email}</span>
      </label>
    `).join("");
  } catch (err) {
    console.warn("Could not load users:", err);
  }
}
