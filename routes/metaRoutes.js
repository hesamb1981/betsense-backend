// src/routes/metaRoutes.js
import express from "express";
import metaController from "../controllers/metaController.js";

const router = express.Router();

// Health check – برای تست سلامت Meta Behavior Engine
router.get("/health", metaController.health);

// تحلیل اصلی متا (تایم‌لاین واقعی که از UI یا سیستم میاد)
router.post("/analyze", metaController.analyze);

// دمو Option D – برای تست سریع با نمونه‌ی پیش‌فرض
router.post("/demo", metaController.demo);

export default router;
