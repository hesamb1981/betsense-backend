import express from "express";
import nsiController from "../controllers/nsiController.js";

const router = express.Router();

// Health check
router.get("/health", nsiController.health);

// Manual NSI analysis
router.post("/analyze", nsiController.analyze);

// Live NSI analysis
router.post("/live", nsiController.live);

export default router;
