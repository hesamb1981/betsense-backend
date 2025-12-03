// aoie/aoieServer.js
// ----------------------
// BetSense AOIE - Mini API Server for Betting Shops
// این فایل یک سرور کوچک Express است که مغز AOIE را
// از aoieEngine.js صدا می‌زند و خروجی را به صورت JSON برمی‌گرداند.
import aoieTestRoute from "./aoieTestRoute.js";
import express from "express";
import cors from "cors";
import { computeAoieScores } from "./aoieEngine.js";

const app = express();
const PORT = process.env.AOIE_PORT || 5050;

// ----- میدل‌ورها -----
app.use(cors());
app.use(express.json());

// ----- اندپوینت تست ساده -----
// برای این که فقط چک کنیم سرور بالا هست
app.get("/api/aoie/health", (req, res) => {
  res.json({ status: "ok", message: "BetSense AOIE Engine is alive ✔️" });
});

// ----- اندپوینت اصلی AOIE -----
// این همان جایی است که بتینگ‌شاپ JSON را می‌فرستد
// و AOIE برایش GDI / TPS / FPS / CRI / فلگ‌ها را حساب می‌کند.
app.post("/api/aoie/analyse", (req, res) => {
  try {
    const { match, markets, dataspin, tickets } = req.body || {};

    // بررسی ورودی
    if (!match || !markets || !Array.isArray(markets) || markets.length === 0) {
      return res.status(400).json({
        error: "برای محاسبه AOIE باید 'match' و حداقل یک 'market' ارسال شود."
      });
    }

    // صدا زدن مغز AOIE
    const result = computeAoieScores({
      match,
      markets,
      dataspin: dataspin || {},
      tickets: tickets || []
    });

    return res.json(result);
  } catch (err) {
    console.error("AOIE error:", err);
    return res.status(500).json({ error: "Internal AOIE error" });
  }
});

// ----- استارت سرور -----
// بعداً اگر روی سرور واقعی اجرا شود، از همین‌جا بالا می‌آید.
app.use("/api/aoie", aoieTestRoute);
app.listen(PORT, () => {
  console.log(`BetSense AOIE Engine listening on port ${PORT}`);
});

export default app;
