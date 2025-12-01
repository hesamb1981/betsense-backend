// server.js

const express = require("express");
const cors = require("cors");

const routes = require("./routes"); // روت‌های قدیمی (NSI, RBS, Genius, Emotion و ...)

const metaController = require("./controllers/metaController");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check اصلی
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// تمام روت‌های قبلی (NSI, RBS, Emotion, Genius) زیر /api
app.use("/api", routes);

// -----------------------------
// META BEHAVIOR – مستقیم روی سرور
// -----------------------------

// DEMO
app.get("/api/meta/demo", metaController.demo);

// LIVE
app.get("/api/meta/live", metaController.live);

// 404 برای بقیه مسیرهایی که پیدا نمی‌شن
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
