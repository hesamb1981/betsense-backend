import express from "express";
import GeniusEngine from "../engine/GeniusEngine.js";

const router = express.Router();

// Genius Engine main endpoint
router.post("/genius", (req, res) => {
  try {
    const result = GeniusEngine.run(req.body || {});

    res.json({
      success: true,
      engine: "Genius Engine",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      engine: "Genius Engine",
      error: error.message,
    });
  }
});

export default router;
