// engines/trinityCoreEngine.js
// Trinity Self-Evolving Core v1.0 (Ultra Enterprise Ready)
// این ماژول مغز اصلی Trinity را می‌سازد:
// 1) Self-Correction
// 2) Self-Context Awareness
// 3) Self-Weight Adjustment
// + Cross-Engine Reinforcement (با استفاده از خروجی Ultra Risk / Momentum / Fusion)

// --- وضعیت داخلی (حافظه سبک داخل سرور) -----------------

// وزن‌های داخلی بین ریسک / مومنتوم / فیوژن
let internalWeights = {
  risk: 0.34,
  momentum: 0.33,
  fusion: 0.33,
};

// چند آمار ساده برای یادگیری
let internalStats = {
  calls: 0,
  avgError: 0, // اگر بعداً real outcome بدهیم، این می‌تواند واقعی شود
};

// --- توابع کمکی عمومی -----------------------------------

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function safeNumber(value, fallback = 0.5) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return value;
}

// --- 1) پایه‌ی سیگنال Trinity از سه Engine اصلی ----------

function baseSignalFusion({ ultraRisk, ultraMomentum, ultraFusion }) {
  const riskScore = safeNumber(ultraRisk?.risk_index ?? ultraRisk, 0.5);
  const momentumScore = safeNumber(
    ultraMomentum?.momentum_pulse ?? ultraMomentum,
    0.5
  );
  const fusionScore = safeNumber(
    ultraFusion?.fusion_confidence ?? ultraFusion,
    0.5
  );

  // وزن‌ها از internalWeights می‌آیند (بعداً توسط Self-Weight Adjustment تغییر می‌کنند)
  const weightedRisk = riskScore * internalWeights.risk;
  const weightedMomentum = momentumScore * internalWeights.momentum;
  const weightedFusion = fusionScore * internalWeights.fusion;

  const fusionStrength = clamp(weightedRisk + weightedMomentum + weightedFusion);

  const stabilityIndex = clamp(
    1 -
      Math.abs(weightedRisk - weightedMomentum) * 0.6 -
      Math.abs(weightedFusion - weightedMomentum) * 0.4
  );

  const entropyBalance = clamp(
    1 -
      (Math.abs(riskScore - 0.5) +
        Math.abs(momentumScore - 0.5) +
        Math.abs(fusionScore - 0.5)) /
        3
  );

  return {
    risk_index: clamp(riskScore),
    momentum_pulse: clamp(momentumScore),
    fusion_confidence: clamp(fusionScore),
    fusion_strength: fusionStrength,
    stability_index: stabilityIndex,
    entropy_balance: entropyBalance,
  };
}

// --- 2) Self-Correction Layer ----------------------------
// خروجی پایه را بر اساس خطاهای گذشته اصلاح می‌کند.
// فعلاً اگر history خالی باشد، فقط یک محافظ ملایم روی confidence می‌گذارد.

function selfCorrectionLayer({ baseSnapshot, history = [] }) {
  let lastError = 0;

  if (Array.isArray(history) && history.length > 0) {
    const last = history[history.length - 1];
    if (typeof last.error === "number") {
      lastError = clamp(Math.abs(last.error), 0, 1);
    }
  }

  // اگر خطا زیاد بوده → اعتماد به fusion پایین‌تر
  const penalty = lastError * 0.25; // حداکثر 0.25 کم می‌کند
  const correctedFusionConfidence = clamp(
    baseSnapshot.fusion_confidence - penalty
  );

  return {
    ...baseSnapshot,
    fusion_confidence: correctedFusionConfidence,
  };
}

// --- 3) Self-Context Awareness Layer ---------------------
// context می‌تواند شامل:
// - matchPressure / marketPressure (0..1)
// - dataQuality (0..1)
// - volatility (0..1)

function selfContextAwarenessLayer({ snapshot, context = {} }) {
  const matchPressure = safeNumber(context.matchPressure, 0.5);
  const dataQuality = safeNumber(context.dataQuality, 0.7);
  const volatility = safeNumber(context.volatility, 0.5);

  // اگر فشار بالاست → ریسک بالاتر، استیبیلیتی کمتر
  const pressureBoost = (matchPressure - 0.5) * 0.4;
  const volatilityPenalty = (volatility - 0.5) * 0.3;

  const adjustedRisk = clamp(
    snapshot.risk_index + pressureBoost + volatilityPenalty
  );
  const adjustedStability = clamp(
    snapshot.stability_index * dataQuality - Math.abs(pressureBoost) * 0.2
  );

  return {
    ...snapshot,
    risk_index: adjustedRisk,
    stability_index: adjustedStability,
    context: {
      matchPressure,
      dataQuality,
      volatility,
    },
  };
}

// --- 4) Self-Weight Adjustment Layer ---------------------
// وزن internalWeights را بر اساس کیفیت عملکرد گذشته اصلاح می‌کند.
// در این نسخه اگر history.successRate بالا باشد → وزن فیوژن بیشتر می‌شود.

function selfWeightAdjustmentLayer({ snapshot, history = [] }) {
  let successRate = 0.5; // اگر دیتای واقعی نداریم، نرمال

  if (Array.isArray(history) && history.length > 0) {
    const successes = history.filter((h) => h.outcome === "success").length;
    const failures = history.filter((h) => h.outcome === "failure").length;
    const total = successes + failures;
    if (total > 0) successRate = successes / total;
  }

  const learningRate = 0.08; // محافظه‌کار برای محیط Enterprise

  // هدف: اگر خوب عمل کرده → بیشتر به fusion اعتماد کنیم
  const targetFusionWeight = clamp(0.3 + successRate * 0.4, 0.3, 0.7);
  const targetRiskWeight = clamp(
    0.3 - (successRate - 0.5) * 0.2,
    0.2,
    0.5
  );
  const targetMomentumWeight = clamp(
    1 - targetFusionWeight - targetRiskWeight,
    0.1,
    0.5
  );

  internalWeights.fusion =
    internalWeights.fusion +
    (targetFusionWeight - internalWeights.fusion) * learningRate;
  internalWeights.risk =
    internalWeights.risk +
    (targetRiskWeight - internalWeights.risk) * learningRate;
  internalWeights.momentum =
    internalWeights.momentum +
    (targetMomentumWeight - internalWeights.momentum) * learningRate;

  const normalizer =
    internalWeights.fusion + internalWeights.risk + internalWeights.momentum || 1;
  internalWeights.fusion /= normalizer;
  internalWeights.risk /= normalizer;
  internalWeights.momentum /= normalizer;

  return {
    ...snapshot,
    weights: { ...internalWeights },
  };
}

// --- 5) Cross-Engine Reinforcement Layer -----------------
// نتایج Ultra Risk / Ultra Momentum / Ultra Fusion را با Trinity ترکیب می‌کند
// تا هشدارها و سیگنال تقویتی ایجاد شود.

function crossEngineReinforcementLayer({
  trinity,
  ultraRisk,
  ultraMomentum,
  ultraFusion,
}) {
  const alerts = [];

  const riskScore = safeNumber(
    ultraRisk?.risk_index ?? ultraRisk,
    trinity.risk_index
  );
  const momentumScore = safeNumber(
    ultraMomentum?.momentum_pulse ?? ultraMomentum,
    trinity.momentum_pulse
  );
  const fusionScore = safeNumber(
    ultraFusion?.fusion_confidence ?? ultraFusion,
    trinity.fusion_confidence
  );

  const disagreement =
    (Math.abs(trinity.risk_index - riskScore) +
      Math.abs(trinity.momentum_pulse - momentumScore) +
      Math.abs(trinity.fusion_confidence - fusionScore)) /
    3;

  if (disagreement > 0.3) {
    alerts.push("ENGINE_DISAGREEMENT_HIGH");
  }

  if (trinity.risk_index > 0.75 && momentumScore > 0.7) {
    alerts.push("HIGH_RISK_HIGH_MOMENTUM");
  }

  if (trinity.stability_index < 0.4 && fusionScore < 0.5) {
    alerts.push("LOW_STABILITY_LOW_CONFIDENCE");
  }

  const reinforcementSignal = clamp(1 - disagreement);

  return {
    reinforcementSignal,
    alerts,
  };
}

// --- 6) API اصلی که Route ها صدا می‌زنند ------------------

// input می‌تواند شامل:
// {
//   context: { matchPressure, dataQuality, volatility },
//   history: [{ error, outcome: "success" | "failure" }],
//   ultraRisk,
//   ultraMomentum,
//   ultraFusion
// }

export function computeTrinitySnapshot(input = {}) {
  const {
    context = {},
    history = [],
    ultraRisk = null,
    ultraMomentum = null,
    ultraFusion = null,
  } = input;

  internalStats.calls += 1;

  const base = baseSignalFusion({ ultraRisk, ultraMomentum, ultraFusion });
  const corrected = selfCorrectionLayer({ baseSnapshot: base, history });
  const aware = selfContextAwarenessLayer({ snapshot: corrected, context });
  const weighted = selfWeightAdjustmentLayer({ snapshot: aware, history });
  const cross = crossEngineReinforcementLayer({
    trinity: weighted,
    ultraRisk,
    ultraMomentum,
    ultraFusion,
  });

  return {
    ok: true,
    engine: "TRINITY_CORE",
    mode: "SIMULATION",
    ...weighted,
    reinforcement_signal: cross.reinforcementSignal,
    alerts: cross.alerts,
    stats: {
      calls: internalStats.calls,
      avgError: internalStats.avgError,
    },
    message: "Trinity Self-Evolving Core v1.0 snapshot",
    timestamp: new Date().toISOString(),
  };
}
