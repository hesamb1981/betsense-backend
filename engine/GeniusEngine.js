// engine/GeniusEngine.js
// ==========================================
// BetSense Genius Layer Engine (v1 - Real API-Based)
// ==========================================

import axios from "axios";

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY;

// -----------------------------
// Helper: safe stat extractor
// -----------------------------
function getStat(statsArray, type) {
  if (!Array.isArray(statsArray)) return 0;
  const found = statsArray.find((s) => s.type === type);
  if (!found) return 0;

  // بعضی وقت‌ها API مقدار رو به صورت "58%" می‌فرسته
  if (typeof found.value === "string") {
    const cleaned = found.value.replace("%", "").trim();
    const num = Number(cleaned);
    return isNaN(num) ? found.value : num;
  }

  return found.value ?? 0;
}

// -----------------------------
// 1) Fetch fixture + stats
// -----------------------------
async function fetchMatchWithStats(matchId) {
  if (!API_KEY) {
    throw new Error("API_FOOTBALL_KEY is missing in environment");
  }

  // 1. خود بازی
  const fixtureUrl = `${API_BASE}/fixtures`;
  const fixtureRes = await axios.get(fixtureUrl, {
    params: { id: matchId },
    headers: { "x-apisports-key": API_KEY },
    timeout: 15000,
  });

  if (!fixtureRes.data?.response?.length) {
    throw new Error("Match not found");
  }

  const match = fixtureRes.data.response[0];

  // 2. استت‌های بازی
  const statsUrl = `${API_BASE}/fixtures/statistics`;
  const statsRes = await axios.get(statsUrl, {
    params: { fixture: matchId },
    headers: { "x-apisports-key": API_KEY },
    timeout: 15000,
  });

  const stats = statsRes.data?.response ?? [];

  return { match, stats };
}

// -----------------------------
// 2) Genius KPIs
// -----------------------------
// این بخش همون جاییه که "Genius" رو می‌سازه:
// شاخص‌ها رو طوری می‌سازیم که بعداً بشه
// دقیق‌تر و سنگین‌ترش کرد.

function buildGeniusMetrics(match, stats) {
  const fixture = match.fixture ?? {};
  const teams = match.teams ?? {};
  const goals = match.goals ?? {};
  const league = match.league ?? {};

  const homeName = teams.home?.name || "Home Team";
  const awayName = teams.away?.name || "Away Team";

  const homeStatsArr = stats[0]?.statistics || [];
  const awayStatsArr = stats[1]?.statistics || [];

  const homeShots = getStat(homeStatsArr, "Total Shots");
  const awayShots = getStat(awayStatsArr, "Total Shots");

  const homeOnTarget = getStat(homeStatsArr, "Shots on Goal");
  const awayOnTarget = getStat(awayStatsArr, "Shots on Goal");

  const homePoss = getStat(homeStatsArr, "Ball Possession");
  const awayPoss = getStat(awayStatsArr, "Ball Possession");

  const homeCorners = getStat(homeStatsArr, "Corner Kicks");
  const awayCorners = getStat(awayStatsArr, "Corner Kicks");

  const homeDangerActions = homeOnTarget * 3 + homeCorners * 1.5;
  const awayDangerActions = awayOnTarget * 3 + awayCorners * 1.5;

  const homeScore = goals.home ?? 0;
  const awayScore = goals.away ?? 0;

  // -----------------------------
  // Genius indices (نسخه ۱ – واقعی ولی سبک)
  // -----------------------------

  // 1) Chance Conversion Genius Index
  //   کیفیت تبدیل موقعیت به گل
  const homeConv =
    homeOnTarget > 0 ? (homeScore / homeOnTarget) * 100 : homeScore > 0 ? 120 : 0;
  const awayConv =
    awayOnTarget > 0 ? (awayScore / awayOnTarget) * 100 : awayScore > 0 ? 120 : 0;

  // 2) Pressure & Momentum Index
  const homePressure = homeDangerActions + (typeof homePoss === "number" ? homePoss * 0.3 : 0);
  const awayPressure = awayDangerActions + (typeof awayPoss === "number" ? awayPoss * 0.3 : 0);

  const pressureDiff = homePressure - awayPressure;

  // 3) Game Control Genius Score
  const homeControl =
    (typeof homePoss === "number" ? homePoss : 50) +
    homeShots * 1.2 +
    homeCorners * 0.8;
  const awayControl =
    (typeof awayPoss === "number" ? awayPoss : 50) +
    awayShots * 1.2 +
    awayCorners * 0.8;

  // 4) Volatility Index – برای Golden Engine و Bet
  const goalDiff = Math.abs(homeScore - awayScore);
  const shotDiff = Math.abs(homeShots - awayShots);
  const volatilityIndex = Math.min(100, goalDiff * 12 + shotDiff * 2);

  // -----------------------------
  // ساخت خلاصه‌های متنی
  // -----------------------------
  let pressureComment = "";
  if (pressureDiff > 15) {
    pressureComment = `${homeName} are applying significantly higher sustained pressure.`;
  } else if (pressureDiff < -15) {
    pressureComment = `${awayName} are applying significantly higher sustained pressure.`;
  } else {
    pressureComment = "Pressure and momentum are relatively balanced between both sides.";
  }

  let controlComment = "";
  if (homeControl > awayControl + 20) {
    controlComment = `${homeName} are dictating the game in terms of control, territory and tempo.`;
  } else if (awayControl > homeControl + 20) {
    controlComment = `${awayName} are dictating the game in terms of control, territory and tempo.`;
  } else {
    controlComment = "Game control is balanced; no side has a clear structural dominance.";
  }

  let volatilityComment = "";
  if (volatilityIndex > 70) {
    volatilityComment =
      "High-volatility match profile: ideal for dynamic trading, cash-out strategies and fast-reactive models.";
  } else if (volatilityIndex < 30) {
    volatilityComment =
      "Low-volatility match profile: more stable, suitable for conservative exposure and long-hold positions.";
  } else {
    volatilityComment =
      "Medium-volatility profile: mixed risk environment – selective exposure recommended.";
  }

  // یک "Genius Score" کلی بین 0–100
  const geniusScore = Math.round(
    Math.min(
      100,
      (homeControl + awayControl) / 4 +
        (homeConv + awayConv) / 4 +
        (100 - Math.abs(50 - volatilityIndex)) / 3
    )
  );

  return {
    meta: {
      matchId: fixture.id,
      date: fixture.date,
      league: league.name,
      round: league.round,
      homeTeam: homeName,
      awayTeam: awayName,
      score: `${homeScore} - ${awayScore}`,
    },
    raw: {
      homeShots,
      awayShots,
      homeOnTarget,
      awayOnTarget,
      homePoss,
      awayPoss,
      homeCorners,
      awayCorners,
    },
    indices: {
      homeConversionIndex: Math.round(homeConv),
      awayConversionIndex: Math.round(awayConv),
      homePressureIndex: Math.round(homePressure),
      awayPressureIndex: Math.round(awayPressure),
      homeControlIndex: Math.round(homeControl),
      awayControlIndex: Math.round(awayControl),
      volatilityIndex: Math.round(volatilityIndex),
      geniusScore,
    },
    narrative: {
      pressureComment,
      controlComment,
      volatilityComment,
      enterpriseSummary:
        "This Genius Layer aggregates live match structure, pressure, conversion quality and volatility into an enterprise-grade signal that can plug into BetSense Golden Engine, trading desks and risk-management pipelines.",
    },
  };
}

// -----------------------------
// 3) Public API for server.js
// -----------------------------
export async function runGenius(matchId) {
  const { match, stats } = await fetchMatchWithStats(matchId);
  const genius = buildGeniusMetrics(match, stats);

  return {
    ok: true,
    engine: "BetSense Genius Layer",
    genius,
  };
}
