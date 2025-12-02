// routes/dataspineRoutes.js
import express from "express";
import {
  dataspineStatus,
  dataspineAnalyze
} from "../controllers/dataspineController.js";

const router = express.Router();

// Health check
router.get("/status", dataspineStatus);

// Analysis API
router.post("/analyze", dataspineAnalyze);

export default router;
