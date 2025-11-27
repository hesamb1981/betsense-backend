// controllers/nsiController.js

// Helper to turn any value into a safe number
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// Simple clamp helper
const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

// -----------------------------
// Health + diagnostics
// -----------------------------

export const getBasicHealth = (req, res) => {
  res.json({
    ok: true,
    layer: "NSI",
    status: "healthy",
    mode: "basic",
    ts: new Date().toISOString(),
  });
};

export const getDeepHealth = (req, res) => {
  res.json({
    ok: true,
    layer: "NSI",
    status: "healthy",
    mode: "deep",
    checks: {
      engineLoaded: true,
      config: "demo",
      latencyMs: 5,
    },
    ts: new Date().toISOString(),
  });
};

export const getSampleSnapshot = (req, res) => {
  res.json({
    ok: true,
    sample: {
      fixtureId: "123456",
      team: "Arsenal",
      opponent: "Spurs",
      minute: 78,
      scoreDiff: 1, // team is leading by 1
      mustWin: true,
      knockout: false,
      derby: true,
      emotionIndex: 72,
      xgMomentum: 65,
      pressureIndex: 58,
      behaviorDeviation: 18,
      lastGoalMinutes: 4,
      lastCardMinutes: 11,
      lastVarMinutes: 27,
    },
  });
};

export const getSignatureExample = (req, res) => {
  res.json({
    ok: true,
    signature: {
      nsiScore: 81,
      stateBand: "CLUTCH",
      collapseRisk: 0.19,
      flags: ["must_win", "derby_heat", "recent_goal"],
    },
  });
};

// -----------------------------
// Main analysis endpoint
// -----------------------------

export const analyzeNSI = (req, res) => {
  try {
    const {
      fixtureId,
      teamName,
      opponentName,
      minute,
      scoreDiff,
      venue,
      mustWin,
      knockout,
      derby,
      emotionIndex,
      xgMomentum,
      pressureIndex,
      behaviorDeviation,
      lastGoalMinutes,
      lastCardMinutes,
      lastVarMinutes,
    } = req.body || {};

    // Core numeric signals
    const emotion = toNumber(emotionIndex, 50);
    const xg = toNumber(xgMomentum, 50);
    const pressure = toNumber(pressureIndex, 50);
    const behavior = toNumber(behaviorDeviation, 0);

    // Simple base score from stack signals (0–100)
    const baseScore = (emotion + xg + pressure) / 3;

    // High-stakes boosts
    const mustWinBoost = mustWin ? 10 : 0;
    const knockoutBoost = knockout ? 12 : 0;
    const derbyBoost = derby ? 8 : 0;

    // Behavior deviation: higher deviation = higher instability
    const behaviorWeight = clamp01(behavior / 40); // 0–1
    const behaviorBoost = behaviorWeight * 15; // up to +15

    // Shock triggers: recent goal/card/VAR increase instability
    const lastGoal = toNumber(lastGoalMinutes, 30);
    const lastCard = toNumber(lastCardMinutes, 45);
    const lastVar = toNumber(lastVarMinutes, 60);

    const goalShock = clamp01((20 - lastGoal) / 20); // if goal in last 0–5 mins, close to 1
    const cardShock = clamp01((25 - lastCard) / 25);
    const varShock = clamp01((30 - lastVar) / 30);

    const shockBoost = (goalShock * 10) + (cardShock * 6) + (varShock * 6);

    // Score context: chasing vs leading
    const diff = toNumber(scoreDiff, 0);
    let scoreStress = 0;
    if (diff < 0) {
      // losing
      scoreStress = Math.min(Math.abs(diff) * 6, 18); // up to +18
    } else if (diff > 0) {
      // leading: small protective effect
      scoreStress = -Math.min(diff * 3, 9); // up to -9
    }

    // Minute context (late game higher pressure)
    const m = toNumber(minute, 45);
    const minuteFactor = clamp01((m - 60) / 30); // 60–90 -> 0–1
    const lateGameBoost = minuteFactor * 12;

    // Venue: away slightly more volatile in this demo
    let venueAdjust = 0;
    if (venue === "away") venueAdjust = 5;
    if (venue === "neutral") venueAdjust = 2;

    // Final NSI score
    let nsiScore =
      baseScore +
      mustWinBoost +
      knockoutBoost +
      derbyBoost +
      behaviorBoost +
      shockBoost +
      scoreStress +
      lateGameBoost +
      venueAdjust;

    // Clamp 0–100
    if (nsiScore < 0) nsiScore = 0;
    if (nsiScore > 100) nsiScore = 100;

    // Simple banding
    let stateBand = "STABLE";
    if (nsiScore >= 80) stateBand = "CLUTCH";
    else if (nsiScore >= 60) stateBand = "TENSE";
    else if (nsiScore <= 35) stateBand = "FRAGILE";

    const collapseRisk = clamp01((100 - nsiScore) / 120); // 0–1 style value

    const flags = [];
    if (mustWin) flags.push("must_win");
    if (knockout) flags.push("knockout_tie");
    if (derby) flags.push("derby_heat");
    if (goalShock > 0.5) flags.push("recent_goal_shock");
    if (cardShock > 0.5) flags.push("recent_card_shock");
    if (varShock > 0.5) flags.push("recent_var_shock");
    if (behaviorWeight > 0.6) flags.push("behavior_deviation_spike");
    if (minuteFactor > 0.6) flags.push("late_game_pressure");

    res.json({
      ok: true,
      input: {
        fixtureId: fixtureId || null,
        teamName: teamName || null,
        opponentName: opponentName || null,
        minute: toNumber(minute, 0),
        scoreDiff: diff,
        venue: venue || "unknown",
      },
      nsi: {
        nsiScore: Math.round(nsiScore),
        stateBand,
        collapseRisk: Number(collapseRisk.toFixed(2)),
        flags,
      },
      debug: {
        baseScore: Number(baseScore.toFixed(2)),
        mustWinBoost,
        knockoutBoost,
        derbyBoost,
        behaviorBoost: Number(behaviorBoost.toFixed(2)),
        shockBoost: Number(shockBoost.toFixed(2)),
        scoreStress,
        lateGameBoost: Number(lateGameBoost.toFixed(2)),
        venueAdjust,
      },
    });
  } catch (err) {
    console.error("NSI analyze error:", err);
    res.status(500).json({
      ok: false,
      error: "NSI_ENGINE_ERROR",
      message: "Unexpected error inside NSI Engine demo.",
    });
  }
};
