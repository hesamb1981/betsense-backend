// routes.js
// Main router index for all engines

const express = require("express");

const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const geniusRoutes = require("./routes/geniusRoutes");
const emotionRoutes = require("./routes/emotionRoutes");
const metaRoutes = require("./routes/metaRoutes");
const dataspineRoutes = require("./routes/dataspineRoutes");

const router = express.Router();

// قبلی‌ها
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);
router.use("/genius", geniusRoutes);
router.use("/emotion", emotionRoutes);
router.use("/meta", metaRoutes);

// جدید – DataSpine
router.use("/dataspine", dataspineRoutes);

module.exports = router;
