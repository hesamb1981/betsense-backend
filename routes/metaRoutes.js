// routes/metaRoutes.js
// Routes for Meta Behavior Engine

const express = require("express");
const metaController = require("../controllers/metaController");

const router = express.Router();

// Demo endpoint
router.get("/demo", metaController.demo);

// Live endpoint (placeholder فعلی)
router.get("/live", metaController.live);

module.exports = router;
