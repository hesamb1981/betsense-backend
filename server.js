// server.js  (BetSense Backend - Meta fixed)

const express = require("express");
const cors = require("cors");

// تمام روت‌های قبلی (NSI, RBS, Genius, Emotion, Fusion, Behavior, OrderBook, ...)
const routes = require("./routes");

// Meta Behavior Engine controller (DEMO + LIVE)
const metaController = require("./controllers/metaController");

const app = express();
const PORT = process.env.PORT || 10000;

// -------------------------
// Middleware اصلی
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Health اصلی بک‌اند
// -------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// -------------------------
// 1) META ROUTES – قبل از /api
// -------------------------

// DEMO: Meta Behavior Engine
app.get("/api/meta/demo", metaController.demo);

// LIVE: Meta Behavior Engine
app.get("/api/meta/live", metaController.live);

// -------------------------
// 2) روت‌های قبلی زیر /api
// -------------------------
//
// هر چیزی مثل:
//   /api/nsi/...
//   /api/rbs/...
//   /api/genius/...
//   /api/emotion/...
//   /api/fusion/...
//   /api/behavior/...
//   /api/orderbook/...
// همه از داخل ./routes مدیریت می‌شن.
app.use("/api", routes);

// -------------------------
// 3) 404 برای بقیه مسیرها
// -------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// -------------------------
// Start server
// -------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
