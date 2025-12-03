// routes/aoieRoutes.js

import express from "express";
// همه خروجی‌های aoieController را به صورت namespace می‌گیریم
import * as aoieController from "../controllers/aoieController.js";

const router = express.Router();

// یک تابع کمکی برای پیدا کردن هندلر با چند اسم احتمالی
function pickHandler(...names) {
  for (const name of names) {
    if (typeof aoieController[name] === "function") {
      return aoieController[name];
    }
  }
  return null;
}

// سعی می‌کنیم اسم‌های مختلفی که ممکن است برای فانکشن‌ها گذاشته باشیم را پوشش بدهیم
const debugHandler =
  pickHandler("debugAOIE", "aoieDebug", "debug") ||
  ((req, res) => {
    return res
      .status(500)
      .json({ ok: false, error: "AOIE debug handler not found" });
  });

const predictHandler =
  pickHandler("predictAOIE", "aoiePredict", "predict", "runAOIEPredict") ||
  ((req, res) => {
    return res
      .status(500)
      .json({ ok: false, error: "AOIE predict handler not found" });
  });

const trainHandler =
  pickHandler("trainAOIE", "aoieTrain", "train", "runAOIETrain") ||
  ((req, res) => {
    return res
      .status(500)
      .json({ ok: false, error: "AOIE train handler not found" });
  });

// ----------------------
// Routes
// ----------------------

// تست سلامت AOIE
router.get("/debug", debugHandler);

// پیش‌بینی AOIE
router.post("/predict", predictHandler);

// ترین AOIE
router.post("/train", trainHandler);

export default router;
