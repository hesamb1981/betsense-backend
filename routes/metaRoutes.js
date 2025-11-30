// betsense-backend/routes/metaRoutes.js
const express = require("express");
const router = express.Router();

const {
  runMetaDemo,
  runMetaLive,
} = require("../controllers/metaController");

// GET /meta/demo  یا /api/meta/demo
router.get("/demo", runMetaDemo);

// POST /meta/live  یا /api/meta/live
router.post("/live", runMetaLive);

module.exports = router;
