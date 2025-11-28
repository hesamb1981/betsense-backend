// controllers/nsiController.js
// NSI Engine + RBS (Real Behavioral Switching) – BetSense

// ----------------- Helpers -----------------
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp01 = (v) => {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
};

// ----------------- NSI Core -----------------
const buildNsiSignature = (input) => {
  const {
    minute = 0,
    scoreDiff = 0,
    venue = "UNKNOWN",
    mustWin = false,
    knockout = false,
    derby = false,
    emotionIndex = 50,
    xgMomentum = 50,
    pressureIndex = 50,
    behaviorDeviation = 0,
    lastGoalMinutes = 30,
    lastCardMinutes = 45,
    lastVarMinutes = 60,
  } = input;

  const emotion = toNumber(emotionIndex, 50);
  const xg = toNumber(xgMomentum, 50);
  const pressure = toNumber(pressureIndex, 50);
  const behaviour = toNumber(behaviorDeviation, 0);

  const baseScore = (emotion + xg + pressure) / 3;

  const mustWinBoost = mustWin ? 10 : 0;
  const knockoutBoost = knockout ? 12 : 0;
  const derbyBoost = derby ? 8 : 0;

  const behaviourWeight = clamp01(behaviour / 40);
  const behaviourBoost = behaviourWeight * 15;

  const lastGoal = toNumber(lastGoalMinutes, 30);
  const lastCard = toNumber(lastCardMinutes, 45);
  const lastVar = toNumber(lastVarMinutes, 60);

  const goalShock = clamp01((20 - lastGoal) / 20);
  const cardShock = clamp01((25 - lastCard) / 25);
  const varShock = clamp01((30 - lastVar) / 30);

  const shockBoost = goalShock * 10 + cardShock * 6 + varShock * 6;

  let scoreStress = 0;
  const diff = toNumber(scoreDiff, 0);
  if (diff < 0) {
    scoreStress = Math.min(Math.abs(diff) * 6, 18);
  } else if (diff > 0) {
    scoreStress = -Math.min(diff * 3, 9);
  }

  const m = toNumber(minute, 0);
  const minuteFactor = clamp01((m - 60) / 30);
  const lateGameBoost = minuteFactor * 12;

  const v = (venue || "").toString().toUpperCase();
  let venueAdjust = 0;
  if (v === "AWAY") venueAdjust = 5;
  if (v === "NEUTRAL") venueAdjust = 2;

  let nsiScore =
    baseScore +
    mustWinBoost +
    knockoutBoost +
    derbyBoost +
    behaviourBoost +
    shockBoost +
    scoreStress +
    lateGameBoost +
    venueAdjust;

  if (nsiScore < 0) nsiScore = 0;
  if (nsiScore > 100) nsiScore = 100;

  let stateBand = "STABLE";
  if (nsiScore >= 80) stateBand = "CLUTCH";
  else if (nsiScore >= 60) stateBand = "TENSE";
  else if (nsiScore <= 35) stateBand = "FRAGILE";

  const collapseRisk = clamp01((100 - nsiScore) / 120);

  const flags = [];
  if (mustWin) flags.push("must_win");
  if (knockout) flags.push("knockout_tie");
  if (derby) flags.push("derby_heat");
  if (goalShock > 0.5) flags.push("recent_goal_shock");
  if (cardShock > 0.5) flags.push("recent_card_shock");
  if (varShock > 0.5) flags.push("recent_var_shock");
  if (behaviourWeight > 0.6) flags.push("behavior_deviation_spike");
  if (minuteFactor > 0.6) flags.push("late_game_pressure");

  return {
    nsiScore: Math.round(nsiScore),
    stateBand,
    collapseRisk: Number(collapseRisk.toFixed(2)),
    flags,
  };
};

// ----------------- NSI Endpoints -----------------
export const nsiHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "NSIEngine",
    status: "online",
    mode: "stack-ready",
    ts: new Date().toISOString(),
  });
};

export const nsiAnalyze = (req, res) => {
  try {
    const src = req.method === "GET" ? req.query : (req.body || {});

    const fixtureId =
      src.fixtureId || src.fixture_id || src.fixture || null;

    const team =
      src.team ||
      src.teamName ||
      src.home_team ||
      src.homeTeam ||
      null;

    const opponent =
      src.opponent ||
      src.opponentName ||
      src.away_team ||
      src.awayTeam ||
      null;

    const minute = toNumber(src.minute, 0);
    const scoreDiff = toNumber(src.scoreDiff, 0);
    const venue = (src.venue || "UNKNOWN").toString().toUpperCase();

    const mustWin =
      src.mustWin === true ||
      src.mustWin === "true" ||
      src.mustWin === "1";

    const knockout =
      src.knockout === true ||
      src.knockout === "true" ||
      src.knockout === "1";

    const derby =
      src.derby === true ||
      src.derby === "true" ||
      src.derby === "1";

    const signals = src.stackSignals || src.signals || src || {};
    const shocks = src.shocks || src.triggers || src || {};

    const emotionIndex = toNumber(
      signals.emotionIndex ?? src.emotionIndex,
      50
    );
    const xgMomentum = toNumber(
      signals.xgMomentum ?? src.xgMomentum,
      50
    );
    const pressureIndex = toNumber(
      signals.pressureIndex ?? src.pressureIndex,
      50
    );
    const behaviorDeviation = toNumber(
      signals.behaviorDeviation ?? src.behaviorDeviation,
      0
    );

    const lastGoalMinutes = toNumber(
      shocks.lastGoalMinutes ??
        shocks.lastGoalMinutesAgo ??
        src.lastGoalMinutes ??
        src.lastGoalMinutesAgo,
      30
    );
    const lastCardMinutes = toNumber(
      shocks.lastCardMinutes ??
        shocks.lastCardMinutesAgo ??
        src.lastCardMinutes ??
        src.lastCardMinutesAgo,
      45
    );
    const lastVarMinutes = toNumber(
      shocks.lastVarMinutes ??
        shocks.lastVarMinutesAgo ??
        src.lastVarMinutes ??
        src.lastVarMinutesAgo,
      60
    );

    const signature = buildNsiSignature({
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
    });

    return res.json({
      ok: true,
      engine: "NSIEngine",
      mode: "manual",
      input: {
        fixtureId,
        team,
        opponent,
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
      },
      nsi: signature,
    });
  } catch (error) {
    console.error("NSI analyze error:", error);
    return res.status(500).json({
      ok: false,
      engine: "NSIEngine",
      error: "NSI_ENGINE_ERROR",
      message: "Unexpected error inside NSI Engine.",
    });
  }
};

export const nsiLive = (req, res) => {
  try {
    const src = req.method === "GET" ? req.query : (req.body || {});

    const fixtureId =
      src.fixtureId || src.fixture_id || src.fixture || null;

    const team =
      src.team ||
      src.teamName ||
      src.home_team ||
      src.homeTeam ||
      null;

    const opponent =
      src.opponent ||
      src.opponentName ||
      src.away_team ||
      src.awayTeam ||
      null;

    const minute = toNumber(src.minute, 78);
    const scoreDiff = toNumber(src.scoreDiff, 0);
    const venue = (src.venue || "HOME").toString().toUpperCase();

    const emotionIndex = toNumber(src.emotionIndex, 72);
    const xgMomentum = toNumber(src.xgMomentum, 68);
    const pressureIndex = toNumber(src.pressureIndex, 63);
    const behaviorDeviation = toNumber(src.behaviorDeviation, 28);

    const lastGoalMinutes = toNumber(src.lastGoalMinutes, 4);
    const lastCardMinutes = toNumber(src.lastCardMinutes, 16);
    const lastVarMinutes = toNumber(src.lastVarMinutes, 25);

    const signature = buildNsiSignature({
      minute,
      scoreDiff,
      venue,
      mustWin:
        src.mustWin === "true" ||
        src.mustWin === "1" ||
        src.mustWin === true,
      knockout:
        src.knockout === "true" ||
        src.knockout === "1" ||
        src.knockout === true,
      derby:
        src.derby === "true" ||
        src.derby === "1" ||
        src.derby === true,
      emotionIndex,
      xgMomentum,
      pressureIndex,
      behaviorDeviation,
      lastGoalMinutes,
      lastCardMinutes,
      lastVarMinutes,
    });

    return res.json({
      ok: true,
      engine: "NSIEngine",
      mode: "live-demo",
      fixtureId,
      team,
      opponent,
      minute,
      scoreDiff,
      venue,
      liveSignals: {
        emotionIndex,
        xgMomentum,
        pressureIndex,
        behaviorDeviation,
        lastGoalMinutes,
        lastCardMinutes,
        lastVarMinutes,
      },
      nsi: signature,
    });
  } catch (error) {
    console.error("NSI live error:", error);
    return res.status(500).json({
      ok: false,
      engine: "NSIEngine",
      error: "NSI_LIVE_ERROR",
      message: "Unexpected error inside NSI live endpoint.",
    });
  }
};

// ----------------- RBS Core (Real Behavioral Switching) -----------------

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

  const tension = base * 0.45 + behaviour * 0.35 + tactical * 0.2;
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

// ----------------- RBS Endpoint -----------------

export const nsiRbsSwitches = (req, res) => {
  try {
    const src = req.method === "GET" ? req.query : (req.body || {});
    const timeline = Array.isArray(src.timeline) ? src.timeline : [];
    const options = src.options || {};

    const result = buildRBSSignature(timeline, options);
    return res.json(result);
  } catch (error) {
    console.error("RBS switches error:", error);
    return res.status(500).json({
      ok: false,
      engine: "RBSEngine",
      error: "RBS_ENGINE_ERROR",
      message: "Unexpected error inside RBSEngine endpoint.",
    });
  }
};
