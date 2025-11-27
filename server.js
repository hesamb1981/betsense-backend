// server.js
// BetSense backend – Genius + Emotion Engines (v0.1)

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

import { logRequest, sendSuccess, sendError } from "./utils/index.js";
import { runGeniusEngine } from "./engine/GeniusEngine.js";

const app = express();

app.use(cors());
app.use(express.json());

// -------------------------------------
// Root
// -------------------------------------
app.get("/", (req, res) => {
  res.send("BetSense backend is running ✅");
});

// -------------------------------------
// GENIUS ENGINE
// -------------------------------------

// Health check (GET)
app.get("/api/genius/health", geniusHealth);

// Main analyze endpoint (GET with query params)
app.get("/api/genius/analyze", geniusAnalyze);

// Extra endpoint for current UI button (POST with JSON body)
app.post("/api/genius/run", async (req, res) => {
  try {
    logRequest(req);

    const {
      fixture_id,
      fixture,
      home_team,
      homeTeam,
      away_team,
      awayTeam,
      odds_home,
      oddsHome,
      odds_draw,
      oddsDraw,
      odds_away,
      oddsAway,
    } = req.body || {};

    const input = {
      fixtureId: fixture_id || fixture || null,
      homeTeam: home_team || homeTeam || null,
      awayTeam: away_team || awayTeam || null,
      odds: {
        home: odds_home
          ? Number(odds_home)
          : oddsHome
          ? Number(oddsHome)
          : null,
        draw: odds_draw
          ? Number(odds_draw)
          : oddsDraw
          ? Number(oddsDraw)
          : null,
        away: odds_away
          ? Number(odds_away)
          : oddsAway
          ? Number(oddsAway)
          : null,
      },
    };

    const result = runGeniusEngine(input);

    return sendSuccess(res, {
      engine: "GeniusEngine",
      mode: result.mode,
      input,
      result,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// -------------------------------------
// EMOTION ENGINE
// -------------------------------------

// Health check (GET)
app.get("/api/emotion/health", emotionHealth);

// Analyze endpoint (GET with query params)
app.get("/api/emotion/analyze", emotionAnalyze);

// -------------------------------------
// Fallback
// -------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// -------------------------------------
// Server listen
// -------------------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});

export default app;
