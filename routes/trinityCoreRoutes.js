// routes/trinityCoreRoutes.js
// TRINITY CORE v1.0 – BetSense Quantum Trinity Protocol

import express from "express";

const router = express.Router();

// Health check اصلی ترینی‌تی کور
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    layer: "TRINITY_CORE",
    message: "Trinity Core v1.0 online ✅",
    components: [
      "ULTRA_RISK_CORE",
      "ULTRA_MOMENTUM_CORE",
      "ULTRA_FUSION_CORE"
    ],
    timestamp: new Date().toISOString()
  });
});

// یک اسنپ‌شات ساده‌ی وضعیت ترینی‌تی
router.get("/snapshot", (req, res) => {
  res.json({
    ok: true,
    layer: "TRINITY_CORE",
    mode: "SIMULATION",
    risk_index: 0.72,
    momentum_pulse: 0.81,
    fusion_confidence: 0.88,
    message: "Trinity snapshot demo (static values for now)",
    timestamp: new Date().toISOString()
  });
});

export default router;
