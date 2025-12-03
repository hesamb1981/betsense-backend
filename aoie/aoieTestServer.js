// aoie/aoieTestServer.js
// --------------------------------------------
// سرور تست AOIE (کاملاً مستقل)
// این سرور از aoieEngine و testPayload.json استفاده می‌کند
// و خروجی AOIE را روی یک آدرس ساده برمی‌گرداند.

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeAoieScores } from "./aoieEngine.js";

// تنظیمات اولیه مسیر
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیر فایل تست
const payloadPath = path.join(__dirname, "testPayload.json");

// ساخت اپ
const app = express();
const PORT = process.env.AOIE_TEST_PORT || 5051;

app.use(cors());
app.use(express.json());

// ساده‌ترین هلت‌چک
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "BetSense AOIE Test Server is running ✔️"
  });
});

// اندپوینت تست AOIE
app.get("/api/aoie/test", (req, res) => {
  try {
    if (!fs.existsSync(payloadPath)) {
      return res.status(500).json({
        error: "فایل aoie/testPayload.json پیدا نشد."
      });
    }

    const raw = fs.readFileSync(payloadPath, "utf-8");
    const data = JSON.parse(raw);

    const result = computeAoieScores(data);

    return res.json({
      ok: true,
      matchId: result.match?.matchId || null,
      gdi: result.gdi,
      markets: result.markets,
      antiOutcomeSignals: result.antiOutcomeSignals
    });
  } catch (err) {
    console.error("AOIE Test Error:", err);
    return res.status(500).json({
      error: "خطا در اجرای تست AOIE",
      details: err.message
    });
  }
});

// استارت سرور تست
app.listen(PORT, () => {
  console.log(`AOIE Test Server listening on port ${PORT}`);
});
