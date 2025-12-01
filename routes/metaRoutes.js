// routes/metaRoutes.js
// CommonJS version – برای backend فعلی BetSense

const express = require("express");
const metaController = require("../controllers/metaController");

const router = express.Router();

// Health (اگر بعداً خواستی تست سلامت هم داشته باشی)
router.get("/health", metaController.health || ((req, res) => {
  return res.json({
    ok: true,
    engine: "Meta-Behavior",
    status: "HEALTHY (routes/metaRoutes.js)",
  });
}));

// DEMO endpoint – برای تست دمو
router.get("/demo", metaController.demo);

// LIVE endpoint – برای تست لایو
router.get("/live", metaController.live);

module.exports = router;
