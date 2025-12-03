// aoie/aoieEngine.js
// --------------------
// BetSense AOIE - Anti-Outcome Intelligence Engine (Bet Shops Edition)
// نسخه تقویت‌شده: شامل محاسبه GDI / TPS / FPS / CRI / SRI
// + سیگنال‌های Anti-Outcome در سطح هر انتخاب (selection)

// --------------------
// 1) کمک‌تابع‌ها (Utilities)
// --------------------

/**
 * عدد را بین 0 و 100 محدود می‌کند.
 */
function clampScore(value) {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Number(value.toFixed(2));
}

/**
 * محاسبه درصد امن (جلوگیری از تقسیم بر صفر)
 */
function safePercent(part, total) {
  if (!total || total === 0) return 0;
  return (part / total) * 100;
}

/**
 * نرمال‌سازی عدد به بازه 0 تا 100
 */
function normalize(value, min, max) {
  if (max === min) return 0;
  const v = (value - min) / (max - min);
  return clampScore(v * 100);
}

// --------------------
// 2) تحلیل تیکت‌ها برای کشف شارپ / پابلیک
// --------------------

/**
 * tickets = [
 *   {
 *     ticketId: "T1",
 *     time: "2025-01-05T17:55:00Z",
 *     marketId: "MKT-OU-2_5",
 *     selection: "OVER",
 *     stake: 20000,
 *     customerSegment: "vip" | "sharp" | "public"
 *   }
 * ]
 */
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
 * @param {Object} input.match            - اطلاعات کلی مسابقه
 * @param {Object[]} input.markets        - آرایه مارکت‌ها برای این مسابقه
 * @param {Object} input.dataspin         - فیچرهای مخصوص DataSpin (TIS, NEM, BES, SFI)
 * @param {Object[]} input.tickets        - تیکت‌های اخیر برای این مسابقه (اختیاری)
 */
export function computeAoieScores({ match, markets, dataspin, tickets = [] }) {
  // 1) دیتای DataSpin (اگر نباشد، مقدار پیش‌فرض می‌گذاریم)
  const {
    tisScore = 50,              // Temporal Inversion Signature
    tisPatternType = "neutral",
    nonEventPressureScore = 50, // NEM
    behaviorEntropyHome = 50,   // BES home
    behaviorEntropyAway = 50,   // BES away
    matchChaosIndex = 50,       // مجموع هرج‌ومرج رفتاری
    clubSfiHome = 50,           // SFI home
    clubSfiAway = 50            // SFI away
  } = dataspin || {};

  const avgSfi =
    (Number(clubSfiHome || 0) + Number(clubSfiAway || 0)) / 2 || 0;

  const avgBehaviorEntropy =
    (Number(behaviorEntropyHome || 0) + Number(behaviorEntropyAway || 0)) / 2 ||
    0;

  // 2) تحلیل تیکت‌ها برای کشف فشار شارپ / پابلیک
  const ticketAggByMarket = aggregateTicketsByMarket(tickets);

  // 3) محاسبه امتیازها برای هر مارکت
  const marketResults = markets.map((mkt) => {
    const stakes = mkt.stakes || {};
    const odds = mkt.odds || {};

    const stakeValues = Object.values(stakes)
      .map(Number)
      .filter((v) => !isNaN(v));

    const totalStake = stakeValues.reduce((sum, v) => sum + v, 0);
    const maxStake = stakeValues.length ? Math.max(...stakeValues) : 0;
    const minStake = stakeValues.length ? Math.min(...stakeValues) : 0;
    const stakeSpread = maxStake - minStake;
    const concentration =
      totalStake > 0 ? (maxStake / totalStake) * 100 : 0; // % تمرکز روی قوی‌ترین outcome

    // داده تیکت‌ها برای این مارکت
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

    // -----------------------------
    // Trap Pattern Score (TPS)
    // -----------------------------
    // non-event + تمرکز استیک + SFI + فشار شارپ
    const tpsBase =
      nonEventPressureScore * 0.3 +
      normalize(stakeSpread, 0, totalStake || 1) * 0.3 +
      avgSfi * 0.2 +
      sharpPercent * 0.2;

    const tps = clampScore(tpsBase);

    // -----------------------------
    // False Pressure Score (FPS)
    // -----------------------------
    // chaos + تمرکز استیک + (mid TIS) + فشار پابلیک
    const tisMidness = 100 - Math.abs(tisScore - 50); // هرچه به 50 نزدیک‌تر، بالاتر
    const fpsBase =
      matchChaosIndex * 0.3 +
      concentration * 0.25 +
      tisMidness * 0.2 +
      publicPercent * 0.25;

    const fps = clampScore(fpsBase);

    // -----------------------------
    // Collapse Risk Index (CRI)
    // -----------------------------
    // chaos + TIS + SFI + شارپ
    const criBase =
      matchChaosIndex * 0.25 +
      tisScore * 0.25 +
      avgSfi * 0.3 +
      sharpPercent * 0.2;

    const cri = clampScore(criBase);

    // -----------------------------
    // Sharp Route Intensity (SRI)
    // -----------------------------
    // TIS + non-event + sharp-percent
    const sriBase =
      tisScore * 0.4 +
      nonEventPressureScore * 0.3 +
      sharpPercent * 0.3;

    const sri = clampScore(sriBase);

    // -----------------------------
    // AO Flags (تصمیم نهایی انجین برای این مارکت)
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

    // در آینده می‌توان AO_HEDGE هم اضافه کرد.

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
      publicPercent: Number(publicPercent.toFixed(2))
    };
  });

  // -----------------------------
  // 4) محاسبه GDI (Global Danger Index) برای کل مسابقه
  // -----------------------------
  let maxCri = 0;
  let maxTps = 0;
  let maxFps = 0;
  let maxSri = 0;

  marketResults.forEach((m) => {
    if (m.cri > maxCri) maxCri = m.cri;
    if (m.tps > maxTps) maxTps = m.tps;
    if (m.fps > maxFps) maxFps = m.fps;
    if (m.sri > maxSri) maxSri = m.sri;
  });

  const gdiBase =
    maxCri * 0.4 + maxTps * 0.3 + maxFps * 0.2 + maxSri * 0.1;
  const gdi = clampScore(gdiBase);

  // -----------------------------
  // 5) Anti-Outcome Signals (در سطح انتخاب‌ها)
  // -----------------------------
  const antiOutcomeSignals = [];

  markets.forEach((mkt) => {
    const stakes = mkt.stakes || {};
    const odds = mkt.odds || {};
    const stakeValues = Object.values(stakes)
      .map(Number)
      .filter((v) => !isNaN(v));
    const totalStake = stakeValues.reduce((sum, v) => sum + v, 0);

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

      // پایه AO براساس TIS + non-event + chaos + SFI
      let aoProb =
        tisScore * 0.25 +
        nonEventPressureScore * 0.25 +
        matchChaosIndex * 0.2 +
        avgSfi * 0.3;

      // اگر فشار اصلی از پابلیک باشد (نه شارپ)، احتمال این که outcome "نیاید" بیشتر می‌شود
      if (publicPercent > sharpPercent + 20 && selStakeShare > 40) {
        aoProb += 10;
      }

      // اگر بیشتر استیک از طرف شارپ‌هاست، احتمال فِید کردن outcome کمتر می‌شود
      if (sharpPercent > publicPercent + 20 && selStakeShare > 40) {
        aoProb -= 15;
      }

      // نهایی‌سازی و تبدیل به 0-1
      aoProb = clampScore(aoProb);
      const aoProbability = Number((aoProb / 100).toFixed(4));

      // ثبات سیگنال (stability) – وابسته به chaos + SFI
      const aoStability = clampScore(
        (100 - matchChaosIndex) * 0.4 + (100 - avgBehaviorEntropy) * 0.3 + (100 - Math.abs(tisScore - 50)) * 0.3
      );

      const statementBase =
        aoProb >= 70
          ? "likely_not_to_happen"
          : aoProb >= 55
          ? "leans_not_to_happen"
          : "uncertain";

      // انتخاب اکشن توصیه‌ای
      let recommendedAction = "WATCH";
      if (aoProb >= 75 && aoStability >= 60) {
        recommendedAction = "LOCK_OR_LIMIT";
      } else if (aoProb >= 60) {
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
        statement: statementBase,
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
  // 6) خروجی نهایی AOIE برای این مسابقه
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
    gdi,
    markets: marketResults,
    antiOutcomeSignals
  };
}
