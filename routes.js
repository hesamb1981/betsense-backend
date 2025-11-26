import express from "express";
import GeniusEngine from "./engine/GeniusEngine.js";

const router = express.Router();

// Root test
router.get("/", (req, res) => {
  res.json({
    status: "API root working",
    success: true
  });
});

// GENIUS ENGINE – GET test
router.get("/genius", (req, res) => {
  const result = GeniusEngine.sampleAnalysis();
  res.json({
    success: true,
    engine: "Genius Engine",
    result
  });
});

// GENIUS ENGINE – POST full analysis
router.post("/genius", async (req, res) => {
  try {
    const matchData = req.body;
    const result = await GeniusEngine.fullAnalysis(matchData);

    res.json({
      success: true,
      engine: "Genius Engine",
      result
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message
    });
  }
});

export default router;
