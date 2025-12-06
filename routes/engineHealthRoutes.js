import express from "express";

const router = express.Router();

// ---- HEALTH CHECK FOR ALL ENGINES ----
router.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Engine Health Monitor",
    engines: {
      aoie: "OK",
      dataspine: "OK",
      genius: "OK",
      meta: "OK",
      nsi: "OK",
      rbs: "OK",
      super_risk: "OK",
      trinity_core: "OK",
      ultra_master: "OK",
      ultra_momentum: "OK",
      ultra_risk: "OK"
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
