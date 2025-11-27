// controllers/nsiController.js
// NSI Engine controller – shared for GET/POST /api/nsi/analyze

// Helper: safe number
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// Helper: clamp 0–1
const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

// -----------------------------
// Health endpoint
// -----------------------------
export const nsiHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "NSIEngine",
    status: "online",
    ts: new Date().toISOString(),
  });
};

// -----------------------------
// Main NSI analyzer (GET + POST)
// -----------------------------
export const nsiAnalyze = (req, res) => {
  try {
    // Support both GET (query) and POST (body)
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
    const venue = (src.venue || "").toString().toUpperCase() || "UNKNOWN";

    // Flags – accept boolean or "true"/"1"
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

    // Signals – can come flat or nested (stackSignals.*)
    const signals = src.stackSignals || src.signals || src || {};

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

    // Shocks – can come flat or nested (shocks.* or triggers.*)
    const shocks = src.shocks || src.triggers || src || {};
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

    // -------------------------
    // Core NSI scoring logic
    // -------------------------
    const baseScore =
      (emotionIndex + xgMomentum + pressureIndex) / 3; // 0–100

    const mustWinBoost = mustWin ? 10 : 0;
    const knockoutBoost = knockout ? 12 : 0;
    const derbyBoost = derby ? 8 : 0;

    const behaviorWeight = clamp01(behaviorDeviation / 40); // 0–1
    const behaviorBoost = behaviorWeight * 15; // up to +15

    const goalShock = clamp01((20 - lastGoalMinutes) / 20);
    const cardShock = clamp01((25 - lastCardMinutes) / 25);
    const varShock = clamp01((30 - lastVarMinutes) / 30);

    const shockBoost =
      goalShock * 10 + cardShock * 6 + varShock * 6;

    let scoreStress = 0;
    if (scoreDiff < 0) {
      scoreStress = Math.min(Math.abs(scoreDiff) * 6, 18); // losing
    } else if (scoreDiff > 0) {
      scoreStress = -Math.min(scoreDiff * 3, 9); // leading
    }

    const minuteFactor = clamp01((minute - 60) / 30); // 60–90 -> 0–1
    const lateGameBoost = minuteFactor * 12;

    let venueAdjust = 0;
    if (venue === "AWAY") venueAdjust = 5;
    if (venue === "NEUTRAL") venueAdjust = 2;

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
    if (behaviorWeight > 0.6) flags.push("behavior_deviation_spike");
    if (minuteFactor > 0.6) flags.push("late_game_pressure");

    return res.json({
      ok: true,
      engine: "NSIEngine",
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
      nsi: {
        nsiScore: Math.round(nsiScore),
        stateBand,
        collapseRisk: Number(collapseRisk.toFixed(2)),
        flags,
      },
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
