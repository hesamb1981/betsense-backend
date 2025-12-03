// sti/sti.trainer.js
// ---------------------------------------------
// Trainer برای AOIE + STI
// این ماژول وزن‌ها را از sti.weights.json می‌خواند
// و بر اساس correctnessScore آن‌ها را کمی اصلاح می‌کند.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEIGHTS_FILE = path.join(__dirname, "sti.weights.json");

// وزن‌های پیش‌فرض در صورت نبودن فایل
const defaultWeights = {
  version: 1,
  updatedAt: null,
  weights: {
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
    }
  },
  learning: {
    maxStep: 0.05,
    minWeight: 0.05,
    maxWeight: 0.6
  }
};

function loadCurrentWeights() {
  try {
    if (!fs.existsSync(WEIGHTS_FILE)) {
      return { ...defaultWeights };
    }
    const raw = fs.readFileSync(WEIGHTS_FILE, "utf-8");
    const json = JSON.parse(raw);

    // یک مرج ساده برای اطمینان از کامل بودن ساختار
    return {
      version: json.version ?? 1,
      updatedAt: json.updatedAt ?? null,
      weights: {
        gdi: { ...defaultWeights.weights.gdi, ...(json.weights?.gdi || {}) },
        marketRisk: {
          ...defaultWeights.weights.marketRisk,
          ...(json.weights?.marketRisk || {})
        },
        globalRisk: {
          ...defaultWeights.weights.globalRisk,
          ...(json.weights?.globalRisk || {})
        },
        aoProbability: {
          ...defaultWeights.weights.aoProbability,
          ...(json.weights?.aoProbability || {})
        }
      },
      learning: {
        ...defaultWeights.learning,
        ...(json.learning || {})
      }
    };
  } catch (err) {
    console.error("STI Trainer: error loading weights, using defaults:", err);
    return { ...defaultWeights };
  }
}

function saveWeights(config) {
  const toSave = {
    version: config.version,
    updatedAt: config.updatedAt,
    weights: config.weights,
    learning: config.learning
  };

  fs.writeFileSync(WEIGHTS_FILE, JSON.stringify(toSave, null, 2), "utf-8");
}

// تابع کمکی برای clamp کردن وزن‌ها
function clampWeight(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return Number(value.toFixed(4));
}

/**
 * trainAoieSti
 * @param {Object} params
 * @param {string} params.matchId - آی‌دی بازی که براش نتیجه داریم (برای لاگ فقط)
 * @param {number} params.correctnessScore - بین 0 و 1
 *        1 = عملکرد عالی AOIE
 *        0.5 = خنثی
 *        0 = عملکرد خیلی بد AOIE
 *
 * خروجی: آبجکت شامل وزن‌های جدید و نسخه جدید
 */
export function trainAoieSti({ matchId, correctnessScore }) {
  try {
    let score = Number(correctnessScore);
    if (isNaN(score)) score = 0.5;
    if (score < 0) score = 0;
    if (score > 1) score = 1;

    const config = loadCurrentWeights();
    const { learning } = config;
    const { maxStep, minWeight, maxWeight } = learning;

    // اگر دور و بر 0.5 باشد، تغییر زیادی نمی‌دهیم
    const deviation = Math.abs(score - 0.5) * 2; // 0..1
    if (deviation === 0) {
      return {
        ok: true,
        updated: false,
        reason: "neutral_score",
        version: config.version
      };
    }

    const direction = score > 0.5 ? 1 : -1; // خوب بود → تقویت، بد بود → کاهش
    const step = maxStep * deviation;

    // فقط روی گروه aoProbability تمرکز می‌کنیم (مغز Anti-Outcome)
    const ao = { ...config.weights.aoProbability };

    const keysToTune = [
      "tisScore",
      "nonEventPressureScore",
      "matchChaosIndex",
      "avgSfi",
      "neds"
    ];

    keysToTune.forEach((key) => {
      const current = Number(ao[key] ?? 0);
      const boostedStep =
        key === "nonEventPressureScore" || key === "neds"
          ? step * 1.1
          : step * 0.9;

      const updated = current + direction * boostedStep;
      ao[key] = clampWeight(updated, minWeight, maxWeight);
    });

    // publicHeavyBoost و sharpHeavyPenalty را هم کمی تنظیم می‌کنیم
    const boost = Number(ao.publicHeavyBoost ?? 10);
    const penalty = Number(ao.sharpHeavyPenalty ?? 15);

    const boostUpdated =
      boost + direction * step * (score > 0.5 ? 0.5 : -0.5);
    const penaltyUpdated =
      penalty - direction * step * (score > 0.5 ? 0.5 : -0.5);

    ao.publicHeavyBoost = Number(boostUpdated.toFixed(2));
    ao.sharpHeavyPenalty = Number(penaltyUpdated.toFixed(2));

    config.weights.aoProbability = ao;
    config.version = (config.version || 1) + 1;
    config.updatedAt = new Date().toISOString();

    saveWeights(config);

    return {
      ok: true,
      updated: true,
      matchId: matchId || null,
      version: config.version,
      updatedAt: config.updatedAt,
      aoProbability: config.weights.aoProbability
    };
  } catch (err) {
    console.error("STI Trainer: training error:", err);
    return {
      ok: false,
      error: "training_failed"
    };
  }
}
