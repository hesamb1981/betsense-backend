import express from "express";
import GeniusEngine from "../engine/GeniusEngine.js";

const router = express.Router();

// --------- GET: Basic status check ----------
router.get("/", (req, res) => {
  return res.json({
    success: true,
    engine: "Genius Engine",
    status: "Genius Engine active",
  });
});

// --------- POST: Main analysis endpoint ----------
router.post("/analyze", async (req, res) => {
  try {
    const matchData = req.body;

    if (!matchData) {
      return res.status(400).json({
        success: false,
        error: "matchData is required",
      });
    }

    const result = await GeniusEngine(matchData);

    return res.json({
      success: true,
      engine: "Genius Engine",
      result,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Genius Engine internal error",
      message: err.message,
    });
  }
});

export default router;
