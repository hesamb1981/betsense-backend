import express from "express";
import GeniusEngine from "./engine/GeniusEngine.js";

const router = express.Router();

// تست روت اصلی API
router.get("/", (req, res) => {
  res.json({
    status: "API root working",
    success: true,
  });
});

// تست سلامت Genius Engine (GET /api/genius)
router.get("/genius", (req, res) => {
  const health = GeniusEngine.health();
  res.json({
    success: true,
    engine: "Genius Engine",
    result: health,
  });
});

// تحلیل اصلی Genius Engine (POST /api/genius/analyze)
router.post("/genius/analyze", (req, res) => {
  try {
    const payload = req.body || {};
    const result = GeniusEngine.analyzeMatch(payload);

    res.json({
      success: true,
      engine: "Genius Engine",
      result,
    });
  } catch (error) {
    console.error("Genius Engine analyze error:", error);

    res.status(400).json({
      success: false,
      engine: "Genius Engine",
      error: error.message || "GENIUS_ANALYZE_ERROR",
    });
  }
});

// روت قدیمی fusion برای آینده – الان فقط تست
router.post("/fusion", (req, res) => {
  res.json({
    success: true,
    message: "Fusion endpoint test OK",
  });
});

export default router;
