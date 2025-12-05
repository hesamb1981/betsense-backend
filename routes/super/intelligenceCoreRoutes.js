// routes/super/intelligenceRoutes.js
// BetSense Intelligence Layer v1.0
// This engine merges outputs of Ultra Risk, Ultra Momentum, and Ultra Fusion into a unified intelligence response.

import express from "express";

const router = express.Router();

// -------------------------------
// Health Check
// -------------------------------
router.get("/super/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Intelligence Core v1.0 online",
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------
// Intelligence Fusion Processor
// -------------------------------
router.post("/super/intelligence-core/process", (req, res) => {
  const input = req.body || {};

  // Fallback demo signals (later replaced with real engine outputs)
  const ultraRisk = input.ultraRisk || { state: "ACTIVE", score: 0.91 };
  const ultraMomentum = input.ultraMomentum || { trend: "BALANCED", velocity: 0.72 };
  const ultraFusion = input.ultraFusion || { sync: "STABLE", correlation: 0.88 };

  // Weighting logic v1.0
  const weightedScore =
    (ultraRisk.score * 0.45) +
    (ultraMomentum.velocity * 0.30) +
    (ultraFusion.correlation * 0.25);

  const classification =
    weightedScore > 0.85 ? "HIGH_SIGNAL"
    : weightedScore > 0.65 ? "MEDIUM_SIGNAL"
    : "LOW_SIGNAL";

  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    received: input,
    fusedOutput: {
      weightedScore: Number(weightedScore.toFixed(3)),
      classification,
      components: {
        ultraRisk,
        ultraMomentum,
        ultraFusion,
      },
    },
    message: "Intelligence Layer fusion processed successfully",
    timestamp: new Date().toISOString(),
  });
});

export default router;
