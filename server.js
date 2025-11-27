// server.js
// BetSense backend – Genius + Emotion + NSI Engines

import express from "express";
import cors from "cors";

import {
  geniusHealth,
  geniusAnalyze,
} from "./controllers/geniusController.js";

import {
  emotionHealth,
  emotionAnalyze,
} from "./controllers/emotionController.js";

import nsiRouter from "./routes/nsiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("BetSense backend is running ✅");
});

// GENIUS ENGINE
app.get("/api/genius/health", geniusHealth);
app.get("/api/genius/analyze", geniusAnalyze);

// EMOTION ENGINE
app.get("/api/emotion/health", emotionHealth);
app.get("/api/emotion/analyze", emotionAnalyze);

// NSI ENGINE (router handles /health + /analyze)
app.use("/api/nsi", nsiRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});

export default app;
