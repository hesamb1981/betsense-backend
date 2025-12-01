// routes/metaRoutes.js
// Meta Behavior Engine routes – CommonJS version

const express = require("express");
const metaController = require("../controllers/metaController");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  return res.json({
    ok: true,
    engine: "Meta-Behavior",
    status: "healthy",
  });
});

// Demo endpoint – used by meta-demo.js
router.get("/demo", metaController.demo);

// Live endpoint – used by meta-live.js
router.get("/live", metaController.live);

module.exports = router;
