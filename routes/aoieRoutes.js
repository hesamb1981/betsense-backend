// routes/aoieRoutes.js

const express = require("express");
const aoieController = require("../controllers/aoieController");

const router = express.Router();

// Health-check برای AOIE روی بک‌اند اصلی
router.get("/aoie/test", aoieController.testAOIE);

// خروجی اصلی AOIE برای بتینگ‌شاپ‌ها (پری‌مچ/لایو)
router.get("/aoie/predict", aoieController.runAOIE);

// ⭐ نقطه‌ی Self-Training – هر بار صدا بخوره STI یک قدم خودش را آپدیت می‌کند
router.get("/aoie/train", aoieController.trainAOIE);

module.exports = router;
