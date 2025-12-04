// routes/superRiskRoutes.js
// SUPER RISK CORE – orchestrator for Ultra engines

import express from "express";

const router = express.Router();

// ─────────────────────────────────────────────
// 1) ساده‌ترین تست سلامت
//    GET /super/super-risk-core
// ─────────────────────────────────────────────
router.get("/super/super-risk-core", (req, res) => {
  res.json({
    ok: true,
    engine: "SUPER_RISK_CORE",
    message: "Super Risk Core route is online",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// 2) پینگ اختصاصی
//    GET /super/super-risk-core/ping
// ─────────────────────────────────────────────
router.get("/super/super-risk-core/ping", (req, res) => {
  res.json({
    ok: true,
    engine: "SUPER_RISK_CORE",
    status: "PING_OK",
    note: "Super Risk Core ping endpoint is alive",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// 3) دموی اولیه – در آینده اینجا ترکیب سه Ultra Core می‌آید
//    POST /super/super-risk-core/demo
// ─────────────────────────────────────────────
router.post("/super/super-risk-core/demo", (req, res) => {
  const payload = req.body || {};

  res.json({
    ok: true,
    engine: "SUPER_RISK_CORE",
    mode: "DEMO",
    aggregatedSignal: {
      // اینها فقط دمو هستن؛ بعداً وصل می‌کنیم به سه انجین واقعی
      globalRiskBand: "DYNAMIC-MID",
      confidence: 0.88,
      components: {
        ultraRiskCore: "CONNECTED_DEMO",
        ultraMomentumCore: "CONNECTED_DEMO",
        ultraFusionCore: "CONNECTED_DEMO",
      },
    },
    meta: {
      note: "Super Risk Core demo response – wiring OK.",
      receivedPayloadPreview: payload,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
