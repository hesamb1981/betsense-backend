// routes/nsiRoutes.js
// Routes for Neuro-Situational Identity Engine (NSI Engine) · v0.1

import express from "express";
import { nsiHealth, nsiAnalyze } from "../controllers/nsiController.js";

const router = express.Router();

// GET /api/nsi/health
router.get("/health", nsiHealth);

// GET /api/nsi/analyze
router.get("/analyze", nsiAnalyze);

export default router;
