// routes/nsiRoutes.js
// NSI Engine routes – supports GET + POST

import express from "express";
import { nsiHealth, nsiAnalyze } from "../controllers/nsiController.js";

const router = express.Router();

// Health check
router.get("/health", nsiHealth);

// Analyze endpoints
router.get("/analyze", nsiAnalyze);   // for manual URL tests
router.post("/analyze", nsiAnalyze);  // for NSI UI JSON

export default router;
