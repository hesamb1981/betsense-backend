import express from "express";
import GeniusEngine from "../engine/GeniusEngine.js";

const router = express.Router();

/**
 * Test endpoint
 */
router.get("/genius", (req, res) => {
  const result = {
    message: "Genius Engine operational",
    confidence: 0.99,
    version: "1.0.0",
  };

  res.json({
    success: true,
    engine: "Genius Engine",
    result,
  });
});

/**
 * Main Genius Engine analysis endpoint
 */
router.post("/genius/analyze", async (req, res) => {
  try {
    const input = req.body;

    const output = GeniusEngine.analyze(input);

    res.json({
      success: true,
      engine: "Genius Engine",
      result: output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Genius Engine error",
      details: error.message,
    });
  }
});

export default router;
