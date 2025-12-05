// routes/trinityCoreRoutes.js
// Trinity Self-Evolving Core routes

import express from "express";
import {
  updateTrinityMemory,
  getTrinityMemoryState,
} from "../engine/trinityMemoryEngine.js";

const router = express.Router();

// ✅ وضعیت اصلی Trinity Core
router.get("/", (req, res) => {
  res.json({
    ok: true,
    layer: "TRINITY_CORE",
    message: "Trinity Core v1.0 online ✅",
    components: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    timestamp: new Date().toISOString(),
  });
});

// ✅ اسنپ‌شات Self-Evolving با حافظه داخلی
router.get("/snapshot", (req, res) => {
  const baseSnapshot = {
    ok: true,
    engine: "TRINITY_CORE",
    mode: "SIMULATION",

    // شاخص‌های اصلی (نمونه‌ی اولیه، بعداً به لایو وصل می‌شود)
    risk_index: 0.722,
    momentum_pulse: 0.79,
    fusion_confidence: 0.84,
    fusion_strength: 0.79,
    stability_index: 0.795,
    entropy_balance: 0.72,

    // کانتکست فعلی
    context: {
      matchPressure: 0.62,
      dataQuality: 0.82,
      volatility: 0.38,
    },

    // وزن‌های اولیه برای سه هسته
    weights: {
      risk: 0.36,
      momentum: 0.31,
      fusion: 0.33,
    },

    reinforcement_signal: 0.996,
    alerts: [],

    stats: {
      calls: 0,
      avgError: 0,
    },

    message: "Trinity Self-Evolving Core v1.0 snapshot",
    timestamp: new Date().toISOString(),
  };

  // ⬅️ این‌جا Core را به حافظه Self-Evolving وصل می‌کنیم
  const enrichedSnapshot = updateTrinityMemory(baseSnapshot);

  res.json(enrichedSnapshot);
});

// ✅ برای مانیتورینگ داخلی حافظه Trinity
router.get("/memory", (req, res) => {
  const state = getTrinityMemoryState();

  res.json({
    ok: true,
    layer: "TRINITY_CORE_MEMORY",
    state,
    timestamp: new Date().toISOString(),
  });
});

export default router;
