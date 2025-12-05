import express from "express";

const router = express.Router();

// In-memory adaptive state for Trinity Core
const trinityMemory = {
  calls: 0,
  totalError: 0,
  lastSnapshot: null,
  lastUpdate: null,
  weightHistory: [],
};

function buildSnapshot(mode = "SIMULATION", errorValue) {
  const now = new Date().toISOString();

  // Base metrics (demo values for now)
  let riskIndex = 0.72;
  let momentumPulse = 0.79;
  let fusionConfidence = 0.84;
  let fusionStrength = 0.73;
  let stabilityIndex = 0.795;
  let entropyBalance = 0.72;

  // Base weights before self-correction
  let weights = {
    risk: 0.33,
    momentum: 0.32,
    fusion: 0.34,
    reinforcement_signal: 0.99,
  };

  let numericError = null;

  // ---- Self-Correction Layer (for SIMULATION + LIVE) ----
  if (typeof errorValue === "number" && !Number.isNaN(errorValue)) {
    // Clamp error between 0 and 1
    numericError = Math.min(1, Math.max(0, errorValue));

    trinityMemory.calls += 1;
    trinityMemory.totalError += numericError;
    trinityMemory.lastUpdate = now;

    const avgError = trinityMemory.totalError / trinityMemory.calls;

    // Simple self-evolving rule:
    // اگر خطا زیاد باشد → وزن ریسک بالاتر و مومنتوم/فیوزن محافظه‌کارتر می‌شوند.
    const correctionFactor = (0.5 - numericError) * 0.2; // حدوداً بین -0.1 تا +0.1

    weights.risk = Math.min(1, Math.max(0, weights.risk + correctionFactor));
    weights.momentum = Math.min(
      1,
      Math.max(0, weights.momentum - correctionFactor / 2)
    );
    weights.fusion = Math.min(
      1,
      Math.max(0, weights.fusion - correctionFactor / 2)
    );

    // Reinforcement signal بر اساس خطا
    weights.reinforcement_signal = 1 - numericError;

    const weightSnapshot = {
      mode,
      error: numericError,
      avgError,
      weights: { ...weights },
      at: now,
    };

    trinityMemory.weightHistory.push(weightSnapshot);

    // فقط ۵۰ رکورد آخر را نگه می‌داریم
    if (trinityMemory.weightHistory.length > 50) {
      trinityMemory.weightHistory.shift();
    }

    trinityMemory.lastSnapshot = weightSnapshot;
  }

  // ---- تفاوت رفتار بین SIMULATION و LIVE ----
  if (mode === "LIVE") {
    // در حالت LIVE کمی محافظه‌کارتر می‌شود
    riskIndex = Math.min(1, riskIndex + 0.03);
    stabilityIndex = Math.min(1, stabilityIndex + 0.02);
    momentumPulse = Math.max(0, momentumPulse - 0.04);
  }

  const stats = {
    calls: trinityMemory.calls,
    avgError:
      trinityMemory.calls === 0
        ? 0
        : Number((trinityMemory.totalError / trinityMemory.calls).toFixed(4)),
  };

  return {
    ok: true,
    engine: "TRINITY_CORE",
    mode,
    risk_index: Number(riskIndex.toFixed(3)),
    momentum_pulse: Number(momentumPulse.toFixed(3)),
    fusion_confidence: Number(fusionConfidence.toFixed(3)),
    fusion_strength: Number(fusionStrength.toFixed(3)),
    stability_index: Number(stabilityIndex.toFixed(3)),
    entropy_balance: Number(entropyBalance.toFixed(3)),
    context: {
      matchPressure: 0.62,
      dataQuality: 0.82,
      volatility: 0.38,
    },
    weights,
    alerts: [],
    stats,
    message: "Trinity Self-Evolving Core v1.0 snapshot",
    timestamp: now,
  };
}

// ----------------------
// 1) Health endpoint
// ----------------------
router.get("/", (req, res) => {
  return res.json({
    ok: true,
    layer: "TRINITY_CORE",
    message: "Trinity Core v1.0 online ✅",
    components: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    timestamp: new Date().toISOString(),
  });
});

// ----------------------
// 2) Snapshot endpoint
//    ?mode=SIMULATION|LIVE
//    ?error=0.0-1.0   (optional)
// ----------------------
router.get("/snapshot", (req, res) => {
  const { mode, error } = req.query;

  const selectedMode =
    typeof mode === "string" && mode.toUpperCase() === "LIVE"
      ? "LIVE"
      : "SIMULATION";

  const errorValue =
    typeof error === "string" ? Number.parseFloat(error) : undefined;

  const payload = buildSnapshot(selectedMode, errorValue);
  return res.json(payload);
});

// ----------------------
// 3) Memory inspection
// ----------------------
router.get("/memory", (req, res) => {
  const now = new Date().toISOString();

  const stats = {
    calls: trinityMemory.calls,
    totalError: Number(trinityMemory.totalError.toFixed(6)),
    avgError:
      trinityMemory.calls === 0
        ? 0
        : Number((trinityMemory.totalError / trinityMemory.calls).toFixed(6)),
  };

  return res.json({
    ok: true,
    layer: "TRINITY_CORE_MEMORY",
    state: {
      ...stats,
      lastSnapshot: trinityMemory.lastSnapshot,
      lastUpdate: trinityMemory.lastUpdate,
      weightHistory: trinityMemory.weightHistory,
    },
    timestamp: now,
  });
});

export default router;
