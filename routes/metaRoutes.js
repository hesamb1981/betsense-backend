// routes.js
// Main API router for BetSense backend (CommonJS)

const express = require("express");

const geniusRoutes = require("./routes/geniusRoutes");
const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const metaRoutes = require("./routes/metaRoutes");

const router = express.Router();

// یک هلت‌چک کلی برای /api
router.get("/health", (req, res) => {
  return res.json({
    ok: true,
    service: "BetSense Backend API",
    version: "1.0",
  });
});

// --------- ENGINE ROUTES ---------

// Genius / Fusion یا هرچی که این روت هندل می‌کند
router.use("/genius", geniusRoutes);

// NSI Engine
router.use("/nsi", nsiRoutes);

// RBS Engine
router.use("/rbs", rbsRoutes);

// META Behavior Engine (Option D)
router.use("/meta", metaRoutes);

module.exports = router;
