import express from "express";

const router = express.Router();

/**
 * Test endpoint for Intelligence Core
 * Final URL:
 *   https://betsense-backend.onrender.com/test/intelligence-core
 */
router.get("/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE_TEST",
    message: "Test route /test/intelligence-core is working ✅",
    timestamp: new Date().toISOString()
  });
});

export default router;
