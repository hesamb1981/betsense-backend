// server.js

const express = require("express");
const cors = require("cors");

// 👇 حتماً فایل routes.js (و نه پوشه routes/) را لود می‌کنیم
const routes = require("./routes.js");

const app = express();
const PORT = process.env.PORT || 10000;

// -----------------
// Middleware
// -----------------
app.use(cors());
app.use(express.json());

// Health check اصلی
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// تمام روت‌های API زیر /api
app.use("/api", routes);

// 404 برای هر مسیری که پیدا نشه
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
