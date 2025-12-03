// sti/sti.trainer.js
// ------------------------------------
// Self-Training Intelligence (STI) Trainer برای AOIE
// این ماژول:
//  - sti.weights.json را لود و سیو می‌کند
//  - وزن‌ها را بر اساس correctnessScore آپدیت می‌کند
//  - هم default export دارد، هم named export

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEIGHTS_PATH = path.join(__dirname, "sti.weights.json");

// اگر فایل خراب یا نبود، این حالت دیفالت را داریم
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

class AoieStiTrainer {
  constructor() {
    this.state = loadWeights();
  }

  refresh() {
    this.state = loadWeights();
  }

  getWeights() {
    if (!this.state) {
      this.state = loadWeights();
    }
    return {
      version: this.state.version,
      weights: this.state.weights
    };
  }

  /**
   * @param {Object} params
   * @param {string} params.matchId
   * @param {number} params.correctnessScore  عدد بین 0 و 1
   */
  train({ matchId, correctnessScore }) {
    const cleanScore =
      typeof correctnessScore === "number" && isFinite(correctnessScore)
        ? Math.min(1, Math.max(0, correctnessScore))
        : 0.5;

    const data = this.state || loadWeights();

    // اگر مدل بد کار کرده (score پایین) → delta مثبت (وزن‌ها تقویت شوند)
    // اگر خیلی خوب بوده → delta نزدیک صفر
    const delta = (0.5 - cleanScore) * 0.2; // رنج تقریبی -0.1 تا +0.1

    const newWeights = { ...data.weights };

    Object.keys(newWeights).forEach((key) => {
      const oldVal = Number(newWeights[key]) || 1.0;
      let updated = oldVal + delta;

      // محدود کردن برای جلوگیری از انفجار / صفر شدن
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
      history: [...data.history, historyItem].slice(-500) // فقط ۵۰۰ رکورد آخر
    };

    const saved = saveWeights(newData);

    if (saved) {
      this.state = newData;
      return {
        ok: true,
        version: newVersion,
        weights: newWeights,
        delta,
        lastUpdate: historyItem
      };
    } else {
      return {
        ok: false,
        error: "SAVE_FAILED",
        version: data.version,
        weights: data.weights
      };
    }
  }
}

const trainer = new AoieStiTrainer();

// ---------- named exports ----------
export function trainAoieSti(args) {
  return trainer.train(args);
}

export function getAoieStiWeights() {
  return trainer.getWeights();
}

// ---------- default export (برای aoieController فعلی) ----------
export default {
  train: trainer.train.bind(trainer),
  getWeights: trainer.getWeights.bind(trainer)
};
