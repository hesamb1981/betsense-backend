// controllers/nsiController.js
// NSI Engine – health, analyze (manual), live (stack-connected)

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

// این تابع هسته‌ی محاسبه‌ی NSI است – هم برای analyze معمولی، هم برای live استفاده می‌شود
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

// -----------------------------
// HEALTH
// -----------------------------
export const nsiHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "NSIEngine",
    status: "online",
    mode: "stack-ready",
    ts: new Date().toISOString(),
  });
};

// -----------------------------
// MANUAL ANALYZE  (قبلی که کار می‌کرد)
// -----------------------------
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

// -----------------------------
// LIVE ANALYZE (اتصال به موتورهای زنده - نسخه demo)
// -----------------------------
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

    // 🔻 در آینده این ۴ تا از موتورهای واقعی Emotion / xG / Behavior خوانده می‌شود
    const emotionIndex = toNumber(src.emotionIndex, 72);
    const xgMomentum = toNumber(src.xgMomentum, 68);
    const pressureIndex = toNumber(src.pressureIndex, 63);
    const behaviorDeviation = toNumber(src.behaviorDeviation, 28);

    // شاک‌ها هم در نسخه نهایی از لایه‌ی live shock recorder می‌آیند
    const lastGoalMinutes = toNumber(src.lastGoalMinutes, 4);
    const lastCardMinutes = toNumber(src.lastCardMinutes, 16);
    const lastVarMinutes = toNumber(src.lastVarMinutes, 25);

    const signature = buildNsiSignature({
      minute,
      scoreDiff,
      venue,
      mustWin: src.mustWin === "true" || src.mustWin === "1" || src.mustWin === true,
      knockout: src.knockout === "true" || src.knockout === "1" || src.knockout === true,
      derby: src.derby === "true" || src.derby === "1" || src.derby === true,
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
