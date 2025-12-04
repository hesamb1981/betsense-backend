import express from "express";

const router = express.Router();

// Health check route
router.get("/super-risk-core", (req, res) => {
  return res.json({
    ok: true,
    engine: "SUPER_RISK_CORE",
    message: "Super Risk Core route is online",
    timestamp: new Date().toISOString(),
  });
});

export default router;
