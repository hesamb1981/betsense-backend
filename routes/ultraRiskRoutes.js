// routes/ultraRiskRoutes.js
// Ultra Risk Core routes (simple ping for now)

import express from "express";

const router = express.Router();

// تست سلامت Ultra Risk Core
router.get("/ping", (req, res) => {
  res.json({
    ok: true,
    engine: "ULTRA_RISK_CORE",
    message: "Ultra Risk Core route is online",
    timestamp: new Date().toISOString(),
  });
});

export default router;
