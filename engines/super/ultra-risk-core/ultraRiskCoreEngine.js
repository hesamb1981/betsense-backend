// Ultra Risk Core Engine v1.0.0
// BetSense Super Engine #1 – High-precision risk engine for betting shops
// این انجین فعلاً روی ریسک‌اسکور و استیبیلیتی تمرکز دارد و بعداً با
// یادگیری خودکار (self-train) و اتصال به دیتابیس تقویت می‌شود.

//
// 1) Helpers
//

/**
 * نرمال‌سازی مقدار به بازه 0 تا 1
 */
function normalize(value, min, max) {
  if (value === null || value === undefined) return 0;
  if (max === min) return 0.5;
  const v = (value - min) / (max - min);
  const clamped = Math.max(0, Math.min(1, v));
  return Number(clamped.toFixed(4));
}

/**
 * ساخت یک شیء وزن پیش‌فرض برای مارکت‌ها
 * در نسخه‌های بعدی از فایل وزن‌ها (self-train) خوانده می‌شود.
 */
function getDefaultWeights() {
  return {
    bias: 0, // بعداً می‌تواند توسط یادگیری خودکار آپدیت شود
    weights: {
      "*": {
        liability: 0.35,
        sharps: 0.3,
        movement: 0.2,
        exposure: 0.15,
      },
    },
  };
}

/**
 * انتخاب وزن مناسب برای مارکت
 */
function pickWeights(weightsData, marketCode) {
  if (!weightsData || !weightsData.weights) {
    return {
      liability: 0.35,
      sharps: 0.3,
      movement: 0.2,
      exposure: 0.15,
    };
  }

  return (
    weightsData.weights[marketCode] ||
    weightsData.weights["*"] || {
      liability: 0.35,
      sharps: 0.3,
      movement: 0.2,
      exposure: 0.15,
    }
  );
}

/**
 * محاسبه ریسک برای یک مارکت تکی
 */
function scoreSingleMarket(marketInput, runtimeConfig) {
  const weightsData = runtimeConfig.weightsData;
  const baseWeights = pickWeights(weightsData, marketInput.marketCode);

  const {
    baseLiability = 0, // کل پول نشسته روی این سِلکشن
    sharpActivity = 0, // فعالیت کانتر شارپ‌ها (0–100)
    priceMovement = 0, // تغییر نسبت به اوپن (مثبت/منفی)
    exposure = 0, // سهم این مارکت از کل کتاب (0–1)
  } = marketInput;

  // نرمال‌سازی شاخص‌ها
  const liabilityScore = normalize(
    baseLiability,
    0,
    runtimeConfig.maxLiability
  );
  const sharpsScore = normalize(sharpActivity, 0, 100);
  const movementScore = normalize(Math.abs(priceMovement), 0, 0.25);
  const exposureScore = normalize(exposure, 0, 1);

  // ترکیب با وزن‌ها
  const rawRisk =
    baseWeights.liability * liabilityScore +
    baseWeights.sharps * sharpsScore +
    baseWeights.movement * movementScore +
    baseWeights.exposure * exposureScore +
    (weightsData.bias || 0);

  const risk = Math.max(0, Math.min(1, rawRisk));
  const stability = 1 - risk * 0.65;

  const riskPercent = Number((risk * 100).toFixed(2));
  const stabilityPercent = Number((stability * 100).toFixed(2));

  let riskBand = "LOW";
  if (riskPercent >= 66) riskBand = "HIGH";
  else if (riskPercent >= 33) riskBand = "MEDIUM";

  const recommendedAction =
    riskBand === "HIGH"
      ? "LIMIT"
      : riskBand === "MEDIUM"
      ? "MONITOR"
      : "SAFE";

  const statement =
    riskBand === "HIGH"
      ? "critical_risk_to_book"
      : riskBand === "MEDIUM"
      ? "elevated_risk_to_book"
      : "within_normal_risk";

  return {
    riskPercent,
    stabilityPercent,
    riskBand,
    recommendedAction,
    statement,
    components: {
      liabilityScore,
      sharpsScore,
      movementScore,
      exposureScore,
    },
  };
}

//
// 2) Main engine function
//

/**
 * ورودی استاندارد Ultra Risk Core
 *
 * payload = {
 *   matchId: "ARS-TOT-2025-ULTRA",
 *   matchInfo: {
 *     home: "Arsenal",
 *     away: "Tottenham",
 *     competition: "Premier League",
 *     kickOff: "2025-05-12T19:30:00Z"
 *   },
 *   maxLiability: 500000,
 *   markets: [
 *     {
 *       marketCode: "1X2",
 *       selectionCode: "HOME",
 *       baseLiability: 190000,
 *       sharpActivity: 68,
 *       priceMovement: -0.12,
 *       exposure: 0.78
 *     },
 *     ...
 *   ]
 * }
 */

export function runUltraRiskCore(payload = {}) {
  const weightsData = getDefaultWeights();

  const runtimeConfig = {
    weightsData,
    maxLiability: payload.maxLiability || 500000,
  };

  const matchInfo = payload.matchInfo || {};

  const marketsInput = Array.isArray(payload.markets) ? payload.markets : [];

  const markets = marketsInput.map((mkt) => {
    const scored = scoreSingleMarket(mkt, runtimeConfig);

    return {
      matchId: payload.matchId || matchInfo.id || null,
      marketCode: mkt.marketCode,
      selectionCode: mkt.selectionCode,
      baseLiability: mkt.baseLiability,
      sharpActivity: mkt.sharpActivity,
      priceMovement: mkt.priceMovement,
      exposure: mkt.exposure,
      riskScore: scored.riskPercent,
      stabilityScore: scored.stabilityPercent,
      riskBand: scored.riskBand,
      recommendedAction: scored.recommendedAction,
      statement: scored.statement,
      components: scored.components,
    };
  });

  let highestRisk = 0;
  markets.forEach((m) => {
    if (m.riskScore > highestRisk) highestRisk = m.riskScore;
  });

  let globalBand = "LOW";
  if (highestRisk >= 66) globalBand = "HIGH";
  else if (highestRisk >= 33) globalBand = "MEDIUM";

  const statusText =
    globalBand === "HIGH"
      ? "CRITICAL – tighten limits immediately and review exposure."
      : globalBand === "MEDIUM"
      ? "ELEVATED – monitor closely and consider selective limit tightening."
      : "CALM – book is operating within normal risk boundaries.";

  return {
    ok: true,
    engine: "Ultra Risk Core",
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    match: {
      id: payload.matchId || matchInfo.id || null,
      home: matchInfo.home || null,
      away: matchInfo.away || null,
      competition: matchInfo.competition || null,
      kickOff: matchInfo.kickOff || null,
    },
    riskSummary: {
      highestRisk,
      band: globalBand,
      statusText,
    },
    markets,
  };
}
