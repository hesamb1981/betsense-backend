// routes/nsiRoutes.js

import express from "express";
import {
  getBasicHealth,
  getDeepHealth,
  getSampleSnapshot,
  getSignatureExample,
  analyzeNSI,
} from "../controllers/nsiController.js";

const router = express.Router();

// Health + diagnostics
router.get("/health-basic", getBasicHealth);
router.get("/health-deep", getDeepHealth);
router.get("/sample", getSampleSnapshot);
router.get("/signature-example", getSignatureExample);

// Main analysis endpoint used by the NSI UI
router.post("/analyze", analyzeNSI);

export default router;
