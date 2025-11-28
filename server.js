// server.js
// BetSense Backend – main entry
// این فایل:
//  - سرور Express را راه‌اندازی می‌کند
//  - NSI routes را وصل می‌کند
//  - RBS routes را وصل می‌کند

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// روت‌های NSI و RBS
import nsiRouter from "./routes/nsiRoutes.js";
import rbsRouter from "./routes/rbsRoutes.js";

dotenv.config();

const app = express();

// middlewareهای عمومی
app.use(cors());
app.use(express.json());

// تست ساده برای اطمینان از آنلاین بودن سرور
app.get("/", (req, res) => {
  res.send("BetSense Backend is running ✔️");
});

// -------------------------
// NSI ENGINE ROUTES
// آدرس‌ها:
//   GET  /api/nsi/health
//   GET  /api/nsi/analyze
//   POST /api/nsi/analyze
//   GET  /api/nsi/live
//   POST /api/nsi/live
// -------------------------
app.use("/api/nsi", nsiRouter);

// -------------------------
// RBS ENGINE ROUTES
// آدرس‌ها (طبق rbsRoutes.js):
//   POST /api/rbs/analyze
//   POST /api/rbs/batch
// -------------------------
app.use("/api/rbs", rbsRouter);

// پورت سرور
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
