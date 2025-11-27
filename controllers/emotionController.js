// controllers/emotionController.js
// Controller for Emotion Engine endpoints (v0.1).

import { logRequest, sendSuccess, sendError } from "../utils/index.js";
import { runEmotionEngine } from "../engine/EmotionEngine.js";

// GET /api/emotion/health
export const emotionHealth = (req, res) => {
  logRequest(req);

  return sendSuccess(res, {
    engine: "EmotionEngine",
    status: "online",
  });
};

// GET /api/emotion/analyze
// v0.1 – wires HTTP query into EmotionEngine core logic.
export const emotionAnalyze = async (req, res) => {
  try {
    logRequest(req);

    const {
      fixtureId,
      homeTeam,
      awayTeam,
      crowdHeat,
      pressureSwing,
      shockRisk,
    } = req.query;

    const input = {
      fixtureId: fixtureId || null,
      homeTeam: homeTeam || null,
      awayTeam: awayTeam || null,
      metrics: {
        crowdHeat: crowdHeat !== undefined ? Number(crowdHeat) : null,
        pressureSwing:
          pressureSwing !== undefined ? Number(pressureSwing) : null,
        shockRisk: shockRisk !== undefined ? Number(shockRisk) : null,
      },
    };

    const result = runEmotionEngine(input);

    return sendSuccess(res, {
      engine: "EmotionEngine",
      mode: result.mode,
      input,
      result,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
