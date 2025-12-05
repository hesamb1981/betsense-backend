// routes/super/intelligenceRoutes.js
// Intelligence Core v1.0 – Super Engine Router

import express from "express";

const router = express.Router();

// --- GET Test Route ---
router.get("/", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Intelligence Core v1.0 online",
    timestamp: new Date().toISOString(),
  });
});

// --- POST Demo Route ---
router.post("/demo", (req, res) => {
  const received = req.body || {};

  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    received,
    output: {
      ultraRisk: "ACTIVE",
      ultraMomentum: "BALANCED",
      ultraFusion: "SYNCED",
      masterConfidence: 0.94,
    },
    message: "Intelligence Core demo received",
    timestamp: new Date().toISOString(),
  });
});

export default router;
