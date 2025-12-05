import express from "express";
const router = express.Router();

// تست اصلی اینتیلیجنس کور
router.get("/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE_TEST",
    message: "Test route /test/intelligence-core is working ✅",
    timestamp: new Date().toISOString()
  });
});

export default router;
