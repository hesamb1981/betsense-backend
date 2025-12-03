import express from "express";
import { analyzeAOIE } from "../controllers/aoieController.js";

const router = express.Router();

// تست سلامت
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "AOIE Test Route OK" });
});

// نقطه تحلیل اصلی
router.post("/analyze", analyzeAOIE);

export default router;
