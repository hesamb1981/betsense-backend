import express from "express";
import { runUltraRiskCore } from "../engines/super/ultra-risk-core/ultraRiskCoreEngine.js";

const router = express.Router();

/**
 * Debug route – برای تست سریع اینکه روت فعال است یا نه
 */
router.get("/debug", (req, res) => {
  res.json({
    ok: true,
    status: "Ultra Risk Route Active",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Run Ultra Risk Engine
 * توجه: حتماً باید POST باشد
 */
router.post("/run", (req, res) => {
  try {
    const payload = req.body || {};

    const result = runUltraRiskCore(payload);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

export default router;
