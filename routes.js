// routes.js  (ریشه‌ی پروژه - روتر اصلی)

const express = require("express");

// روترهای هر انجین
const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const geniusRoutes = require("./routes/geniusRoutes");
const metaRoutes = require("./routes/metaRoutes"); // متا جدید

const router = express.Router();

// Health ساده برای /api
router.get("/", (req, res) => {
  res.json({ ok: true, message: "BetSense API root" });
});

// NSI Engine -> /api/nsi/...
router.use("/nsi", nsiRoutes);

// RBS Engine -> /api/rbs/...
router.use("/rbs", rbsRoutes);

// Genius Engine -> /api/genius/...
router.use("/genius", geniusRoutes);

// Meta Behavior Engine -> /api/meta/...
router.use("/meta", metaRoutes);

module.exports = router;
