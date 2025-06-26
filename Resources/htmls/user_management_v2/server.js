// server.js
import express from "express";
import cors from "cors";

// ──────────────────────────────
// 📌 Constants & Validation
// ──────────────────────────────
const VALIDATION_ERRORS = {
  name: "Name must be 1–20 letters only (no spaces or symbols).",
  role: "Role is required.",
  age: "Age must be between 1 and 99.",
  email: "Valid email is required.",
  gender: "Gender selection is required.",
  duplicateEmail: "Email already exists.",
  notFound: "User not found.",
};

function validateUserPayload(data) {
  const errors = [];

  if (!data.name || !/^[A-Za-z]{1,20}$/.test(data.name)) {
    errors.push(VALIDATION_ERRORS.name);
  }

  if (!data.role) {
    errors.push(VALIDATION_ERRORS.role);
  }

  if (!data.age || isNaN(data.age) || data.age < 1 || data.age > 99) {
    errors.push(VALIDATION_ERRORS.age);
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push(VALIDATION_ERRORS.email);
  }

  if (!data.gender) {
    errors.push(VALIDATION_ERRORS.gender);
  }

  return errors;
}

function getNextId() {
  return users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}

// ──────────────────────────────
// 🔧 Express Setup
// ──────────────────────────────
const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:8080"]
}));

app.use(express.json());

// ──────────────────────────────
// 🧪 Data
// ──────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: "Alice", role: "Admin", age: 30, email: "alice@site.com", gender: "Female", subscriptions: "Newsletter", status: "Active" },
  { id: 2, name: "Bob", role: "Viewer", age: 25, email: "bob@site.com", gender: "Male", subscriptions: "Product Updates", status: "Inactive" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
];

let users = INITIAL_USERS.map(u => ({ ...u }));

// ──────────────────────────────
// ✅ Routes
// ──────────────────────────────

// 🔐 Admin login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") {
    return res.json({ success: true });
  }
  return res.status(401).json({ errors: ["Invalid credentials."] });
});

// 📋 List users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// ➕ Add user
app.post("/api/users", (req, res) => {
  const user = { ...req.body, email: req.body.email?.toLowerCase().trim() };
  const errors = validateUserPayload(user);
  if (errors.length > 0) return res.status(400).json({ errors });

  const exists = users.some(u => u.email === user.email);
  if (exists) return res.status(409).json({ errors: [VALIDATION_ERRORS.duplicateEmail] });

  const id = getNextId();
  const newUser = { id, ...user, status: "Active" };
  users.push(newUser);
  res.json(newUser);
});

// 🖊️ Update user
app.put("/api/users/:id", (req, res) => {
  const id = +req.params.id;
  const user = { ...req.body, email: req.body.email?.toLowerCase().trim() };
  const errors = validateUserPayload(user);
  if (errors.length > 0) return res.status(400).json({ errors });

  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });

  const duplicateEmail = users.some(u => u.email === user.email && u.id !== id);
  if (duplicateEmail) return res.status(409).json({ errors: [VALIDATION_ERRORS.duplicateEmail] });

  users[index] = { ...users[index], ...user };
  res.json(users[index]);
});

// ❌ Delete user
app.delete("/api/users/:id", (req, res) => {
  const id = +req.params.id;
  const { isAdmin } = req.body;

  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });

  if (!isAdmin && users[index].role === "Admin") {
    return res.status(403).json({ errors: ["Admin login required to delete Admin user"] });
  }

  users.splice(index, 1);
  res.json({ success: true });
});

// 🔁 Toggle status
app.patch("/api/users/:id/status", (req, res) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });

  user.status = req.body.status || user.status;
  res.json(user);
});

// ♻️ Reset data
app.post("/api/reset", (req, res) => {
  users = INITIAL_USERS.map(u => ({ ...u }));
  res.json({ success: true, users });
});

// 🗂️ Serve static UI
app.use(express.static("Resources/htmls/user_management_v2"));

// 🛑 Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Internal error:", err);
  res.status(500).json({ errors: ["Internal server error"] });
});

// 🚀 Launch server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
