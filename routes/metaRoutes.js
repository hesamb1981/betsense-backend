// routes/metaRoutes.js
// Meta Behavior Engine routes (CommonJS)

const express = require("express");
const metaController = require("../controllers/metaController");

const router = express.Router();

// Health check مخصوص متا
router.get("/health", (req, res) => {
  return res.json({
    ok: true,
    engine: "Meta-Behavior",
    status: "meta routes ok",
  });
});

// DEMO – برای تست از مرورگر (GET)
router.get("/demo", metaController.demo);

// LIVE – برای تست از مرورگر (GET)
router.get("/live", metaController.live);

module.exports = router;
