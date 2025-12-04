import express from "express";
const router = express.Router();

// -------------------------------------------
// SUPER RISK CORE — HEALTH CHECK ENDPOINT
// -------------------------------------------
router.get("/super-risk-core", (req, res) => {
  res.json({
    ok: true,
    engine: "SUPER_RISK_CORE",
    message: "Super Risk Core route is online",
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------
// EXPORT ROUTER
// -------------------------------------------
export default router;
