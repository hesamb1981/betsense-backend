// aoie/aoieEngine.js
// -------------------------------------
// BetSense AOIE - Anti-Outcome Intelligence Engine (Bet Shops Edition)
// نسخه تقویت‌شده: شامل
//  - GDI (Global Danger Index)
//  - NEDS (Non-Event Dominance Score)
//  - CMCI (Cross-Market Coherence Index)
//  - Market Risk Tier + Margin + Liability Score
//  - AO Signals با aoProbability + aoBand + confidenceBucket
// این فایل هیچ وابستگی خارجی ندارد و فقط از ورودی خودش استفاده می‌کند.

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

/**
 * برآورد مارجین بوک‌میکر از روی ضرایب
 * odds: { HOME: 2.05, DRAW: 3.4, AWAY: 3.7 }
 * خروجی: درصد مارجین (0-100)
 */
function estimateMargin(oddsObj = {}) {
  const invSum = Object.values(oddsObj)
    .map((o) => Number(o || 0))
    .filter((o) => o > 1e-9)
    .reduce((sum, o) => sum + 1 / o, 0);

  if (!invSum) return 0;
  // اگر مجموع معکوس‌ها = 1 → بدون مارجین
  // اگر > 1 → مارجین
  const margin = (invSum - 1) * 100;
  return margin < 0 ? 0 : Number(margin.toFixed(2));
}

/**
 * Tier بندی ریسک بر اساس عدد 0-100
 */
function riskTierFromScore(score) {
  if (score >= 85) return "BLACKOUT";
  if (score >= 70) return "DANGER_ZONE";
  if (score >= 55) return "WATCHLIST";
  return "SAFE";
}

/**
 * Bucket بندی اعتماد (Confidence)
 */
function confidenceBucketFromScore(stability) {
  if (stability >= 75) return "HIGH";
  if (stability >= 55) return "MEDIUM";
  return "LOW";
}

/**
 * Band بندی AO Probability
 */
function aoBandFromProbability(aoProb) {
  if (aoProb >= 0.85) return "EXTREME";
  if (aoProb >= 0.7) return "HIGH";
  if (aoProb >= 0.55) return "MEDIUM";
  return "LOW";
}

/**
 * محاسبه انحراف معیار ساده برای آرایه اعداد
 */
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

    const key = marketId;
    if (!map.has(key)) {
      map.set(key, {
        totalStake: 0,
        sharpStake: 0,
        publicStake: 0
      });
    }

    const entry = map.get(key);
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
// 3) تابع اصلی محاسبه AOIE
// --------------------

/**
 * ورودی اصلی AOIE
 *
 * @param {Object} input
 * @param {Object} input.match
 * @param {Object[]} input.markets
 * @param {Object} input.dataspin
 * @param {Object[]} input.tickets
 */
export function computeAoieScores({ match, markets, dataspin, tickets = [] }) {
  // --- DataSpin features (با پیش‌فرض‌های امن) ---
  const {
    tisScore = 50, // Temporal Inversion Signature (0-100)
    tisPatternType = "neutral",
    nonEventPressureScore = 50, // NEM
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

  // Non-Event Dominance Score (NEDS) - قدرت نیروهای غیروَقوعی
  const neds = clampScore(
    nonEventPressureScore * 0.45 +
      tisScore * 0.25 +
      (100 - matchChaosIndex) * 0.15 +
      (100 - avgBehaviorEntropy) * 0.15
  );

  // تحلیل تیکت‌ها
  const ticketAggByMarket = aggregateTicketsByMarket(tickets);

  // -----------------------------
  // 4) محاسبه امتیازها در سطح مارکت
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
      totalStake > 0 ? (maxStake / totalStake) * 100 : 0; // تمرکز استیک روی قوی‌ترین outcome

    // داده تیکت برای این مارکت
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

    // مارجین تخمینی بوک‌میکر
    const margin = estimateMargin(odds);

    // Liability Score: چقدر این مارکت در صورت اشتباه می‌تواند ضربه بزند
    const liabilityScore = clampScore(
      normalize(totalStake, 0, totalStake || 1) * 0.3 +
        (margin > 0 ? margin : 5) * 0.4 +
        sharpPercent * 0.3
    );

    // -----------------------------
    // Trap Pattern Score (TPS)
    // -----------------------------
    const tpsBase =
      nonEventPressureScore * 0.3 +
      normalize(stakeSpread, 0, totalStake || 1) * 0.3 +
      avgSfi * 0.2 +
      sharpPercent * 0.2;

    const tps = clampScore(tpsBase);

    // -----------------------------
    // False Pressure Score (FPS)
    // -----------------------------
    const tisMidness = 100 - Math.abs(tisScore - 50); // نزدیکی به حالت میانه
    const fpsBase =
      matchChaosIndex * 0.3 +
      concentration * 0.25 +
      tisMidness * 0.2 +
      publicPercent * 0.25;

    const fps = clampScore(fpsBase);

    // -----------------------------
    // Collapse Risk Index (CRI)
    // -----------------------------
    const criBase =
      matchChaosIndex * 0.25 +
      tisScore * 0.25 +
      avgSfi * 0.3 +
      sharpPercent * 0.2;

    const cri = clampScore(criBase);

    // -----------------------------
    // Sharp Route Intensity (SRI)
    // -----------------------------
    const sriBase =
      tisScore * 0.4 +
      nonEventPressureScore * 0.3 +
      sharpPercent * 0.3;

    const sri = clampScore(sriBase);

    // -----------------------------
    // AO Flags و Risk Tier
    // -----------------------------
    const aoFlags = [];

    if (cri > 85 || (tps > 80 && fps > 75)) {
      aoFlags.push("AO_LOCK");
    } else if (tps > 70 || fps > 70 || cri > 70) {
      aoFlags.push("AO_LIMIT");
    }

    if (sri > 70 && !aoFlags.includes("AO_LOCK")) {
      aoFlags.push("AO_WATCH");
    }

    const marketRiskScore = clampScore(
      cri * 0.4 + tps * 0.25 + fps * 0.2 + liabilityScore * 0.15
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
  // 5) GDI و CMCI در سطح مسابقه
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

  const gdiBase =
    maxCri * 0.4 + maxTps * 0.3 + maxFps * 0.2 + maxSri * 0.1;
  const gdi = clampScore(gdiBase);

  // CMCI: Cross-Market Coherence Index – یکپارچگی ریسک بین مارکت‌ها
  const stdCri = simpleStd(criVals);
  const stdTps = simpleStd(tpsVals);
  const stdFps = simpleStd(fpsVals);
  const stdSri = simpleStd(sriVals);

  const avgStd = (stdCri + stdTps + stdFps + stdSri) / 4 || 0;
  const cmci = clampScore(100 - avgStd); // هرچه std کمتر → انسجام بیشتر → CMCI بالاتر

  const globalRiskScore = clampScore(
    gdi * 0.55 + neds * 0.25 + (100 - cmci) * 0.2
  );
  const globalRiskTier = riskTierFromScore(globalRiskScore);

  // -----------------------------
  // 6) Anti-Outcome Signals در سطح انتخاب‌ها
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

      // AO Probability: احتمال این که این outcome خاص «اتفاق نیفتد»
      let aoProbScore =
        tisScore * 0.25 +
        nonEventPressureScore * 0.25 +
        matchChaosIndex * 0.15 +
        avgSfi * 0.15 +
        neds * 0.2;

      // اگر فشار پابلیک سنگین باشد و stake این selection زیاد باشد → احتمال نیامدنش بالاتر
      if (publicPercent > sharpPercent + 20 && selStakeShare > 40) {
        aoProbScore += 10;
      }

      // اگر فشار شارپ غالب باشد روی این selection → احتمال فِید کردن کاهش
      if (sharpPercent > publicPercent + 20 && selStakeShare > 40) {
        aoProbScore -= 15;
      }

      aoProbScore = clampScore(aoProbScore);
      const aoProbability = Number((aoProbScore / 100).toFixed(4));

      // ثبات سیگنال (Stability): بر اساس chaos + entropy + نزدیکی TIS به حالت میانه
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
        aoProbability, // 0.0000 - 1.0000
        aoStability,   // 0-100
        aoBand,        // LOW / MEDIUM / HIGH / EXTREME
        confidenceBucket, // LOW / MEDIUM / HIGH
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
  // 7) خروجی نهایی AOIE برای این مسابقه
  // -----------------------------
  return {
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
    // برای سازگاری با نسخه‌های قبلی همچنان gdi را روی ریشه برمی‌گردانیم
    gdi,
    // ماژول ریسک کلی برای ارائه به بت‌شاپ
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
}
