// routes/metaRoutes.js

const express = require("express");
const router = express.Router();
const {
  handleMetaDemo,
  handleMetaLive,
} = require("../controllers/metaController");

// هم GET و هم POST رو می‌گیریم که از هر دو طرف کار کنه

// /api/meta-demo
router.all("/meta-demo", handleMetaDemo);

// /api/meta-live
router.all("/meta-live", handleMetaLive);

module.exports = router;
