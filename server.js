// server.js
// BetSense Backend - CommonJS version with META routes wired

const express = require("express");
const cors = require("cors");

// روت‌های قدیمی (NSI, RBS, Genius, Emotion و ...)
// فرض می‌کنیم قبلاً داخل ./routes ایندکس شده‌اند
const routes = require("./routes");

// روت متا بیهیویر
const metaRoutes = require("./routes/metaRoutes");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health اصلی بک‌اند
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// تمام روت‌های قبلی زیر /api
app.use("/api", routes);

// META Behavior Engine زیر /api/meta
app.use("/api/meta", metaRoutes);

// 404 برای بقیه مسیرها
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// استارت سرور
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
