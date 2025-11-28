// engine/routes/rbsRoutes.js
// Routes for RBS Engine (Real Behavioral Switching)

import express from "express";
import { rbsHealth, rbsDemoAnalyze } from "../controllers/rbsController.js";

const router = express.Router();

// Health check
router.get("/health", rbsHealth);

// Demo / analysis endpoint (GET + POST برای راحتی تست)
router.get("/demo", rbsDemoAnalyze);
router.post("/demo", rbsDemoAnalyze);

export default router;
