// view-submissions.js
import { apiGet } from "./api.js";
import "./logout.js";

const quizId = new URLSearchParams(window.location.search).get("quiz");
const quizInfo = document.getElementById("quiz-info");
const list = document.getElementById("submission-list");

async function init() {
  // Initial loading state
  quizInfo.innerHTML = "<p>Loading quiz details...</p>";
  list.innerHTML = "<p>Loading submissions...</p>";

  if (!quizId) {
    quizInfo.innerHTML = "";
    list.innerHTML = "<p>Missing quiz ID in URL</p>";
    return;
  }

  try {
    // Fetch quiz details
    const quiz = await apiGet(`/api/quizzes/${quizId}`);
    quizInfo.innerHTML = `<h2>${quiz.title}</h2><p>${quiz.description}</p>`;

    // Fetch submissions
    const submissions = await apiGet(`/api/quizzes/${quizId}/submissions`);
    if (submissions.length === 0) {
      list.innerHTML = "<p>No submissions yet.</p>";
      return;
    }

    // Clear loading state
    list.innerHTML = "";

    // Render each submission
    submissions.forEach((sub) => {
      const timestamp = new Date(sub.createdAt).toLocaleString();
      const container = document.createElement("div");
      container.className = "submission";

      // Submission header
      const header = document.createElement("h3");
      header.textContent = `User ${sub.userId} – ${timestamp}`;
      container.appendChild(header);

      // Answers list
      const dl = document.createElement("dl");
      Object.entries(sub.answers).forEach(([qid, answer]) => {
        const dt = document.createElement("dt");
        dt.textContent = qid;
        const dd = document.createElement("dd");
        dd.textContent = Array.isArray(answer)
          ? answer.join(", ")
          : answer;
        dl.appendChild(dt);
        dl.appendChild(dd);
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

init();
