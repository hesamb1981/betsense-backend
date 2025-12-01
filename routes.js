// routes.js  (ROOT of betsense-backend)

const express = require("express");
const router = express.Router();

// ===== زیرروت‌های قبلی =====
const dataspineRoutes = require("./routes/dataspineRoutes");
const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const geniusRoutes = require("./routes/geniusRoutes");
const emotionRoutes = require("./routes/emotionRoutes");

// ===== متا =====
const metaRoutes = require("./routes/metaRoutes");

// هرکدوم از این روترها، خودشون مسیر خودشون رو تعریف می‌کنن
router.use("/", dataspineRoutes);
router.use("/", nsiRoutes);
router.use("/", rbsRoutes);
router.use("/", geniusRoutes);
router.use("/", emotionRoutes);

// متا
router.use("/", metaRoutes);

module.exports = router;
