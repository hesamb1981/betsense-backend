// routes/trinityCoreRoutes.js
// TRINITY CORE v1.0 – BetSense Quantum Trinity Protocol (Ultra Enterprise)
// این روتر الان به مغز واقعی Trinity Self-Evolving Core وصل شده است.

import express from "express";
import { computeTrinitySnapshot } from "../engines/trinityCoreEngine.js";

const router = express.Router();

// ✅ Health check اصلی Trinity Core
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    layer: "TRINITY_CORE",
    message: "Trinity Core v1.0 online ✅",
    components: [
      "ULTRA_RISK_CORE",
      "ULTRA_MOMENTUM_CORE",
      "ULTRA_FUSION_CORE"
    ],
    timestamp: new Date().toISOString(),
  });
});

// ✅ Snapshot دمو – بدون ورودی، با context پیش‌فرض
router.get("/snapshot", (req, res) => {
  const snapshot = computeTrinitySnapshot({
    context: {
      matchPressure: 0.62,
      dataQuality: 0.82,
      volatility: 0.38,
    },
    history: [],
    ultraRisk: {
      risk_index: 0.71,
    },
    ultraMomentum: {
      momentum_pulse: 0.79,
    },
    ultraFusion: {
      fusion_confidence: 0.84,
    },
  });

  res.json(snapshot);
});

// ✅ Snapshot پیشرفته – با ورودی سفارشی (POST)
// می‌توانی بعداً از UI یا ابزار تست برای ارسال body استفاده کنی
router.post("/snapshot", (req, res) => {
  try {
    const {
      context = {},
      history = [],
      ultraRisk = null,
      ultraMomentum = null,
      ultraFusion = null,
    } = req.body || {};

    const snapshot = computeTrinitySnapshot({
      context,
      history,
      ultraRisk,
      ultraMomentum,
      ultraFusion,
    });

    res.json(snapshot);
  } catch (err) {
    console.error("[TRINITY_CORE] snapshot error:", err);
    res.status(500).json({
      ok: false,
      layer: "TRINITY_CORE",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
