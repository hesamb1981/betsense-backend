// betsense-backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ---------------------------
// Health check
// ---------------------------
app.get("/", (req, res) => {
  return res.json({ ok: true, status: "Backend Running" });
});

// ---------------------------
// Routes
// ---------------------------
const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const geniusRoutes = require("./routes/geniusRoutes");
const metaRoutes = require("./routes/metaRoutes");
// اگر Emotion هم داشتی:
let emotionRoutes;
try {
  emotionRoutes = require("./routes/emotionRoutes");
} catch (e) {
  emotionRoutes = null;
}

// بدون /api
app.use("/nsi", nsiRoutes);
app.use("/rbs", rbsRoutes);
app.use("/genius", geniusRoutes);
if (emotionRoutes) app.use("/emotion", emotionRoutes);
app.use("/meta", metaRoutes);

// با /api  (برای اینکه هر دو استایل قبلی و جدید کار کنند)
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/genius", geniusRoutes);
if (emotionRoutes) app.use("/api/emotion", emotionRoutes);
app.use("/api/meta", metaRoutes);

// ---------------------------
// 404 handler
// ---------------------------
app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
