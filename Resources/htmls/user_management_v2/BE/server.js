// server.js
import express from "express";
import cors from "cors";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import resetRoutes from "./routes/reset.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080"
  ]
}));

app.use(express.json());

// 🔗 Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", resetRoutes);

// 🗂️ Serve static UI
app.use(express.static("Resources/htmls/user_management_v2/FE"));

// 🛑 Global error handler
app.use(errorHandler);

// 🚀 Launch server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
