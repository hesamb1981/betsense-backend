// routes/geniusRoutes.js

import express from "express";
import GeniusEngine from "../engine/GeniusEngine.js";

const router = express.Router();

// --- Genius Engine Test Endpoint ---
router.get("/", (req, res) => {
  try {
    const result = GeniusEngine.runTest();

    res.json({
      success: true,
      engine: "Genius Engine",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// --- Genius Engine Full Analysis Endpoint ---
router.post("/analyze", (req, res) => {
  try {
    const matchData = req.body;

    const result = GeniusEngine.fullAnalysis(matchData);

    res.json({
      success: true,
      engine: "Genius Engine",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
qq
export default router;
