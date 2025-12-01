// routes.js
// تجمیع تمام روت‌های API (NSI, RBS, Genius, Meta و ...)

const express = require("express");

const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const geniusRoutes = require("./routes/geniusRoutes");
const metaRoutes = require("./routes/metaRoutes");

const router = express.Router();

// Health ساده برای /api
router.get("/health", (req, res) => {
  res.json({ ok: true, api: "BetSense API OK" });
});

// هر انجین زیر خودش
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);
router.use("/genius", geniusRoutes);
router.use("/meta", metaRoutes);

module.exports = router;
