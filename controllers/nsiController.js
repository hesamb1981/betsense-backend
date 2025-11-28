// controllers/nsiController.js
// NSI Engine – health + demo + analyze ساده

// Helper: safe number
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// -----------------------------
// 1) Health
// -----------------------------
export const nsiHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "NSIEngine",
    status: "online",
    mode: "demo",
    ts: new Date().toISOString(),
  });
};

// -----------------------------
// 2) Demo analyze  (GET /api/nsi/demo)
// -----------------------------
export const nsiDemoAnalyze = (req, res) => {
  // یک خروجی دمو ثابت؛ فقط برای اینکه لینک تست کار کند
  const sample = {
    ok: true,
    engine: "NSIEngine",
    mode: "demo-analyze",
    fixtureId: 123456,
    team: "Arsenal",
    opponent: "Spurs",
    minute: 78,
    scoreDiff: -1,
    signals: {
      emotionIndex: 82,
      xgMomentum: 70,
      pressureIndex: 66,
      behaviorDeviation: 34,
      lastGoalMinutes: 3,
      lastCardMinutes: 12,
      lastVarMinutes: 24,
    },
    nsi: {
      nsiScore: 74,
      stateBand: "TENSE",
      collapseRisk: 0.32,
      flags: [
        "must_win",
        "derby_heat",
        "recent_goal_shock",
        "behavior_deviation_spike",
      ],
    },
  };

  res.json(sample);
};

// -----------------------------
// 3) Full analyze  (GET/POST /api/nsi/analyze)
// -----------------------------
export const nsiAnalyze = (req, res) => {
  // داده از body یا query
  const src = req.method === "GET" ? req.query : (req.body || {});

  const fixtureId = src.fixtureId || null;
  const team = src.team || null;
  const opponent = src.opponent || null;

  const minute = toNumber(src.minute, 0);
  const scoreDiff = toNumber(src.scoreDiff, 0);
  const emotionIndex = toNumber(src.emotionIndex, 50);
  const xgMomentum = toNumber(src.xgMomentum, 50);
  const pressureIndex = toNumber(src.pressureIndex, 50);
  const behaviorDeviation = toNumber(src.behaviorDeviation, 0);
  const lastGoalMinutes = toNumber(src.lastGoalMinutes, 30);
  const lastCardMinutes = toNumber(src.lastCardMinutes, 45);
  const lastVarMinutes = toNumber(src.lastVarMinutes, 60);

  // یک منطق خیلی ساده برای NSI (بعداً می‌تونیم به انجین واقعی وصلش کنیم)
  const base = (emotionIndex + xgMomentum + pressureIndex) / 3;
  const devFactor = Math.min(behaviorDeviation / 2, 15);
  const shockFactor =
    Math.max(0, 20 - lastGoalMinutes) * 0.3 +
    Math.max(0, 25 - lastCardMinutes) * 0.2 +
    Math.max(0, 30 - lastVarMinutes) * 0.2;

  let nsiScore = base + devFactor + shockFactor;
  if (scoreDiff > 0) nsiScore -= 5;
  if (scoreDiff < 0) nsiScore += 5;

  if (nsiScore < 0) nsiScore = 0;
  if (nsiScore > 100) nsiScore = 100;

  let stateBand = "STABLE";
  if (nsiScore >= 80) stateBand = "CLUTCH";
  else if (nsiScore >= 60) stateBand = "TENSE";
  else if (nsiScore <= 35) stateBand = "FRAGILE";

  const collapseRisk = Number(((100 - nsiScore) / 120).toFixed(2));

  return res.json({
    ok: true,
    engine: "NSIEngine",
    mode: "analyze-basic",
    input: {
      fixtureId,
      team,
      opponent,
      minute,
      scoreDiff,
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
      collapseRisk,
    },
  });
};
