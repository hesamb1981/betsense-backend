// routes/test/intelligenceTest.js
// Simple GET tester for Intelligence Core

import express from "express";

const router = express.Router();

// GET /test/intelligence-core
router.get("/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE_TEST",
    message: "Intelligence Core test endpoint is online",
    timestamp: new Date().toISOString(),
  });
});

export default router;
