// aoie/aoieRuntime.js
// AOIE Runtime – Super Tactical Intelligence for Betting Shops
// CommonJS version (compatible with current BetSense backend)

const fs = require("fs");
const path = require("path");

// مسیر وزن‌های STI (همون پوشه‌ای که قبلاً ساختیم)
const STI_WEIGHTS_PATH = path.join(__dirname, "..", "sti", "sti.weights.json");

// کش وزن‌ها تا هر بار از دیسک نخونیم
let cachedWeights = null;

function loadStiWeights() {
  if (cachedWeights) return cachedWeights;

  try {
    const raw = fs.readFileSync(STI_WEIGHTS_PATH, "utf8");
    const parsed = JSON.parse(raw);

    // اگر ساختار پایه نبود، یک ساختار پیش‌فرض بده
    if (!parsed || typeof parsed !== "object") {
      cachedWeights = {
        bias: 0,
        weights: {
          "*": { liability: 0.35, sharps: 0.3, movement: 0.2, exposure: 0.15 },
        },
      };
    } else {
      // اگر فقط لیست مقادیر ساده بود
      if (!parsed.weights) {
        cachedWeights = {
          bias: 0,
          weights: {
            "*": { liability: 0.35, sharps: 0.3, movement: 0.2, exposure: 0.15 },
          },
        };
      } else {
        cachedWeights = parsed;
      }
    }
  } catch (err) {
    console.error("[AOIE][STI] Failed to load weights, using defaults:", err);
    cachedWeights = {
      bias: 0,
      weights: {
        "*": { liability: 0.35, sharps: 0.3, movement: 0.2, exposure: 0.15 },
      },
    };
  }

  return cachedWeights;
}

// نرمال‌سازی مقدار بین ۰ و ۱
function normalize(value, min, max) {
  if (max === min) return 0.5;
  const v = (value - min) / (max - min);
  const clamped = Math.max(0, Math.min(1, v));
  return Number(clamped.toFixed(4));
}

// امتیازدهی یک مارکت تکی (مثلاً 1X2 HOME یا OU 2.5 OVER)
function scoreMarket(marketInput, runtimeConfig) {
  const weightsData = runtimeConfig.weightsData;
  const baseWeights =
    (weightsData.weights && weightsData.weights[marketInput.marketCode]) ||
    (weightsData.weights && weightsData.weights["*"]) || {
      liability: 0.35,
      sharps: 0.3,
      movement: 0.2,
      exposure: 0.15,
    };

  const {
    baseLiability = 0, // کل پولی که روی این گزینه نشسته
    sharpActivity = 0, // فعالیت کانتر شارپ‌ها
    priceMovement = 0, // تغییر قیمت نسبت به اوپن
    exposure = 0, // میزان اکسپوژر این مارکت نسبت به کتاب
  } = marketInput;

  // نرمال‌سازی شاخص‌ها
  const liabilityScore = normalize(baseLiability, 0, runtimeConfig.maxLiability);
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

  const recommendAction =
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
    recommendAction,
    statement,
    components: {
      liabilityScore,
      sharpsScore,
      movementScore,
      exposureScore,
    },
  };
}

// تابع اصلی که AOIE را روی یک پِی‌لود ورودی اجرا می‌کند
function runAOIEUniversal(payload) {
  const weightsData = loadStiWeights();

  const runtimeConfig = {
    weightsData,
    maxLiability: payload.maxLiability || 500000, // می‌تواند از طرف بتینگ‌شاپ تنظیم شود
  };

  const matchMeta = payload.match || {};
  const marketsInput = Array.isArray(payload.markets) ? payload.markets : [];

  const markets = marketsInput.map((mkt) => {
    const scored = scoreMarket(mkt, runtimeConfig);

    return {
      matchId: matchMeta.id || payload.matchId || null,
      marketCode: mkt.marketCode,
      selectionCode: mkt.selectionCode,
      baseLiability: mkt.baseLiability,
      sharpActivity: mkt.sharpActivity,
      priceMovement: mkt.priceMovement,
      exposure: mkt.exposure,
      riskScore: scored.riskPercent,
      stabilityScore: scored.stabilityPercent,
      riskBand: scored.riskBand,
      recommendedAction: scored.recommendAction,
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
    engine: "AOIE",
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    match: {
      id: matchMeta.id || payload.matchId || null,
      home: matchMeta.home || payload.homeTeam || null,
      away: matchMeta.away || payload.awayTeam || null,
      kickOff: matchMeta.kickOff || null,
      competition: matchMeta.competition || null,
    },
    riskSummary: {
      highestRisk,
      band: globalBand,
      statusText,
    },
    markets,
  };
}

// یک فیکسچر آماده برای تست با GET (بدون نیاز به بدنه POST)
function runAOIESampleFixture() {
  const samplePayload = {
    match: {
      id: "AOIE-DEMO-001",
      home: "AOIE United",
      away: "Sharps City",
      kickOff: "2025-01-05T17:30:00Z",
      competition: "BetSense Super League",
    },
    maxLiability: 500000,
    markets: [
      {
        marketCode: "1X2",
        selectionCode: "HOME",
        baseLiability: 190000,
        sharpActivity: 68,
        priceMovement: -0.12,
        exposure: 0.78,
      },
      {
        marketCode: "1X2",
        selectionCode: "DRAW",
        baseLiability: 80000,
        sharpActivity: 25,
        priceMovement: -0.03,
        exposure: 0.35,
      },
      {
        marketCode: "1X2",
        selectionCode: "AWAY",
        baseLiability: 95000,
        sharpActivity: 41,
        priceMovement: 0.07,
        exposure: 0.42,
      },
      {
        marketCode: "OU_2_5",
        selectionCode: "OVER",
        baseLiability: 120000,
        sharpActivity: 52,
        priceMovement: 0.09,
        exposure: 0.63,
      },
      {
        marketCode: "OU_2_5",
        selectionCode: "UNDER",
        baseLiability: 60000,
        sharpActivity: 18,
        priceMovement: -0.04,
        exposure: 0.29,
      },
    ],
  };

  return runAOIEUniversal(samplePayload);
}

module.exports = {
  runAOIEUniversal,
  runAOIESampleFixture,
};
