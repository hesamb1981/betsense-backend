// routes/nsiRoutes.js
// NSI Engine routes – health, manual analyze, live analyze

import express from "express";
import { nsiHealth, nsiAnalyze, nsiLive } from "../controllers/nsiController.js";

const router = express.Router();

// Health
router.get("/health", nsiHealth);

// Manual analyze (UI و تست‌های دستی)
router.get("/analyze", nsiAnalyze);
router.post("/analyze", nsiAnalyze);

// Live analyze – برای اتصال به استک‌های زنده (نسخه demo)
router.get("/live", nsiLive);
router.post("/live", nsiLive);

export default router;
