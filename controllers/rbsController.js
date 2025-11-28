// controllers/rbsController.js
// Real Behavioral Switching Engine – HTTP controller for BetSense

// --- Helpers ---
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp01 = (v) => {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
};

// --- Core RBSEngine logic (همان مغز، اینجا هم کپی شده تا بک‌اند مستقل باشد) ---

const computeBehaviorTension = (point) => {
  const emotion = toNumber(point.emotionIndex, 50);
  const xg = toNumber(point.xgMomentum, 50);
  const pressure = toNumber(point.pressureIndex, 50);
  const deviation = toNumber(point.behaviorDeviation, 0);

  const fieldTilt = toNumber(point.fieldTilt, 50);
  const passAgg = toNumber(point.passAggression, 50);
  const pressInt = toNumber(point.pressIntensity, 50);

  const e = clamp01(emotion / 100);
  const x = clamp01(xg / 100);
  const p = clamp01(pressure / 100);
  const d = clamp01(deviation / 100);

  const ft = clamp01(fieldTilt / 100);
  const pa = clamp01(passAgg / 100);
  const pr = clamp01(pressInt / 100);

  const base = (e + x + p) / 3;
  const behaviour = d * 1.2;
  const tactical = (ft + pa + pr) / 3;

  const tension = base * 0.45 + behaviour * 0.35 + tactical * 0.20;
  return clamp01(tension);
};

const computeSwitchForce = (prevTension, currTension) => {
  const delta = currTension - prevTension;
  return {
    delta,
    magnitude: Math.abs(delta),
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
  };
};

const buildRBSSignature = (timelineRaw = [], options = {}) => {
  const timeline = (timelineRaw || [])
    .map((p) => ({
      ...p,
      minute: toNumber(p.minute, 0),
    }))
    .filter((p) => Number.isFinite(p.minute))
    .sort((a, b) => a.minute - b.minute);

  if (!timeline.length) {
    return {
      ok: false,
      engine: "RBSEngine",
      error: "EMPTY_TIMELINE",
      message: "No timeline points provided to RBSEngine.",
      summary: null,
      switches: [],
    };
  }

  const sensitivity = clamp01(options.sensitivity ?? 0.65);
  const collapseBias = clamp01(options.collapseBias ?? 0.7);

  const enriched = timeline.map((point) => {
    const tension = computeBehaviorTension(point);
    return {
      ...point,
      tension,
    };
  });

  const switches = [];
  for (let i = 1; i < enriched.length; i++) {
    const prev = enriched[i - 1];
    const curr = enriched[i];

    const { delta, magnitude, direction } = computeSwitchForce(
      prev.tension,
      curr.tension
    );

    if (magnitude >= sensitivity * 0.4) {
      let confidence = magnitude;

      if (curr.minute >= 70) {
        confidence += 0.1;
      }

      const dev = clamp01(toNumber(curr.behaviorDeviation, 0) / 100);
      confidence += dev * 0.15;

      const pressure = clamp01(toNumber(curr.pressureIndex, 50) / 100);
      if (direction === "down") {
        confidence += pressure * collapseBias * 0.2;
      }

      confidence = Math.min(confidence, 1.0);

      let type = "NEUTRAL_SWITCH";
      if (direction === "up" && confidence >= 0.7) {
        type = "AGGRESSIVE_LIFT_SWITCH";
      } else if (direction === "up" && confidence >= 0.5) {
        type = "POSITIVE_MOMENTUM_SWITCH";
      } else if (direction === "down" && confidence >= 0.75) {
        type = "CRITICAL_COLLAPSE_SWITCH";
      } else if (direction === "down" && confidence >= 0.55) {
        type = "NEGATIVE_PRESSURE_SWITCH";
      }

      let explanation = "Behavioral state switch detected.";
      if (type === "AGGRESSIVE_LIFT_SWITCH") {
        explanation =
          "Sharp lift in behavioral tension – likely shift into aggressive / high-risk phase.";
      } else if (type === "POSITIVE_MOMENTUM_SWITCH") {
        explanation =
          "Positive momentum swing – behaviour and xG/pressure shifting in favour of the team.";
      } else if (type === "CRITICAL_COLLAPSE_SWITCH") {
        explanation =
          "Critical negative switch – signs of collapse: rising pressure, behaviour deviation and drop in tension.";
      } else if (type === "NEGATIVE_PRESSURE_SWITCH") {
        explanation =
          "Negative switch under pressure – team drifting into fragile / defensive panic zone.";
      }

      switches.push({
        minute: curr.minute,
        type,
        direction:
          direction === "up"
            ? "positive"
            : direction === "down"
            ? "negative"
            : "flat",
        confidence: Number(confidence.toFixed(2)),
        window: {
          from: prev.minute,
          to: curr.minute,
        },
        tensionBefore: Number(prev.tension.toFixed(3)),
        tensionAfter: Number(curr.tension.toFixed(3)),
        explanation,
      });
    }
  }

  switches.sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return a.minute - b.minute;
  });

  const avgTension =
    enriched.reduce((sum, p) => sum + p.tension, 0) / enriched.length;

  const criticalCollapses = switches.filter(
    (s) => s.type === "CRITICAL_COLLAPSE_SWITCH"
  );
  const positiveLifts = switches.filter(
    (s) =>
      s.type === "AGGRESSIVE_LIFT_SWITCH" ||
      s.type === "POSITIVE_MOMENTUM_SWITCH"
  );

  const summary = {
    engine: "RBSEngine",
    points: enriched.length,
    averageTension: Number(avgTension.toFixed(3)),
    totalSwitches: switches.length,
    criticalCollapseCount: criticalCollapses.length,
    positiveLiftCount: positiveLifts.length,
    topCriticalCollapse: criticalCollapses[0] || null,
    topPositiveLift: positiveLifts[0] || null,
  };

  return {
    ok: true,
    engine: "RBSEngine",
    summary,
    switches,
  };
};

// --- HTTP Handlers ---

export const rbsHealth = (req, res) => {
  return res.json({
    ok: true,
    engine: "RBSEngine",
    status: "online",
    mode: "behavior_switch_layer",
    ts: new Date().toISOString(),
  });
};

export const rbsAnalyze = (req, res) => {
  try {
    const body = req.body || {};
    const timeline = body.timeline || body.points || [];

    const options = body.options || {};
    const signature = buildRBSSignature(timeline, options);

    return res.json(signature);
  } catch (error) {
    console.error("RBS analyze error:", error);
    return res.status(500).json({
      ok: false,
      engine: "RBSEngine",
      error: "RBS_ENGINE_ERROR",
      message: "Unexpected error inside RBSEngine controller.",
    });
  }
};

// اختیار: export default برای وارد کردن به صورت شیء
export default {
  rbsHealth,
  rbsAnalyze,
};
