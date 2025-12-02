// betsense-backend/routes/dataspineRoutes.js
import express from "express";
import {
  dataspineHealth,
  dataspineDemo,
  dataspineAnalyze,
} from "../controllers/dataspineController.js";

const router = express.Router();

// چک سلامت
router.get("/health", dataspineHealth);

// دموی ساده (GET)
router.get("/demo", dataspineDemo);

// نقطه‌ی analyze (فعلاً مثل دمو جواب می‌دهد)
router.post("/analyze", dataspineAnalyze);

export default router;
