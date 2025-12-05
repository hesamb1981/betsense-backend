// routes/super/intelligenceRoutes.js
// Intelligence Core – Super Layer Router

import express from "express";

const router = express.Router();

// ✅ Health check برای Intelligence Core
router.get("/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Intelligence Core v1.0 online",
    timestamp: new Date().toISOString(),
  });
});

// ✅ دموی ساده‌ی POST برای تست
router.post("/intelligence-core/demo", (req, res) => {
  const payload = req.body || {};

  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    received: payload,
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
