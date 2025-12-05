/**
 * Meta-Behavior Engine v1.0
 * BetSense Intelligence Layer
 * ---------------------------------------------------------
 * این لایه سه کور اصلی (Risk / Momentum / Fusion) را ترکیب می‌کند
 * و یک وضعیت رفتاری متحد (Meta-Behavior State) تولید می‌کند.
 */

import express from "express";

const router = express.Router();

// -------------------------------
// حالت‌های اختصاصی Meta-Behavior (IP-Unique)
// -------------------------------
const META_BEHAVIOR_STATES = {
  STABLE_TREND: "STABLE_TREND",
  AGGRESSIVE_SHIFT: "AGGRESSIVE_SHIFT",
  HIDDEN_PRESSURE: "HIDDEN_PRESSURE",
  CHAOTIC_FLOW: "CHAOTIC_FLOW",
  REVERSAL_WINDOW: "REVERSAL_WINDOW",
};

// -------------------------------
// الگوریتم دمو (نسخه v1.0 – Ultra Unique)
// -------------------------------
function computeMetaBehavior(risk, momentum, fusion) {
  let state = META_BEHAVIOR_STATES.STABLE_TREND;
  let score = 0.5;
  let explanation = [];

  // --- Rule 1: اگر ریسک فعال باشد و مومنتوم فید شود → فشار مخفی
  if (risk === "ACTIVE" && momentum === "BALANCED") {
    state = META_BEHAVIOR_STATES.HIDDEN_PRESSURE;
    score = 0.72;
    explanation.push("RISK_ACTIVE_WITH_MOMENTUM_NEUTRAL");
  }

  // --- Rule 2: اگر مومنتوم خیلی قوی و فیوژن سینک باشد → شیفت تهاجمی
  if (momentum === "STRONG" && fusion === "SYNCED") {
    state = META_BEHAVIOR_STATES.AGGRESSIVE_SHIFT;
    score = 0.83;
    explanation.push("MOMENTUM_STRONG_AND_FUSION_ALIGNED");
  }

  // --- Rule 3: اگر فلوها ناسازگار باشند → رفتار آشوبی
  if (fusion === "DESYNC") {
    state = META_BEHAVIOR_STATES.CHAOTIC_FLOW;
    score = 0.41;
    explanation.push("FUSION_DESYNCHRONIZED");
  }

  // --- Rule 4: اگر هر سه سیگنال اسپایک کنند → پنجره بازگشت
  if (risk === "SPIKE" && momentum === "FADING" && fusion === "PULSE") {
    state = META_BEHAVIOR_STATES.REVERSAL_WINDOW;
    score = 0.91;
    explanation.push("TRIPLE_SIGNAL_REVERSAL_PATTERN");
  }

  return { state, score, explanation };
}

// -------------------------------
// 🔹 Health Check
// -------------------------------
router.get("/meta/behavior-core", (req, res) => {
  res.json({
    ok: true,
    layer: "META_BEHAVIOR_ENGINE",
    version: "1.0",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Meta-Behavior Engine v1.0 online",
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------
// 🔹 Demo POST endpoint
// -------------------------------
router.post("/meta/behavior-core/demo", (req, res) => {
  const input = req.body || {};

  const risk = input.riskSignal || "ACTIVE";
  const momentum = input.momentumSignal || "BALANCED";
  const fusion = input.fusionSignal || "SYNCED";

  const result = computeMetaBehavior(risk, momentum, fusion);

  res.json({
    ok: true,
    layer: "META_BEHAVIOR_ENGINE",
    received: input,
    metaState: result.state,
    metaScore: result.score,
    explanationTags: result.explanation,
    timestamp: new Date().toISOString(),
  });
});

export default router;
