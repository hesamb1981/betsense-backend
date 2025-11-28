// routes/nsiRoutes.js
// NSI routes – health + demo + analyze

import express from "express";
import {
  nsiHealth,
  nsiDemoAnalyze,
  nsiAnalyze,
} from "../controllers/nsiController.js";

const router = express.Router();

// Health: GET /api/nsi/health
router.get("/health", nsiHealth);

// Demo analyze: GET /api/nsi/demo
router.get("/demo", nsiDemoAnalyze);

// Full analyze: GET /api/nsi/analyze  و  POST /api/nsi/analyze
router.get("/analyze", nsiAnalyze);
router.post("/analyze", nsiAnalyze);

export default router;
