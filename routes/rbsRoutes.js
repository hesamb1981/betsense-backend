// engine/routes/rbsRoutes.js
import express from "express";

const router = express.Router();

// GET  /api/rbs/health
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    engine: "RBS",
    message: "RBS engine health OK",
  });
});

// GET  /api/rbs/demo
router.get("/demo", (req, res) => {
  res.json({
    ok: true,
    engine: "RBS",
    mode: "demo",
    summary: "RBS demo analysis (GET).",
    metrics: {
      switchRisk: 21,
      panicFlip: 37,
      comebackChance: 62,
    },
  });
});

// POST /api/rbs/demo
router.post("/demo", (req, res) => {
  const payload = req.body || {};

  res.json({
    ok: true,
    engine: "RBS",
    mode: "demo",
    summary: "RBS demo analysis (POST).",
    received: payload,
    metrics: {
      switchRisk: 24,
      panicFlip: 33,
      comebackChance: 58,
    },
  });
});

export default router;
