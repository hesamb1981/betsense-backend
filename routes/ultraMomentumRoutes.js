// routes/ultraMasterRoutes.js
// ULTRA MASTER CORE – orchestrator for Ultra Risk / Momentum / Fusion

import express from "express";

const router = express.Router();

/**
 * ساده‌ترین تست سلامت برای Ultra Master Core
 * GET  /ultra/master-core/ping
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
 * دمو‌ی اصلی Enterprise برای سه موتور:
 * POST /ultra/master-core/analyse
 *
 * ورودی نمونه (نیازی به حفظ کردن نیست – فقط برای تست):
 * {
 *   "matchId": "LIVE-DEMO-ULTRA-001",
 *   "preMatch": { "homeWinOdds": 2.05, "drawOdds": 3.30, "awayWinOdds": 3.90 },
 *   "live": { "minute": 67, "currentScore": "1-1", "pressureIndex": 0.77 },
 *   "bookmaker": {
 *     "liabilityHome": 185000,
 *     "liabilityDraw": 92000,
 *     "liabilityAway": 74000
 *   },
 *   "behavioral": {
 *     "crowdSentiment": 0.73,
 *     "sharpMoneyIndex": 0.84,
 *     "retailPanicIndex": 0.21
 *   }
 * }
 */
router.post("/ultra/master-core/analyse", (req, res) => {
  const body = req.body || {};

  const matchId = body.matchId || "ULTRA-MASTER-DEMO-001";

  const preMatch = body.preMatch || {};
  const live = body.live || {};
  const bookmaker = body.bookmaker || {};
  const behavioral = body.behavioral || {};

  // ---------- ۱) RISK LAYER (Ultra Risk Core) ----------
  const liabilityHome = Number(bookmaker.liabilityHome || 0);
  const liabilityDraw = Number(bookmaker.liabilityDraw || 0);
  const liabilityAway = Number(bookmaker.liabilityAway || 0);
  const totalLiability = liabilityHome + liabilityDraw + liabilityAway;

  // نرمال‌سازی تقریبی روی سقف ۳۰۰k
  const liabilityPressure = Math.min(totalLiability / 300000, 1);

  const rawPressureIndex = Number(live.pressureIndex ?? 0.5);
  const inPlayPressure = Math.max(0, Math.min(rawPressureIndex, 1));

  const ultraRiskScore = Number(
    (0.55 * liabilityPressure + 0.45 * inPlayPressure).toFixed(3)
  );

  let ultraRiskBand = "LOW";
  if (ultraRiskScore >= 0.75) ultraRiskBand = "CRITICAL";
  else if (ultraRiskScore >= 0.55) ultraRiskBand = "HIGH";
  else if (ultraRiskScore >= 0.35) ultraRiskBand = "MEDIUM";

  // ---------- ۲) MOMENTUM LAYER (Ultra Momentum Core) ----------
  const minute = Number(live.minute || 0);
  const currentScore = String(live.currentScore || "0-0");
  const crowdSentiment = Number(behavioral.crowdSentiment ?? 0.5);

  const isLateGame = minute >= 75;
  const isTightScore = /\b0-0\b|\b1-0\b|\b0-1\b|\b1-1\b/.test(currentScore);

  let lateGameBoost = 0;
  if (isLateGame && isTightScore) lateGameBoost = 0.18;
  else if (isLateGame) lateGameBoost = 0.1;

  const baseMomentumScore = Math.max(
    0,
    Math.min(crowdSentiment + lateGameBoost, 1)
  );

  const ultraMomentumScore = Number(baseMomentumScore.toFixed(3));

  let momentumState = "BALANCED";
  if (ultraMomentumScore >= 0.8) momentumState = "SURGE";
  else if (ultraMomentumScore >= 0.6) momentumState = "STRONG";
  else if (ultraMomentumScore <= 0.3) momentumState = "FLAT";

  // ---------- ۳) FUSION LAYER (Ultra Fusion Core) ----------
  const sharpMoneyIndex = Number(behavioral.sharpMoneyIndex ?? 0.5);
  const retailPanicIndex = Number(behavioral.retailPanicIndex ?? 0.5);

  const fusionScoreRaw =
    0.5 * sharpMoneyIndex +
    0.3 * ultraMomentumScore +
    0.2 * (1 - retailPanicIndex);

  const ultraFusionScore = Number(Math.max(0, Math.min(fusionScoreRaw, 1)).toFixed(3));

  let fusionSignal = "NEUTRAL_EDGE";
  if (ultraFusionScore >= 0.82) fusionSignal = "AGGRESSIVE_EDGE";
  else if (ultraFusionScore >= 0.65) fusionSignal = "POSITIVE_EDGE";
  else if (ultraFusionScore <= 0.35) fusionSignal = "NO_EDGE";

  // ---------- ۴) MASTER BLEND ----------
  const masterCompositeScore = Number(
    (
      0.45 * ultraFusionScore +
      0.35 * ultraMomentumScore +
      0.20 * (1 - ultraRiskScore)
    ).toFixed(3)
  );

  let masterLabel = "CONTROLLED";
  if (masterCompositeScore >= 0.8) masterLabel = "ULTRA_EDGE";
  else if (masterCompositeScore >= 0.6) masterLabel = "FAVOURABLE";
  else if (masterCompositeScore <= 0.35) masterLabel = "DISENGAGE";

  // ---------- RESPONSE ----------
  res.json({
    ok: true,
    layer: "ULTRA_MASTER_CORE",
    matchId,
    engines: {
      risk: "ULTRA_RISK_CORE",
      momentum: "ULTRA_MOMENTUM_CORE",
      fusion: "ULTRA_FUSION_CORE",
    },
    riskLayer: {
      band: ultraRiskBand,
      score: ultraRiskScore,
      totalLiability,
      liabilityHome,
      liabilityDraw,
      liabilityAway,
      inPlayPressure,
    },
    momentumLayer: {
      score: ultraMomentumScore,
      state: momentumState,
      minute,
      currentScore,
      isLateGame,
      isTightScore,
      crowdSentiment,
    },
    fusionLayer: {
      score: ultraFusionScore,
      signal: fusionSignal,
      sharpMoneyIndex,
      retailPanicIndex,
    },
    masterComposite: {
      score: masterCompositeScore,
      label: masterLabel,
    },
    meta: {
      note: "Ultra Master Core composite demo – wiring of Risk / Momentum / Fusion layers is correct.",
      receivedPayloadPreview: body,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
