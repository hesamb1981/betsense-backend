import express from "express";
import {
  getTrinitySnapshot,
  getTrinityMemory,
  updateTrinityMemory
} from "../controllers/trinityCoreController.js";

const router = express.Router();

// Health ping for Trinity Core layer
router.get("/trinity-core/health", (req, res) => {
  return res.json({
    ok: true,
    layer: "TRINITY_CORE",
    message: "Trinity Core v1.0 online ✅",
    components: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    timestamp: new Date().toISOString()
  });
});

// Snapshot endpoint (?mode=simulation / ?mode=live)
router.get("/trinity-core/snapshot", getTrinitySnapshot);

// Memory state viewer
router.get("/trinity-core/memory", getTrinityMemory);

// Memory update (اصلی – با POST برای evolve واقعی)
router.post("/trinity-core/memory/update", updateTrinityMemory);

// Helper برای تست با مرورگر (GET + ?error=0.2)
router.get("/trinity-core/memory/update", (req, res) => {
  req.body = { error: Number(req.query.error || 0.1) };
  return updateTrinityMemory(req, res);
});

export default router;
