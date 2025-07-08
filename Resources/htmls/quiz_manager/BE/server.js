// server.js (UPDATED with default quiz inside structure-aware version)

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// In-memory data stores
const users = [
  { id: "admin1", email: "admin@example.com", password: "admin123", role: "admin" },
  { id: "user1", email: "user@example.com", password: "user123", role: "user" },
];

const quizzes = [];
const submissions = [];
const sessions = {};

// ✅ Create default quiz for all users
quizzes.push({
  id: uuidv4(),
  title: "Welcome Quiz",
  description: "A sample quiz available to all users",
  questions: [
    { id: "q1", label: "What's your name?", type: "input", options: [] },
    { id: "q2", label: "Your gender?", type: "radio", options: ["Male", "Female", "Other"] },
    { id: "q3", label: "Technologies you like", type: "checkbox", options: ["JavaScript", "Python", "Go"] },
    { id: "q4", label: "Country", type: "dropdown", options: ["Armenia", "USA", "Germany"] }
  ],
  createdBy: "admin1",
  assignedUsers: "all",
  status: "active"
});

function authenticate(req, res, next) {
  const token = req.cookies.authToken;
  if (token && sessions[token]) {
    req.user = sessions[token];
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

function isAdmin(req, res, next) {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ error: "Forbidden" });
}

app.post("/api/login",  bodyParser.json(),(req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const sessionId = uuidv4();
  sessions[sessionId] = user;
  res.cookie("authToken", sessionId, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/"
  });
  res.json({ success: true });
});

app.post("/api/logout", authenticate,  bodyParser.json(),(req, res) => {
  const token = req.cookies.authToken;
  delete sessions[token];
  res.clearCookie("authToken", {
    path: "/"
  });
  res.json({ success: true });
});

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json(req.user);
});

app.post("/api/quizzes", authenticate, isAdmin,  bodyParser.json(),(req, res) => {
  const { title, description, questions, assignedUsers } = req.body;
  const quiz = {
    id: uuidv4(),
    title,
    description,
    questions,
    assignedUsers: assignedUsers || "all",
    status: "draft",
    createdBy: req.user.id,
  };
  quizzes.push(quiz);
  res.json(quiz);
});

app.post("/api/quizzes/:id/publish", authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  quiz.status = "active";
  res.json({ success: true });
});

app.post("/api/quizzes/:id/archive", authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  quiz.status = "archived";
  res.json({ success: true });
});

app.delete("/api/quizzes/:id", authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  const hasSubmissions = submissions.some(s => s.quizId === quiz.id);
  if (hasSubmissions) return res.status(400).json({ error: "Quiz has submissions" });

  const index = quizzes.findIndex(q => q.id === quiz.id);
  quizzes.splice(index, 1);
  res.json({ success: true });
});

app.get("/api/quizzes", authenticate, (req, res) => {
  const user = req.user;
  console.log("Quiz list request from", user.role, user.email);

  if (user.role === "admin") {
    const result = quizzes.filter(q => q.createdBy === user.id);
    return res.json(result);
  }

  if (user.role === "user") {
    const result = quizzes.filter(q =>
      (q.assignedUsers === "all" || q.assignedUsers.includes(user.email)) &&
      q.status === "active"
    );
    console.log("Returning", result.length, "quizzes for user");
    return res.json(result);
  }

  res.status(403).json({ error: "Unauthorized" });
});

app.get("/api/quizzes/:id", authenticate, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Not found" });
  res.json(quiz);
});

app.post("/api/quizzes/:id/submissions", authenticate, bodyParser.json(), (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  const submission = {
    id: uuidv4(),
    quizId: quiz.id,
    userId: req.user.id,
    answers: req.body.answers,
    createdAt: new Date().toISOString(),
  };
  submissions.push(submission);
  res.json(submission);
});

app.get("/api/submissions/me", authenticate, (req, res) => {
  const mySubs = submissions.filter(s => s.userId === req.user.id);
  res.json(mySubs);
});

app.put("/api/submissions/:id", authenticate,  bodyParser.json(), (req, res) => {
  const sub = submissions.find(s => s.id === req.params.id);
  if (!sub || sub.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  const quiz = quizzes.find(q => q.id === sub.quizId);
  if (quiz.status !== "active") return res.status(400).json({ error: "Quiz is not editable" });

  sub.answers = req.body.answers;
  res.json({ success: true });
});

app.get("/api/quizzes/:id/submissions", authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  const quizSubs = submissions.filter(s => s.quizId === quiz.id);
  res.json(quizSubs);
});

app.get("/api/submissions/:id", authenticate, (req, res) => {
  const sub = submissions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: "Submission not found" });

  if (req.user.role !== "admin" && sub.userId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json(sub);
});

app.listen(PORT, () => {
  console.log(`Quiz backend running at http://localhost:${PORT}`);
});