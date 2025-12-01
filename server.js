// server.js
// BetSense Backend – NSI / RBS / Meta and others

const express = require("express");
const cors = require("cors");

// روت‌های قدیمی (NSI, RBS, Genius, Emotion و ...)
const routes = require("./routes");

// روت مستقل Meta Behavior Engine
const metaRoutes = require("./routes/metaRoutes");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check اصلی
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// -----------------------------
// META BEHAVIOR – باید قبل از /api عمومی بیاد
// -----------------------------
app.use("/api/meta", metaRoutes);

// -----------------------------
// سایر روت‌ها (NSI, RBS, Genius, Emotion, Fusion, Behavior, RBS, ...)
// همه زیر /api
// -----------------------------
app.use("/api", routes);

// 404 برای بقیه مسیرها
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
