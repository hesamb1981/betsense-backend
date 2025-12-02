// betsense-backend/routes/dataspineRoutes.js
import express from "express";

const router = express.Router();

// Health check برای DataSpine
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    engine: "DataSpine",
    message: "DataSpine health OK",
  });
});

// تست ساده‌ی analyze (فعلاً دمو)
router.post("/analyze", (req, res) => {
  const { matchId } = req.body || {};

  res.json({
    ok: true,
    engine: "DataSpine",
    mode: "analyze-demo",
    received: {
      matchId: matchId || null,
    },
  });
});

export default router;
