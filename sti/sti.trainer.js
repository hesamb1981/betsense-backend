// sti/sti.trainer.js
// --------------------------
// Self-Training Intelligence (STI) Trainer for AOIE
// مسئول:
// - لود و سیو کردن sti.weights.json
// - آپدیت وزن‌ها بر اساس correctnessScore
// - برگرداندن نسخه جدید و وزن‌های جدید

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEIGHTS_PATH = path.join(__dirname, "sti.weights.json");

// اگر فایل وجود نداشت یا خراب بود، این ساختار دیفالت را برمی‌گردانیم
function getDefaultWeights() {
  return {
    version: 1,
    weights: {
      ao_base_weight: 1.0,
      market_confidence_weight: 1.0,
      risk_weight: 1.0,
      stability_weight: 1.0,
      sharpshare_weight: 1.0
    },
    history: []
  };
}

function loadWeights() {
  try {
    if (!fs.existsSync(WEIGHTS_PATH)) {
      return getDefaultWeights();
    }
    const raw = fs.readFileSync(WEIGHTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return getDefaultWeights();
    }
    if (!parsed.weights) {
      parsed.weights = getDefaultWeights().weights;
    }
    if (!Array.isArray(parsed.history)) {
      parsed.history = [];
    }
    if (typeof parsed.version !== "number") {
      parsed.version = 1;
    }
    return parsed;
  } catch (err) {
    console.error("STI Trainer: error loading weights:", err);
    return getDefaultWeights();
  }
}

function saveWeights(data) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(WEIGHTS_PATH, json, "utf8");
    return true;
  } catch (err) {
    console.error("STI Trainer: error saving weights:", err);
    return false;
  }
}

// --------------------------
// تابع اصلی آموزش AOIE
// --------------------------
export function trainAoieSti({ matchId, correctnessScore }) {
  const cleanScore =
    typeof correctnessScore === "number" && isFinite(correctnessScore)
      ? Math.min(1, Math.max(0, correctnessScore))
      : 0.5;

  const data = loadWeights();

  // جهت اصلاح:
  // اگر مدل بد کار کرده (score کم) → باید وزن‌ها را تقویت کنیم (delta مثبت)
  // اگر مدل خیلی خوب بوده (score بالا) → تغییر خیلی کم
  const delta = (0.5 - cleanScore) * 0.2; // رنج حدود -0.1 تا +0.1

  const newWeights = { ...data.weights };
  Object.keys(newWeights).forEach((key) => {
    const oldVal = Number(newWeights[key]) || 1.0;
    let updated = oldVal + delta;
    // محدودیت منطقی برای انفجار نکردن وزن‌ها
    if (updated < 0.1) updated = 0.1;
    if (updated > 5.0) updated = 5.0;
    newWeights[key] = Number(updated.toFixed(4));
  });

  const newVersion = (Number(data.version) || 1) + 1;

  const historyItem = {
    matchId: matchId || "UNKNOWN",
    correctnessScore: cleanScore,
    delta,
    appliedAt: new Date().toISOString()
  };

  const newData = {
    version: newVersion,
    weights: newWeights,
    history: [...data.history, historyItem].slice(-500) // حداکثر ۵۰۰ رکورد آخر
  };

  const saved = saveWeights(newData);

  return {
    ok: saved,
    version: newVersion,
    weights: newWeights,
    delta,
    lastUpdate: historyItem
  };
}

// برای آینده اگر خواستیم از بیرون وزن‌ها را ببینیم
export function getAoieStiWeights() {
  const data = loadWeights();
  return {
    version: data.version,
    weights: data.weights
  };
}
