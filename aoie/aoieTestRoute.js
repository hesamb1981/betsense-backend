// aoie/aoieTestRoute.js
// --------------------------------------------
// این فایل یک Route آماده می‌سازد که با زدن
//   /api/aoie/test
// فایل testPayload.json را خوانده و AOIE را اجرا می‌کند.

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeAoieScores } from "./aoieEngine.js";

const router = express.Router();

// برای پیدا کردن مسیر پوشه aoie
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیر فایل testPayload.json
const payloadPath = path.join(__dirname, "testPayload.json");

// -------------------------------
//   GET /api/aoie/test
// -------------------------------
router.get("/test", (req, res) => {
  try {
    if (!fs.existsSync(payloadPath)) {
      return res.status(500).json({
        error: "testPayload.json پیدا نشد، لطفاً فایل وجود داشته باشد."
      });
    }

    // خواندن ورودی تست
    const raw = fs.readFileSync(payloadPath, "utf-8");
    const data = JSON.parse(raw);

    // اجرای AOIE
    const result = computeAoieScores(data);

    return res.json({
      ok: true,
      source: "testPayload.json",
      result
    });
  } catch (err) {
    console.error("AOIE Test Error:", err);
    return res.status(500).json({
      error: "خطا در اجرای تست AOIE",
      details: err.message
    });
  }
});

export default router;
