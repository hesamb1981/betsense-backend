// aoie/aoieEngine.js
// -------------------------------------
// BetSense AOIE - Anti-Outcome Intelligence Engine (Bet Shops Edition)
// نسخه متصل به STI: وزن‌ها را از sti/sti.weights.json می‌خواند
// و هر اجرا را در sti.logger ثبت می‌کند.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logAoieRun } from "../sti/sti.logger.js";

// --------------------
// 0) بارگذاری وزن‌ها از STI
// --------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultWeights = {
  gdi: { cri: 0.4, tps: 0.3, fps: 0.2, sri: 0.1 },
  marketRisk: { cri: 0.4, tps: 0.25, fps: 0.2, liability: 0.15 },
  globalRisk: { gdi: 0.55, neds: 0.25, cmciInverse: 0.2 },
  aoProbability: {
    tisScore: 0.25,
    nonEventPressureScore: 0.25,
    matchChaosIndex: 0.15,
    avgSfi: 0.15,
    neds: 0.2,
    publicHeavyBoost: 10,
    sharpHeavyPenalty: 15
  },
  learning: {
    maxStep: 0.05,
    minWeight: 0.05,
    maxWeight: 0.6
  }
};

function loadWeights() {
  try {
    const weightsPath = path.join(__dirname, "..", "sti", "sti.weights.json");
    if (!fs.existsSync(weightsPath)) {
      return defaultWeights;
    }

    const raw = fs.readFileSync(weightsPath, "utf-8");
    const json = JSON.parse(raw);

    const w = json.weights || {};
    const l = json.learning || {};

    return {
      gdi: { ...defaultWeights.gdi, ...(w.gdi || {}) },
      marketRisk: { ...defaultWeights.marketRisk, ...(w.marketRisk || {}) },
      globalRisk: {
        ...defaultWeights.globalRisk,
        ...(w.globalRisk || {})
      },
      aoProbability: {
        ...defaultWeights.aoProbability,
        ...(w.aoProbability || {})
      },
      learning: { ...defaultWeights.learning, ...l }
    };
  } catch (err) {
    console.error("AOIE: error loading STI weights, using defaults:", err);
    return defaultWeights;
  }
}

// --------------------
// 1) کمک‌تابع‌ها (Utilities)
// --------------------

function clampScore(value) {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Number(value.toFixed(2));
}

function safePercent(part, total) {
  if (!total || total === 0) return 0;
  return (part / total) * 100;
}

function normalize(value, min, max) {
  if (max === min) return 0;
  const v = (value - min) / (max - min);
  return clampScore(v * 100);
}

function estimateMargin(oddsObj = {}) {
  const invSum = Object.values(oddsObj)
    .map((o) => Number(o || 0))
    .filter((o) => o > 1e-9)
    .reduce((sum, o) => sum + 1 / o, 0);

  if (!invSum) return 0;
  const margin = (invSum - 1) * 100;
  return margin < 0 ? 0 : Number(margin.toFixed(2));
}

function riskTierFromScore(score) {
  if (score >= 85) return "BLACKOUT";
  if (score >= 70) return "DANGER_ZONE";
  if (score >= 55) return "WATCHLIST";
  return "SAFE";
}

function confidenceBucketFromScore(stability) {
  if (stability >= 75) return "HIGH";
  if (stability >= 55) return "MEDIUM";
  return "LOW";
}

function aoBandFromProbability(aoProb) {
  if (aoProb >= 0.85) return "EXTREME";
  if (aoProb >= 0.7) return "HIGH";
  if (aoProb >= 0.55) return "MEDIUM";
  return "LOW";
}

function simpleStd(values) {
  const arr = values.filter((v) => typeof v === "number" && !isNaN(v));
  if (arr.length === 0) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const variance =
    arr.reduce((s, v) => s + (v - mean) * (v - mean), 0) / arr.length;
  return Math.sqrt(variance);
}

// --------------------
// 2) تحلیل تیکت‌ها برای کشف شارپ / پابلیک
// --------------------

function aggregateTicketsByMarket(tickets = []) {
  const map = new Map();

  tickets.forEach((t) => {
    const marketId = t.marketId;
    if (!marketId) return;

    if (!map.has(marketId)) {
      map.set(marketId, {
        totalStake: 0,
        sharpStake: 0,
        publicStake: 0
      });
    }

    const entry = map.get(marketId);
    const stake = Number(t.stake || 0);
    entry.totalStake += stake;

    const seg = (t.customerSegment || "").toLowerCase();
    if (seg === "sharp" || seg === "vip") {
      entry.sharpStake += stake;
    } else {
      entry.publicStake += stake;
    }
  });

  return map;
}

// --------------------
// 3) تابع اصلی AOIE با STI و Logger
// --------------------

export function computeAoieScores({ match, markets, dataspin, tickets = [] }) {
  const W = loadWeights();

  const {
    tisScore = 50,
    tisPatternType = "neutral",
    nonEventPressureScore = 50,
    behaviorEntropyHome = 50,
    behaviorEntropyAway = 50,
    matchChaosIndex = 50,
    clubSfiHome = 50,
    clubSfiAway = 50
  } = dataspin || {};

  const avgSfi =
    (Number(clubSfiHome || 0) + Number(clubSfiAway || 0)) / 2 || 0;

  const avgBehaviorEntropy =
    (Number(behaviorEntropyHome || 0) + Number(behaviorEntropyAway || 0)) / 2 ||
    0;

  const neds = clampScore(
    nonEventPressureScore * 0.45 +
      tisScore * 0.25 +
      (100 - matchChaosIndex) * 0.15 +
      (100 - avgBehaviorEntropy) * 0.15
  );

  const ticketAggByMarket = aggregateTicketsByMarket(tickets);

  // -----------------------------
  // 4) محاسبه در سطح مارکت
  // -----------------------------
  const marketResults = markets.map((mkt) => {
    const stakes = mkt.stakes || {};
    const odds = mkt.odds || {};

    const stakeValues = Object.values(stakes)
      .map((v) => Number(v || 0))
      .filter((v) => !isNaN(v) && v >= 0);

    const totalStake = stakeValues.reduce((s, v) => s + v, 0);
    const maxStake = stakeValues.length ? Math.max(...stakeValues) : 0;
    const minStake = stakeValues.length ? Math.min(...stakeValues) : 0;
    const stakeSpread = maxStake - minStake;
    const concentration =
      totalStake > 0 ? (maxStake / totalStake) * 100 : 0;

    const ticketAgg = ticketAggByMarket.get(mkt.marketId) || {
      totalStake: 0,
      sharpStake: 0,
      publicStake: 0
    };

    const sharpPercent = safePercent(
      ticketAgg.sharpStake,
      ticketAgg.totalStake
    );
    const publicPercent = safePercent(
      ticketAgg.publicStake,
      ticketAgg.totalStake
    );

    const margin = estimateMargin(odds);

    const liabilityScore = clampScore(
      normalize(totalStake, 0, totalStake || 1) * 0.3 +
        (margin > 0 ? margin : 5) * 0.4 +
        sharpPercent * 0.3
    );

    const tpsBase =
      nonEventPressureScore * 0.3 +
      normalize(stakeSpread, 0, totalStake || 1) * 0.3 +
      avgSfi * 0.2 +
      sharpPercent * 0.2;
    const tps = clampScore(tpsBase);

    const tisMidness = 100 - Math.abs(tisScore - 50);
    const fpsBase =
      matchChaosIndex * 0.3 +
      concentration * 0.25 +
      tisMidness * 0.2 +
      publicPercent * 0.25;
    const fps = clampScore(fpsBase);

    const criBase =
      matchChaosIndex * 0.25 +
      tisScore * 0.25 +
      avgSfi * 0.3 +
      sharpPercent * 0.2;
    const cri = clampScore(criBase);

    const sriBase =
      tisScore * 0.4 +
      nonEventPressureScore * 0.3 +
      sharpPercent * 0.3;
    const sri = clampScore(sriBase);

    const aoFlags = [];
    if (cri > 85 || (tps > 80 && fps > 75)) {
      aoFlags.push("AO_LOCK");
    } else if (tps > 70 || fps > 70 || cri > 70) {
      aoFlags.push("AO_LIMIT");
    }
    if (sri > 70 && !aoFlags.includes("AO_LOCK")) {
      aoFlags.push("AO_WATCH");
    }

    const mrW = W.marketRisk;
    const marketRiskScore = clampScore(
      cri * (mrW.cri ?? 0.4) +
        tps * (mrW.tps ?? 0.25) +
        fps * (mrW.fps ?? 0.2) +
        liabilityScore * (mrW.liability ?? 0.15)
    );
    const marketRiskTier = riskTierFromScore(marketRiskScore);

    return {
      matchId: match?.matchId || null,
      marketId: mkt.marketId,
      marketCode: mkt.marketCode,
      line: mkt.line,
      tps,
      fps,
      cri,
      sri,
      aoFlags,
      totalStake: Number(totalStake.toFixed(2)),
      sharpPercent: Number(sharpPercent.toFixed(2)),
      publicPercent: Number(publicPercent.toFixed(2)),
      margin,
      liabilityScore,
      marketRiskScore,
      marketRiskTier
    };
  });

  // -----------------------------
  // 5) GDI و CMCI و Global Risk
  // -----------------------------
  let maxCri = 0;
  let maxTps = 0;
  let maxFps = 0;
  let maxSri = 0;

  const criVals = [];
  const tpsVals = [];
  const fpsVals = [];
  const sriVals = [];

  marketResults.forEach((m) => {
    criVals.push(m.cri);
    tpsVals.push(m.tps);
    fpsVals.push(m.fps);
    sriVals.push(m.sri);

    if (m.cri > maxCri) maxCri = m.cri;
    if (m.tps > maxTps) maxTps = m.tps;
    if (m.fps > maxFps) maxFps = m.fps;
    if (m.sri > maxSri) maxSri = m.sri;
  });

  const gW = W.gdi;
  const gdiBase =
    maxCri * (gW.cri ?? 0.4) +
    maxTps * (gW.tps ?? 0.3) +
    maxFps * (gW.fps ?? 0.2) +
    maxSri * (gW.sri ?? 0.1);
  const gdi = clampScore(gdiBase);

  const stdCri = simpleStd(criVals);
  const stdTps = simpleStd(tpsVals);
  const stdFps = simpleStd(fpsVals);
  const stdSri = simpleStd(sriVals);
  const avgStd = (stdCri + stdTps + stdFps + stdSri) / 4 || 0;
  const cmci = clampScore(100 - avgStd);
  const cmciInverse = 100 - cmci;

  const grW = W.globalRisk;
  const globalRiskScore = clampScore(
    gdi * (grW.gdi ?? 0.55) +
      neds * (grW.neds ?? 0.25) +
      cmciInverse * (grW.cmciInverse ?? 0.2)
  );
  const globalRiskTier = riskTierFromScore(globalRiskScore);

  // -----------------------------
  // 6) Anti-Outcome Signals
  // -----------------------------
  const antiOutcomeSignals = [];

  markets.forEach((mkt) => {
    const stakes = mkt.stakes || {};
    const odds = mkt.odds || {};

    const stakeValues = Object.values(stakes)
      .map((v) => Number(v || 0))
      .filter((v) => !isNaN(v) && v >= 0);
    const totalStake = stakeValues.reduce((s, v) => s + v, 0);

    const ticketAgg = ticketAggByMarket.get(mkt.marketId) || {
      totalStake: 0,
      sharpStake: 0,
      publicStake: 0
    };

    const sharpPercent = safePercent(
      ticketAgg.sharpStake,
      ticketAgg.totalStake
    );
    const publicPercent = safePercent(
      ticketAgg.publicStake,
      ticketAgg.totalStake
    );

    Object.keys(odds).forEach((selectionCode) => {
      const selStake = Number(stakes[selectionCode] || 0);
      const selStakeShare = safePercent(selStake, totalStake);

      const aW = W.aoProbability;
      let aoProbScore =
        tisScore * (aW.tisScore ?? 0.25) +
        nonEventPressureScore * (aW.nonEventPressureScore ?? 0.25) +
        matchChaosIndex * (aW.matchChaosIndex ?? 0.15) +
        avgSfi * (aW.avgSfi ?? 0.15) +
        neds * (aW.neds ?? 0.2);

      if (publicPercent > sharpPercent + 20 && selStakeShare > 40) {
        aoProbScore += aW.publicHeavyBoost ?? 10;
      }
      if (sharpPercent > publicPercent + 20 && selStakeShare > 40) {
        aoProbScore -= aW.sharpHeavyPenalty ?? 15;
      }

      aoProbScore = clampScore(aoProbScore);
      const aoProbability = Number((aoProbScore / 100).toFixed(4));

      const aoStability = clampScore(
        (100 - matchChaosIndex) * 0.4 +
          (100 - avgBehaviorEntropy) * 0.3 +
          (100 - Math.abs(tisScore - 50)) * 0.3
      );

      const aoBand = aoBandFromProbability(aoProbability);
      const confidenceBucket = confidenceBucketFromScore(aoStability);

      let statement;
      if (aoProbability >= 0.8) {
        statement = "highly_likely_not_to_happen";
      } else if (aoProbability >= 0.65) {
        statement = "likely_not_to_happen";
      } else if (aoProbability >= 0.55) {
        statement = "leans_not_to_happen";
      } else {
        statement = "uncertain";
      }

      let recommendedAction = "WATCH";
      if (aoProbability >= 0.75 && aoStability >= 60) {
        recommendedAction = "LOCK_OR_LIMIT";
      } else if (aoProbability >= 0.6) {
        recommendedAction = "LIMIT";
      }

      antiOutcomeSignals.push({
        matchId: match?.matchId || null,
        marketId: mkt.marketId,
        marketCode: mkt.marketCode,
        line: mkt.line,
        selectionCode,
        aoProbability,
        aoStability,
        aoBand,
        confidenceBucket,
        statement,
        recommendedAction,
        meta: {
          selStakeShare: Number(selStakeShare.toFixed(2)),
          sharpPercent: Number(sharpPercent.toFixed(2)),
          publicPercent: Number(publicPercent.toFixed(2))
        }
      });
    });
  });

  // -----------------------------
  // 7) ساخت نتیجه نهایی و Log
  // -----------------------------
  const result = {
    match: {
      matchId: match?.matchId || null,
      league: match?.league || null,
      kickoffTime: match?.kickoffTime || null
    },
    dataspinSummary: {
      tisScore,
      tisPatternType,
      nonEventPressureScore,
      behaviorEntropyHome,
      behaviorEntropyAway,
      matchChaosIndex,
      clubSfiHome,
      clubSfiAway
    },
    gdi,
    globalRisk: {
      gdi,
      neds,
      cmci,
      globalRiskScore,
      globalRiskTier
    },
    markets: marketResults,
    antiOutcomeSignals
  };

  // لاگ‌کردن این اجرا برای STI
  logAoieRun({
    input: { match, markets, dataspin, tickets },
    output: result,
    weightsVersion: 1
  });

  return result;
}
