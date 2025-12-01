// server.js - BetSense Backend (META fixed)

// --------------------
// Imports
// --------------------
const express = require("express");
const cors = require("cors");

// روت‌های قدیمی (NSI, RBS, Genius, Emotion و بقیه)
const routes = require("./routes");

// کنترلر متا
const metaController = require("./controllers/metaController");

// --------------------
// App setup
// --------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// --------------------
// Health root
// --------------------
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// --------------------
// META BEHAVIOR – مستقیم روی سرور
// مهم: قبل از app.use("/api", routes)
// --------------------

// DEMO (GET برای تست از مرورگر)
app.get("/api/meta/demo", metaController.demo);

// LIVE (GET برای تست از مرورگر، فعلاً نسخه ساده)
app.get("/api/meta/live", metaController.live);

// --------------------
// بقیه APIها زیر /api  (NSI, RBS, Genius, Emotion, Fusion, OrderBook, ...)
// --------------------
app.use("/api", routes);

// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
