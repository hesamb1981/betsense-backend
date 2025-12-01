// routes/metaRoutes.js
// META BEHAVIOR ENGINE – ROUTES

const express = require("express");
const router = express.Router();

const metaController = require("../controllers/metaController");

// -----------------------------
// HEALTH CHECK
// -----------------------------
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    engine: "Meta-Behavior",
    status: "Routes OK",
  });
});

// -----------------------------
// DEMO
// -----------------------------
router.get("/demo", metaController.demo);

// -----------------------------
// LIVE
// -----------------------------
router.get("/live", metaController.live);

module.exports = router;
