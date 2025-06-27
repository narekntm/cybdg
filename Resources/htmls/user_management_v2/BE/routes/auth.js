import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") {
    return res.json({ success: true });
  }
  res.status(401).json({ errors: ["Invalid credentials."] });
});

export default router;
