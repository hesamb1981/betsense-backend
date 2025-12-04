// routes/ultraRiskRoutes.js
// Ultra Risk Core – demo API routes

import express from "express";

const router = express.Router();

/**
 * Health check برای Ultra Risk Core
 * GET /ultra-risk/ping
 */
router.get("/ping", (req, res) => {
  res.json({
    ok: true,
    engine: "Ultra Risk Core",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Demo run برای Ultra Risk Core
 * POST /ultra-risk/run
 * فعلاً یک خروجی نمادین برمی‌گردانیم؛
 * بعداً به هسته‌ی واقعی سوپر انجین وصلش می‌کنیم.
 */
router.post("/run", (req, res) => {
  const sampleMatch = {
    id: "ULTRA-DEMO-001",
    home: "Ultra Home XI",
    away: "Ultra Away XI",
  };

  res.json({
    ok: true,
    engine: "Ultra Risk Core",
    version: "0.1.0-demo",
    match: sampleMatch,
    riskSummary: {
      highestRisk: 72.4,
      band: "HIGH",
      statusText:
        "Critical – tighten limits immediately and review full exposure on this match.",
    },
    markets: [
      {
        marketCode: "1X2",
        selectionCode: "HOME",
        riskScore: 78.1,
        riskBand: "HIGH",
        recommendedAction: "LIMIT",
      },
      {
        marketCode: "1X2",
        selectionCode: "DRAW",
        riskScore: 55.3,
        riskBand: "MEDIUM",
        recommendedAction: "MONITOR",
      },
      {
        marketCode: "1X2",
        selectionCode: "AWAY",
        riskScore: 34.7,
        riskBand: "MEDIUM",
        recommendedAction: "MONITOR",
      },
    ],
    meta: {
      processedAt: new Date().toISOString(),
      mode: "demo",
    },
  });
});

export default router;
