import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// -----------------------------
// ROOT + GLOBAL HEALTH
// -----------------------------
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "BetSense Backend",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// -----------------------------
// RBS ENGINE ROUTES
// Base: /api/rbs
// -----------------------------

// تست سلامت RBS
app.get("/api/rbs/health", (req, res) => {
  res.json({
    ok: true,
    engine: "RBS",
    status: "healthy",
  });
});

// آنالیز تستی RBS - GET (برای تست با مرورگر)
app.get("/api/rbs/analyze", (req, res) => {
  res.json({
    ok: true,
    engine: "RBS",
    mode: "demo",
    summary: "RBS demo analysis (GET).",
    metrics: {
      pressureIndex: 64,
      flipRisk: 31,
      chaosFactor: 12,
    },
  });
});

// آنالیز RBS - POST (برای استفاده واقعی بعداً)
app.post("/api/rbs/analyze", (req, res) => {
  const {
    fixtureId,
    team,
    opponent,
    minute,
    scoreDiff,
    marketPressure,
    behaviorDeviation,
  } = req.body || {};

  const safeMinute = typeof minute === "number" ? minute : 60;
  const minuteFactor = Math.min(1, Math.max(0, safeMinute / 90));

  const safeScoreDiff =
    typeof scoreDiff === "number" ? scoreDiff : 0;

  let scoreFactor = 0;
  if (safeScoreDiff < 0) scoreFactor = 15;
  else if (safeScoreDiff > 0) scoreFactor = -10;

  const safeMarketPressure =
    typeof marketPressure === "number" ? marketPressure : 50;
  const safeBehaviorDeviation =
    typeof behaviorDeviation === "number" ? behaviorDeviation : 50;

  let basePressure =
    40 +
    minuteFactor * 25 +
    scoreFactor +
    (safeMarketPressure - 50) * 0.4 +
    (safeBehaviorDeviation - 50) * 0.6;

  basePressure = Math.max(0, Math.min(100, basePressure));

  const flipRisk = Math.max(
    0,
    Math.min(100, 100 - basePressure + safeBehaviorDeviation * 0.3)
  );

  const chaosFactor = Math.max(
    0,
    Math.min(
      100,
      (safeMarketPressure + safeBehaviorDeviation) / 2
    )
  );

  res.json({
    ok: true,
    engine: "RBS",
    fixtureId: fixtureId || null,
    team: team || null,
    opponent: opponent || null,
    minute: safeMinute,
    scoreDiff: safeScoreDiff,
    metrics: {
      pressureIndex: Math.round(basePressure),
      flipRisk: Math.round(flipRisk),
      chaosFactor: Math.round(chaosFactor),
    },
  });
});

// -----------------------------
// NSI ENGINE ROUTES (برای آینده)
// Base: /api/nsi
// -----------------------------

app.get("/api/nsi/health", (req, res) => {
  res.json({
    ok: true,
    engine: "NSI",
    status: "healthy",
  });
});

app.get("/api/nsi/analyze", (req, res) => {
  res.json({
    ok: true,
    engine: "NSI",
    mode: "demo",
    summary: "NSI demo analysis (GET).",
    metrics: {
      neuroEdge: 72,
      clutchPotential: 58,
      collapseRisk: 19,
    },
  });
});

app.post("/api/nsi/analyze", (req, res) => {
  const { fixtureId, team, opponent, emotionIndex, xgMomentum, pressureIndex, shockMinutes } =
    req.body || {};

  const safeEmotion = typeof emotionIndex === "number" ? emotionIndex : 50;
  const safeXgMomentum = typeof xgMomentum === "number" ? xgMomentum : 50;
  const safePressure = typeof pressureIndex === "number" ? pressureIndex : 50;
  const safeShock = typeof shockMinutes === "number" ? shockMinutes : 10;

  let neuroEdge =
    50 +
    (safeEmotion - 50) * 0.4 +
    (safeXgMomentum - 50) * 0.6 -
    (safePressure - 50) * 0.2;

  neuroEdge = Math.max(0, Math.min(100, neuroEdge));

  let collapseRisk =
    30 +
    (safePressure - 50) * 0.5 -
    (safeEmotion - 50) * 0.3 +
    (safeShock < 5 ? 15 : 0);

  collapseRisk = Math.max(0, Math.min(100, collapseRisk));

  const clutchPotential = Math.max(
    0,
    Math.min(
      100,
      100 - collapseRisk + (safeEmotion - 50) * 0.4
    )
  );

  res.json({
    ok: true,
    engine: "NSI",
    fixtureId: fixtureId || null,
    team: team || null,
    opponent: opponent || null,
    metrics: {
      neuroEdge: Math.round(neuroEdge),
      collapseRisk: Math.round(collapseRisk),
      clutchPotential: Math.round(clutchPotential),
    },
  });
});

// -----------------------------
// 404 HANDLER
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// -----------------------------
// START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
