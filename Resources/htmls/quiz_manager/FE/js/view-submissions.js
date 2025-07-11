// view-submissions.js (Enhanced UI)
import { apiGet } from "./api.js";
import "./logout.js";

const quizId = new URLSearchParams(window.location.search).get("quiz");
const quizInfo = document.getElementById("quiz-info");
const list = document.getElementById("submission-list");

async function init() {
  quizInfo.innerHTML = "<p>Loading quiz details...</p>";
  list.innerHTML = "<p>Loading submissions...</p>";

  if (!quizId) {
    quizInfo.innerHTML = "";
    list.innerHTML = "<p>Missing quiz ID in URL</p>";
    return;
  }

  try {
    const quiz = await apiGet(`/api/quizzes/${quizId}`);
    quizInfo.innerHTML = `
      <div class="quiz-header">
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
      </div>`;

    const submissions = await apiGet(`/api/quizzes/${quizId}/submissions`);
    if (submissions.length === 0) {
      list.innerHTML = "<p>No submissions yet.</p>";
      return;
    }

    // Show total count
    const countDisplay = document.createElement("p");
    countDisplay.innerHTML = `<strong>Total Submissions:</strong> ${submissions.length}`;
    list.innerHTML = "";
    list.appendChild(countDisplay);

    submissions.forEach((sub, index) => {
      const timestamp = new Date(sub.createdAt).toLocaleString();
      const container = document.createElement("div");
      container.className = "submission";
      container.classList.add("submission-card");
      container.classList.add("submission-toggle");

      const header = document.createElement("h3");
      header.innerHTML = `Submission #${index + 1} &ndash; <strong>User:</strong> ${sub.userId} <span class="submission-timestamp">${timestamp}</span>`;
      container.appendChild(header);

      const dl = document.createElement("dl");
      dl.style.display = "none";

      Object.entries(sub.answers).forEach(([qid, answer]) => {
        const label = quiz.questions.find(q => q.id === qid)?.label || qid;
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = Array.isArray(answer) ? answer.join(", ") : answer;
        dl.appendChild(dt);
        dl.appendChild(dd);
      });

      // Toggle display on header click
      container.addEventListener("click", () => {
        dl.style.display = dl.style.display === "none" ? "grid" : "none";
      });

      container.appendChild(dl);
      list.appendChild(container);
    });
  } catch (err) {
    console.error("Error loading submissions:", err);
    quizInfo.innerHTML = "";
    list.innerHTML = `<p class=\"error\">Error: ${err.message}</p>`;
  }
}

// Add global expand/collapse toggle
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Expand All";
toggleBtn.className = "toggle-submissions";
toggleBtn.addEventListener("click", () => {
  const allDl = document.querySelectorAll(".submission dl");
  const isCollapsed = Array.from(allDl).every(dl => dl.style.display === "none");
  allDl.forEach(dl => dl.style.display = isCollapsed ? "grid" : "none");
  toggleBtn.textContent = isCollapsed ? "Collapse All" : "Expand All";
});
list.prepend(toggleBtn);

init();
