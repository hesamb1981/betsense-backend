// routes/superRiskRoutes.js
// Ultra Risk Core – Execution Route v1.0

const express = require("express");
const router = express.Router();

const {
  runUltraRiskCore,
} = require("../engines/super/ultra-risk-core/ultraRiskCoreEngine");

// POST: execute the engine with payload
router.post("/super/ultra-risk/run", (req, res) => {
  try {
    const payload = req.body || {};
    const result = runUltraRiskCore(payload);

    return res.json({
      ok: true,
      engine: "ULTRA_RISK_CORE",
      result,
    });
  } catch (err) {
    console.error("Ultra Risk Core Error:", err);
    return res.status(500).json({
      ok: false,
      error: "Ultra Risk Core crashed",
    });
  }
});

module.exports = router;
