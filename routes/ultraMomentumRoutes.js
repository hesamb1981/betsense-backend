// routes/ultraMasterRoutes.js
// ULTRA MASTER CORE – Level 4 Orchestrator
// این هسته، سه Ultra Core را در یک لایه هوشمند ترکیب می‌کند.

import express from "express";

const router = express.Router();

/**
 * ساده‌ترین تست سلامت برای Ultra Master Core
 * URL: GET /ultra/master-core/ping
 */
router.get("/ultra/master-core/ping", (req, res) => {
  res.json({
    ok: true,
    layer: "ULTRA_MASTER_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Ultra Master Core orchestrator is online",
    timestamp: new Date().toISOString(),
  });
});

/**
 * دموی تحلیلی پیشرفته برای Ultra Master Core
 * URL: POST /ultra/master-core/analyse
 *
 * ورودی پیشنهادی (JSON):
 * {
 *   "matchId": "ABC-123",
 *   "preMatch": {
 *     "homeWinOdds": 2.10,
 *     "drawOdds": 3.40,
 *     "awayWinOdds": 3.60
 *   },
 *   "live": {
 *     "minute": 37,
 *     "currentScore": "1-0",
 *     "pressureIndex": 0.74
 *   },
 *   "bookmaker": {
 *     "liabilityHome": 120000,
 *     "liabilityDraw": 80000,
 *     "liabilityAway": 60000
 *   },
 *   "behavioral": {
 *     "crowdSentiment": 0.68,    // 0 تا 1
 *     "sharpMoneyIndex": 0.81,   // 0 تا 1
 *     "retailPanicIndex": 0.29   // 0 تا 1
 *   }
 * }
 */
router.post("/ultra/master-core/analyse", (req, res) => {
  const payload = req.body || {};

  const matchId = payload.matchId || "ULTRA-MASTER-DEMO-001";

  const preMatch = payload.preMatch || {};
  const live = payload.live || {};
  const bookmaker = payload.bookmaker || {};
  const behavioral = payload.behavioral || {};

  // --- 1) محاسبه یک Risk Score ساده ولی نمایشی
  const pressureIndex = live.pressureIndex ?? 0.5;
  const liabilityTotal =
    (bookmaker.liabilityHome || 0) +
    (bookmaker.liabilityDraw || 0) +
    (bookmaker.liabilityAway || 0);

  const sharpMoneyIndex = behavioral.sharpMoneyIndex ?? 0.5;
  const retailPanicIndex = behavioral.retailPanicIndex ?? 0.5;
  const crowdSentiment = behavioral.crowdSentiment ?? 0.5;

  // pseudo-risk score بین 0 تا 1
  const riskScore = Math.min(
    1,
    Math.max(
      0,
      0.35 * pressureIndex +
        0.25 * (liabilityTotal > 0 ? 0.7 : 0.3) +
        0.25 * sharpMoneyIndex +
        0.15 * retailPanicIndex
    )
  );

  // --- 2) محاسبه Momentum Score نمایشی
  const minute = live.minute || 0;
  const lateGameBoost = minute >= 75 ? 0.15 : minute >= 60 ? 0.08 : 0;
  const momentumBase = 0.4 * pressureIndex + 0.3 * crowdSentiment + 0.3 * sharpMoneyIndex;
  const momentumScore = Math.min(1, momentumBase + lateGameBoost);

  // --- 3) Fusion / Composite Score
  const fusionScore = Math.min(
    1,
    0.45 * riskScore + 0.40 * momentumScore + 0.15 * (1 - retailPanicIndex)
  );

  // --- 4) طبقه‌بندی سطح ریسک کلی
  let globalRiskBand = "MEDIUM";
  if (fusionScore >= 0.8) globalRiskBand = "AGGRESSIVE_EDGE";
  else if (fusionScore >= 0.65) globalRiskBand = "CONTROLLED_EDGE";
  else if (fusionScore <= 0.35) globalRiskBand = "DEFENSIVE";
  else globalRiskBand = "NEUTRAL";

  // --- 5) ساخت پاسخ نهایی Ultra Master Core
  res.json({
    ok: true,
    layer: "ULTRA_MASTER_CORE",
    matchId,

    // خلاصه‌ی مدیریتی برای لایه ۴
    summary: {
      globalRiskBand,
      fusionScore: Number(fusionScore.toFixed(3)),
      riskScore: Number(riskScore.toFixed(3)),
      momentumScore: Number(momentumScore.toFixed(3)),
      comment:
        "Ultra Master Core – composite signal built from risk, momentum, and behavioral inputs.",
    },

    // لایه‌های زیرین – شمایی از سه Ultra Core
    layers: {
      ultraRiskCore: {
        label: "ULTRA_RISK_CORE",
        riskScore: Number(riskScore.toFixed(3)),
        notes: [
          "Integrated bookmaker liability & in-play pressure.",
          "Designed for shop-level exposure and red-flag games.",
        ],
      },
      ultraMomentumCore: {
        label: "ULTRA_MOMENTUM_CORE",
        momentumScore: Number(momentumScore.toFixed(3)),
        notes: [
          "Real-time momentum + time-decay logic.",
          "Late-game boosts around 60-75+ minutes.",
        ],
      },
      ultraFusionCore: {
        label: "ULTRA_FUSION_CORE",
        fusionScore: Number(fusionScore.toFixed(3)),
        notes: [
          "Blends risk & momentum with behavioral overlays.",
          "Built as the primary enterprise-grade composite edge.",
        ],
      },
    },

    meta: {
      receivedPayloadPreview: payload,
      liabilityTotal,
      computedAt: new Date().toISOString(),
      version: "ULTRA_MASTER_CORE_DEMO_V1",
    },
  });
});

export default router;
