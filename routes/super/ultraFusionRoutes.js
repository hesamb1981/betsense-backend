// routes/super/ultraFusionRoutes.js
// Ultra Fusion Core – Super Engine Router

import express from "express";

const router = express.Router();

// ساده‌ترین تست سلامت برای Ultra Fusion Core
router.get("/ping", (req, res) => {
  res.json({
    ok: true,
    engine: "ULTRA_FUSION_CORE",
    message: "Ultra Fusion Core route is online",
    timestamp: new Date().toISOString(),
  });
});

// دموی اولیه برای تست ارتباط
router.post("/demo", (req, res) => {
  const input = req.body || {};

  const matchId = input.matchId || "ULTRA-FUSION-DEMO-001";

  res.json({
    ok: true,
    engine: "ULTRA_FUSION_CORE",
    matchId,
    fusionSignal: {
      globalRiskBand: "MEDIUM",
      momentumState: "BALANCED",
      confidence: 0.82,
    },
    meta: {
      note: "Fusion demo response – wiring is correct.",
      receivedPayloadPreview: input,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
