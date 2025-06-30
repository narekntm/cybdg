import express from "express";
import { resetUsers } from "../services/userService.js";

const router = express.Router();

router.post("/reset", resetUsers);

export default router;
