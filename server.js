// server.js  (نسخه کامل جدید)

import express from "express";
import cors from "cors";

// اگر قبلاً routes.js داشتی، اینجا نگهش می‌داریم که چیزهای قبلی هم کار کنند
import router from "./routes.js";

// AOIE controller
import { aoieDebug, aoieRun } from "./controllers/aoieController.js";

const app = express();

// میدل‌ویرهای عمومی
app.use(cors());
app.use(express.json());

// ✅ روت سلامت اصلی
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// ✅ روت سلامت دوم (اگر لازم باشد)
app.get("/status", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// ✅ اینجا مستقیماً AOIE را روی app ثبت می‌کنیم
app.get("/aoie/debug", aoieDebug);
app.get("/aoie/run", aoieRun);

// ✅ سایر روت‌هایی که قبلاً در routes.js داشتی
app.use("/", router);

// پورت
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});

export default app;
