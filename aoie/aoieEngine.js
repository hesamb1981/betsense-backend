// aoie/aoieEngine.js
// --------------------
// BetSense AOIE - Anti-Outcome Intelligence Engine (Bet Shops Edition)
// این فایل مغز اصلی محاسبات AOIE است.
// فعلاً نسخه ساده / اسکلت است، ولی ساختار نهایی را دارد
// و بعداً فقط کافیست منطق داخلی را هوشمندتر کنیم.

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
 * نرمال‌سازی یک مقدار به بازه 0 تا 100
 */
function normalize(value, min, max) {
  if (max === min) return 0;
  const v = (value - min) / (max - min);
  return clampScore(v * 100);
}

// --------------------
// 2) تابع اصلی محاسبه AOIE
// --------------------

/**
 * ورودی اصلی AOIE
 *
 * @param {Object} input
 * @param {Object} input.match            - اطلاعات کلی مسابقه
 * @param {Object[]} input.markets        - آرایه مارکت‌ها برای این مسابقه
 * @param {Object} input.dataspin         - فیچرهای مخصوص DataSpin (TIS, NEM, BES, SFI)
 * @param {Object[]} input.tickets        - تیکت‌های اخیر برای این مسابقه (اختیاری)
 *
 * ساختار پیشنهادی:
 *
 * match = {
 *   matchId: "M-ARS-TOT-2025-12-02",
 *   league: "EPL",
 *   kickoffTime: "2025-12-02T20:00:00Z"
 * }
 *
 * markets = [
 *   {
 *     marketId: "MKT-1X2-90",
 *     marketCode: "1X2",
 *     line: "FT",
 *     odds: { HOME: 2.10, DRAW: 3.40, AWAY: 3.50 },
 *     stakes: { HOME: 82000, DRAW: 15000, AWAY: 67000 }
 *   },
 *   {
 *     marketId: "MKT-OU-2_5",
 *     marketCode: "OU",
 *     line: "2.5",
 *     odds: { OVER: 1.90, UNDER: 1.95 },
 *     stakes: { OVER: 91000, UNDER: 22000 }
 *   }
 * ]
 *
 * dataspin = {
 *   tisScore: 78,
 *   tisPatternType: "late_flip",
 *   nonEventPressureScore: 65,
 *   behaviorEntropyHome: 52,
 *   behaviorEntropyAway: 61,
 *   matchChaosIndex: 58,
 *   clubSfiHome: 47,
 *   clubSfiAway: 72
 * }
 *
 * tickets = [ ... ]
 */
export function computeAoieScores({ match, markets, dataspin, tickets = [] }) {
  // 1) محاسبه یک سری متغیر کلی برای کل مسابقه
  const {
    tisScore = 50,
    nonEventPressureScore = 50,
    matchChaosIndex = 50,
    clubSfiHome = 50,
    clubSfiAway = 50
  } = dataspin || {};

  // شاخص شکنندگی میانگین دو تیم
  const avgSfi = (Number(clubSfiHome || 0) + Number(clubSfiAway || 0)) / 2 || 0;

  // 2) روی مارکت‌ها حلقه می‌زنیم و برای هر مارکت TPS/FPS/CRI/SRI را حساب می‌کنیم
  const marketResults = markets.map((mkt) => {
    const stakes = mkt.stakes || {};
    const odds = mkt.odds || {};

    const stakeValues = Object.values(stakes).map(Number).filter(v => !isNaN(v));
    const totalStake = stakeValues.reduce((sum, v) => sum + v, 0);

    const maxStake = stakeValues.length ? Math.max(...stakeValues) : 0;
    const minStake = stakeValues.length ? Math.min(...stakeValues) : 0;
    const stakeSpread = maxStake - minStake;

    // -----------------------------
    // Trap Pattern Score (TPS)
    // -----------------------------
    const tpsBase = (nonEventPressureScore * 0.4)
      + normalize(stakeSpread, 0, totalStake || 1) * 0.4
      + avgSfi * 0.2;

    const tps = clampScore(tpsBase);

    // -----------------------------
    // False Pressure Score (FPS)
    // -----------------------------
    const fpsBase = (matchChaosIndex * 0.4)
      + normalize(stakeSpread, 0, totalStake || 1) * 0.4
      + (100 - Math.abs(tisScore - 50)) * 0.2;

    const fps = clampScore(fpsBase);

    // -----------------------------
    // Collapse Risk Index (CRI)
    // -----------------------------
    const criBase = (matchChaosIndex * 0.3)
      + (tisScore * 0.3)
      + (avgSfi * 0.4);

    const cri = clampScore(criBase);

    // -----------------------------
    // Sharp Route Intensity (SRI)
    // -----------------------------
    const sriBase = (tisScore * 0.4)
      + (nonEventPressureScore * 0.3)
      + normalize(stakeSpread, 0, totalStake || 1) * 0.3;

    const sri = clampScore(sriBase);

    // -----------------------------
    // AO Flags
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
      totalStake: Number(totalStake.toFixed(2))
    };
  });

  // 3) محاسبه GDI (Global Danger Index) برای کل مسابقه
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

  const gdiBase = (maxCri * 0.4) + (maxTps * 0.3) + (maxFps * 0.2) + (maxSri * 0.1);
  const gdi = clampScore(gdiBase);

  // 4) خروجی نهایی AOIE برای این مسابقه
  return {
    match: {
      matchId: match?.matchId || null,
      league: match?.league || null,
      kickoffTime: match?.kickoffTime || null
    },
    dataspinSummary: {
      tisScore,
      nonEventPressureScore,
      matchChaosIndex,
      clubSfiHome,
      clubSfiAway
    },
    gdi,
    markets: marketResults,
    antiOutcomeSignals: []
  };
}
