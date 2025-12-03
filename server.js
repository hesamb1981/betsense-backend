// server.js
// -------------------------------------
// BetSense Backend + AOIE Engine Mount
// این فایل:
// 1) بک‌اند اصلی را با routes.js ران می‌کند
// 2) AOIE را روی /api/aoie/* سوار می‌کند

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes.js";
import { computeAoieScores } from "./aoie/aoieEngine.js";

// -------------------------------------
// تنظیمات پایه
// -------------------------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// برای کار با مسیر فایل‌ها
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیر فایل تست AOIE
const aoiePayloadPath = path.join(__dirname, "aoie", "testPayload.json");

// -------------------------------------
// هلت‌چک اصلی بک‌اند
// -------------------------------------
app.get("/", (req, res) => {
  return res.json({
    ok: true,
    status: "Backend Running"
  });
});

// -------------------------------------
// مسیرهای AOIE
// -------------------------------------

// هلت‌چک AOIE
app.get("/api/aoie/health", (req, res) => {
  return res.json({
    ok: true,
    message: "AOIE Engine mounted on main backend ✔️"
  });
});

// تست اصلی AOIE با استفاده از testPayload.json
app.get("/api/aoie/test", (req, res) => {
  try {
    if (!fs.existsSync(aoiePayloadPath)) {
      return res.status(500).json({
        error: "فایل aoie/testPayload.json پیدا نشد."
      });
    }

    const raw = fs.readFileSync(aoiePayloadPath, "utf-8");
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

// -------------------------------------
// باقی routeهای قدیمی (از routes.js)
// -------------------------------------
app.use("/", routes);

// -------------------------------------
// استارت سرور
// -------------------------------------
app.listen(PORT, () => {
  console.log(`BetSense Backend + AOIE listening on port ${PORT}`);
});
