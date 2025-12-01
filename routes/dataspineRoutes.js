// betsense-backend/routes/dataspineRoutes.js
import express from "express";

const router = express.Router();

// تست ساده برای این‌که ببینیم بک‌اند و روت دیتاسپاین سالمه
router.get("/status", (req, res) => {
  res.json({
    ok: true,
    engine: "DataSpine",
    message: "DataSpine route is working",
  });
});

// این روت را بعداً می‌توانیم به متدهای واقعی DataSpineEngine وصل کنیم
router.post("/analyze", (req, res) => {
  // فقط برای تست
  res.json({
    ok: true,
    engine: "DataSpine",
    mode: "analyze-demo",
  });
});

export default router;
