import express from "express";
const router = express.Router();

// ---------------------------------------------
// GET  →  Check Intelligence Core status
// ---------------------------------------------
router.get("/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Intelligence Core online",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------
// POST  →  Intelligence Core Processor (Demo)
// ---------------------------------------------
router.post("/intelligence-core", (req, res) => {
  const input = req.body || {};

  const output = {
    ultraRisk: "ACTIVE",
    ultraMomentum: "BALANCED",
    ultraFusion: "SYNCED",
    intelligenceScore: 0.92,
  };

  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    received: input,
    output,
    message: "Intelligence Core POST received",
    timestamp: new Date().toISOString(),
  });
});

export default router;
