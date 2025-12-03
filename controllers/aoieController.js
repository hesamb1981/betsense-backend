// controllers/aoieController.js
// AOIE Controller – Betting Shop Engine
// نسخه پایدار برای API (کاملاً سازگار با Predictions, Test, Training)

const baseDemoPayload = {
  ok: true,
  engine: "AOIE",
  version: "1.0.0",
  mode: "test",
  matchId: "M-ARS-TOT-2025-01-05",
  fixture: {
    home: "Arsenal",
    away: "Tottenham",
    competition: "Premier League",
    kickoff: "2025-01-05T16:30:00Z",
  },
  gdi: 71.78, // Global Deviation Index – شاخص اصلی AOIE
  markets: [
    {
      matchId: "M-ARS-TOT-2025-01-05",
      marketId: "MKT-1X2-FT",
      marketCode: "1X2",
      line: "FT",
      aoFlags: ["SAFE_RISK_TIER", "BOOK_EDGE_POSITIVE"],
      aoLimit: "AO_WATCH",
      totalStake: 160000,
      sharpPercent: 100,
      publicPercent: 0,
      marketRiskScore: 51.7,
      liabilityScore: 32.09,
      marketRiskTier: "SAFEST",
      antiOutcomeSignals: [
        {
          selectionCode: "HOME",
          signal: "SHARP_CLUSTER",
          confidence: "HIGH",
        },
        {
          selectionCode: "DRAW",
          signal: "PUBLIC_OVERLOAD",
          confidence: "MEDIUM",
        },
        {
          selectionCode: "AWAY",
          signal: "NOISE",
          confidence: "LOW",
        },
      ],
      selections: [
        {
          selectionCode: "HOME",
          label: "Arsenal FT",
          aoProbability: 0.7755,
          aoStability: 49.95,
          statement: "likely_not_to_happen",
          recommendation: "LIMIT",
          stakeBuckets: {
            sharp: 51.65,
            balanced: 25.15,
            public: 23.2,
          },
        },
        {
          selectionCode: "DRAW",
          label: "Draw FT",
          aoProbability: 0.6755,
          aoStability: 49.95,
          statement: "leans_not_to_happen",
          recommendation: "LIMIT",
          stakeBuckets: {
            sharp: 25.0,
            balanced: 25.0,
            public: 50.0,
          },
        },
        {
          selectionCode: "AWAY",
          label: "Tottenham FT",
          aoProbability: 0.5255,
          aoStability: 49.95,
          statement: "uncertain",
          recommendation: "WATCH",
          stakeBuckets: {
            sharp: 15.0,
            balanced: 35.0,
            public: 50.0,
          },
        },
      ],
    },

    // Market 2: Over/Under 2.5 Goals
    {
      matchId: "M-ARS-TOT-2025-01-05",
      marketId: "MKT-OU-2_5",
      marketCode: "OU",
      line: "2.5",
      aoFlags: ["NEUTRAL_RISK"],
      aoLimit: "AO_LIMIT",
      totalStake: 160000,
      sharpPercent: 100,
      publicPercent: 0,
      marketRiskScore: 49.95,
      liabilityScore: 25.0,
      marketRiskTier: "NEUTRAL",
      selections: [
        {
          selectionCode: "OVER",
          label: "Over 2.5",
          aoProbability: 0.6755,
          aoStability: 49.95,
          statement: "leans_not_to_happen",
          recommendation: "LIMIT",
          stakeBuckets: {
            sharp: 25.15,
            balanced: 25.15,
            public: 49.7,
          },
        },
        {
          selectionCode: "UNDER",
          label: "Under 2.5",
          aoProbability: 0.6755,
          aoStability: 49.95,
          statement: "likely_not_to_happen",
          recommendation: "LIMIT",
          stakeBuckets: {
            sharp: 25.15,
            balanced: 25.15,
            public: 49.7,
          },
        },
      ],
    },
  ],

  meta: {
    shopView: {
      riskTier: "GREEN",
      note: "Edge with Arsenal home clusters. Protect vs late public money.",
    },
    engineNotes: {
      selfHealing: true,
      stiEnabled: true,
      comment:
        "AOIE is configured for continuous learning on each settled fixture (shop-level STI).",
    },
  },
};

// حافظه کوچک سلف-هیلینگ (فقط برای نسخه API)
let inMemoryTrainingCycles = 0;

// ===============================
// (1) /api/aoie/test
// ===============================
export const aoieTest = (req, res) => {
  const response = {
    ...baseDemoPayload,
    mode: "test",
    trainingCycles: inMemoryTrainingCycles,
  };
  return res.json(response);
};

// ===============================
// (2) /api/aoie/predict
// ===============================
export const aoiePredict = (req, res) => {
  const response = {
    ...baseDemoPayload,
    mode: "predict",
    shopAdvice: {
      headline: "Protect vs late Arsenal money; keep draw & away tight.",
      pricingMode: "CONSERVATIVE_EDGE",
    },
    trainingCycles: inMemoryTrainingCycles,
  };
  return res.json(response);
};

// ===============================
// (3) /api/aoie/train
// ===============================
export const aoieTrain = (req, res) => {
  // شبیه‌سازی یادگیری تدریجی
  inMemoryTrainingCycles += 1;

  // افزایش کوچک و کنترل‌شده GDI
  const factor = Math.min(0.05, inMemoryTrainingCycles * 0.005);

  const adjusted = {
    ...baseDemoPayload,
    mode: "train",
    gdi: Number((baseDemoPayload.gdi + factor * 2).toFixed(2)),
    meta: {
      ...baseDemoPayload.meta,
      engineNotes: {
        ...baseDemoPayload.meta.engineNotes,
        lastTrainingAt: new Date().toISOString(),
        totalCycles: inMemoryTrainingCycles,
        comment:
          "Weights nudged slightly toward sharp money preference (STI heuristic).",
      },
    },
  };

  return res.json({
    ok: true,
    engine: "AOIE",
    trainingCycles: inMemoryTrainingCycles,
    snapshot: adjusted,
  });
};
