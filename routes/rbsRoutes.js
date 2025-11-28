// routes/rbsRoutes.js
// RBS Engine routes – health + timeline analyze

import express from "express";
import { rbsHealth, rbsAnalyzeTimeline } from "../controllers/rbsController.js";

const router = express.Router();

// Health check for RBS Engine
router.get("/health", rbsHealth);

// Analyze a full timeline of signals (behavioral switching)
router.post("/analyze", rbsAnalyzeTimeline);

// Alias route – اگر خواستی جداگانه به اسم timeline هم صدا بزنی
router.post("/timeline", rbsAnalyzeTimeline);

export default router;
