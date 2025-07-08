// user.js
import { apiGet, apiPost } from "./api.js";
import "./logout.js";

// DOM elements for quizzes and submissions
const quizListEl = document.getElementById("quiz-list");
const submissionListEl = document.getElementById("submission-list");

// 1) Page initialization: authenticate then load data
;(async function initUserPage() {
  try {
    const user = await apiGet("/api/auth/me"); // parsed JSON
    if (user.role !== "user") {
      return window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Auth failed:", err);
    return window.location.href = "login.html";
  }

  // 2) Load quizzes and submissions after auth
  await loadAvailableQuizzes();
  await loadSubmissions();
})();

// 3) Load available quizzes for the user
async function loadAvailableQuizzes() {
  quizListEl.innerHTML = "<li>Loading quizzes...</li>";
  try {
    const quizzes = await apiGet("/api/quizzes");
    console.log("User quizzes:", quizzes);
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      quizListEl.innerHTML = "<li>No available quizzes.</li>";
      return;
    }

    quizListEl.innerHTML = "";
    quizzes.forEach(q => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${q.title}</strong>
        <button onclick="window.location.href='quiz-view.html?quiz=${q.id}'">Open</button>
      `;
      quizListEl.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load quizzes:", err);
    quizListEl.innerHTML = "<li>Error loading quizzes.</li>";
  }
}

// 4) Load user's own submissions
async function loadSubmissions() {
  submissionListEl.innerHTML = "<li>Loading submissions...</li>";
  try {
    const subs = await apiGet("/api/submissions/me");
    console.log("User submissions:", subs);
    if (!Array.isArray(subs) || subs.length === 0) {
      submissionListEl.innerHTML = "<li>No submissions found.</li>";
      return;
    }

    submissionListEl.innerHTML = "";
    for (const sub of subs) {
      try {
        const quiz = await apiGet(`/api/quizzes/${sub.quizId}`);
        const editable = quiz.status === "active";
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${quiz.title}</strong> – ${new Date(sub.createdAt).toLocaleString()}<br>
          <button onclick="window.location.href='quiz-view.html?quiz=${quiz.id}&submission=${sub.id}'">
            ${editable ? "Edit" : "View"} Submission
          </button>
        `;
        submissionListEl.appendChild(li);
      } catch (err) {
        console.error(`Failed to fetch quiz ${sub.quizId}:`, err);
      }
    }
  } catch (err) {
    console.error("Failed to load submissions:", err);
    submissionListEl.innerHTML = "<li>Error loading submissions.</li>";
  }
}
