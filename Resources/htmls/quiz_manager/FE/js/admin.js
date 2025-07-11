// admin.js
import { apiGet, apiPost, apiDelete } from "./api.js";
import "./logout.js";

// 1) Auth guard: only allow real admins
(async function () {
  try {
    const user = await apiGet("/api/auth/me");
    if (user.role !== "admin") {
      window.location.href = "login.html";
    }
  } catch {
    window.location.href = "login.html";
  }
})();

// 2) DOM elements
const logoutBtn = document.getElementById("logout-btn");
const quizForm = document.getElementById("quiz-form");
const questionList = document.getElementById("question-list");
const addQuestionBtn = document.getElementById("add-question-btn");
const quizListEl = document.getElementById("admin-quiz-list");

// 3) Logout handling
logoutBtn?.addEventListener("click", async () => {
  try {
    await apiPost("/api/logout", {});
  } catch (_) {}
  window.location.href = "login.html";
});

// 4) Add/remove dynamic questions
let questionCounter = 0;

addQuestionBtn?.addEventListener("click", () => {
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
    <input type="text" placeholder="Comma-separated options (for MCQ only)" class="q-options" />
    <button type="button" class="remove-question">Remove</button>
    <br><br>
  `;
  questionList.appendChild(div);
  div.querySelector(".remove-question")?.addEventListener("click", () => div.remove());
});

// 5) Handle form submission
quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  quizForm.classList.add("submitted");

  if (!quizForm.checkValidity()) return;

  const title = document.getElementById("quiz-title").value.trim();
  const description = document.getElementById("quiz-description").value.trim();
  const assignMode = document.getElementById("assign-mode").value;

  const questions = Array.from(document.querySelectorAll(".question-item")).map((qEl, i) => {
    const label = qEl.querySelector(".q-label").value.trim();
    const type = qEl.querySelector(".q-type").value;
    const optsRaw = qEl.querySelector(".q-options").value.trim();
    const options = ["radio", "checkbox", "dropdown"].includes(type)
      ? optsRaw.split(",").map(s => s.trim()).filter(Boolean)
      : [];
    return { id: `q${i}`, label, type, options };
  });

  try {
    await apiPost("/api/quizzes", {
      title,
      description,
      questions,
      assignedUsers: assignMode === "all" ? "all" : []
    });
    alert("Quiz saved successfully!");
    quizForm.reset();
    quizForm.classList.remove("submitted");
    questionList.innerHTML = "";
    loadQuizzes();
  } catch (err) {
    alert("Failed to save quiz: " + err.message);
  }
});

// 6) Load quiz list for admin
async function loadQuizzes() {
  try {
    const quizzes = await apiGet("/api/quizzes");
    quizListEl.innerHTML = "";

    quizzes.forEach(q => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${q.title}</strong> (${q.status})
        <button data-id="${q.id}" class="publish-btn">Publish</button>
        <button data-id="${q.id}" class="archive-btn">Archive</button>
        <button data-id="${q.id}" class="delete-btn">Delete</button>
        <a href="view-submissions.html?quiz=${q.id}">View Submissions</a>
      `;
      quizListEl.appendChild(li);
    });

    document.querySelectorAll(".publish-btn").forEach(btn =>
      btn.addEventListener("click", async () => {
        try {
          await apiPost(`/api/quizzes/${btn.dataset.id}/publish`, {});
        } catch (err) {
          alert("Publish failed: " + err.message);
        }
        loadQuizzes();
      })
    );

    document.querySelectorAll(".archive-btn").forEach(btn =>
      btn.addEventListener("click", async () => {
        try {
          await apiPost(`/api/quizzes/${btn.dataset.id}/archive`, {});
        } catch (err) {
          alert("Archive failed: " + err.message);
        }
        loadQuizzes();
      })
    );

    document.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        try {
          await apiDelete(`/api/quizzes/${btn.dataset.id}`);
        } catch (err) {
          alert("Delete failed: " + err.message);
        }
        loadQuizzes();
      })
    );
  } catch (err) {
    console.error("Could not load quizzes:", err);
    quizListEl.innerHTML = "<li>Error loading quizzes.</li>";
  }
}

// 7) Initial load
loadQuizzes();
