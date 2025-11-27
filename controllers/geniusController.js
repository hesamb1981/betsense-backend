// controllers/geniusController.js
// Controller for Genius Engine endpoints.

import { logRequest, sendSuccess, sendError } from "../utils/index.js";
import { runGeniusEngine } from "../engine/GeniusEngine.js";

// GET /api/genius/health
export const geniusHealth = (req, res) => {
  logRequest(req);

  return sendSuccess(res, {
    engine: "GeniusEngine",
    status: "online",
  });
};

// GET /api/genius/analyze
// v0.1 – wires HTTP request into GeniusEngine core logic.
export const geniusAnalyze = async (req, res) => {
  try {
    logRequest(req);

    const {
      fixtureId,
      homeTeam,
      awayTeam,
      oddsHome,
      oddsDraw,
      oddsAway,
    } = req.query;

    const input = {
      fixtureId: fixtureId || null,
      homeTeam: homeTeam || null,
      awayTeam: awayTeam || null,
      odds: {
        home: oddsHome ? Number(oddsHome) : null,
        draw: oddsDraw ? Number(oddsDraw) : null,
        away: oddsAway ? Number(oddsAway) : null,
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
};
