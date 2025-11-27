// routes/geniusRoutes.js
// Routes for Genius Engine API.

import express from "express";
import {
  geniusHealth,
  geniusAnalyze,
} from "../controllers/geniusController.js";

const router = express.Router();

// GET /api/genius/health
router.get("/health", geniusHealth);

// GET /api/genius/analyze
router.get("/analyze", geniusAnalyze);

export default router;
