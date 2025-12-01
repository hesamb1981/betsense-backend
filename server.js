// server.js  (ESM Compatible)

import express from "express";
import cors from "cors";

import routes from "./routes/index.js";     // روت‌های قدیمی
import metaController from "./controllers/metaController.js";

const app = express();
const PORT = process.env.PORT || 10000;

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// Root health check
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// -------------------------
// OLD ROUTES (NSI, RBS, Genius, Emotion)
// -------------------------
app.use("/api", routes);

// -------------------------
// META BEHAVIOR – DIRECT
// -------------------------
app.get("/api/meta/demo", metaController.demo);
app.get("/api/meta/live", metaController.live);

// -------------------------
// 404
// -------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
