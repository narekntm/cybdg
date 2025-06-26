// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// enable CORS for all origins
// 1) Enable CORS for your UI origin (or "*" for all)
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:8080"]
}));

app.use(bodyParser.json());

const INITIAL_USERS = [
  { id: 1, name: "Alice", role: "Admin", age: 30, email: "alice@site.com", gender: "Female", subscriptions: "Newsletter", status: "Active" },
  { id: 2, name: "Bob", role: "Viewer", age: 25, email: "bob@site.com", gender: "Male", subscriptions: "Product Updates", status: "Inactive" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
];

let users = INITIAL_USERS.map(u => ({ ...u }))

// Admin login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") return res.json({ success: true });
  return res.status(401).json({ success: false });
});

// List users
app.get("/api/users", (req, res) => res.json(users));

// Add user
app.post("/api/users", (req, res) => {
  const { name, role, age, email, gender, subscriptions } = req.body;
  if (!name || !role || !age || !email || !gender) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const id = users.length ? users[users.length-1].id+1 : 1;
  const newUser = { id, ...req.body, status: "Active" };
  users.push(newUser);
  res.json(newUser);
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const idx = users.findIndex((u) => u.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
});

// Delete user
app.delete("/api/users/:id", (req, res) => {
  const { isAdmin } = req.body;
  const idx = users.findIndex((u) => u.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (!isAdmin && users[idx].role === "Admin") {
    return res.status(403).json({ error: "Admin login required" });
  }
  users.splice(idx, 1);
  res.json({ success: true });
});

// Toggle status
app.patch("/api/users/:id/status", (req, res) => {
  const { status } = req.body;
  const user = users.find((u) => u.id === +req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  user.status = status;
  res.json(user);
});

// Reset in-memory data back to initial state
app.post("/api/reset", (req, res) => {
  users = INITIAL_USERS.map(u => ({ ...u }))
  return res.json({ success: true, users });
});

app.use(express.static("Resources/htmls/user_management_v2"));
app.listen(3000, () => console.log("Server running on http://localhost:3000 or http://127.0.0.1:3000"));
