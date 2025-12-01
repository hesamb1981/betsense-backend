// routes/metaRoutes.js
// Routes for Meta Behavior Engine (CommonJS)

const express = require("express");
const metaController = require("../controllers/metaController");

const router = express.Router();

// Health برای متا
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    engine: "Meta-Behavior",
    status: "Meta routes ready",
  });
});

// DEMO endpoint – GET /api/meta/demo
router.get("/demo", metaController.demo);

// LIVE endpoint – GET /api/meta/live
router.get("/live", metaController.live);

module.exports = router;
