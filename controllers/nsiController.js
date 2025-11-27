// controllers/nsiController.js
// Controller for Neuro-Situational Identity Engine (NSI Engine) · v0.1

import { logRequest, sendSuccess, sendError } from "../utils/index.js";
import { runNSIEngine } from "../engine/NSIEngine.js";

// GET /api/nsi/health
export const nsiHealth = (req, res) => {
  logRequest(req);

  return sendSuccess(res, {
    engine: "NSIEngine",
    status: "online",
  });
};

// GET /api/nsi/analyze
// Demo endpoint – wires HTTP query params into NSI Engine core logic.
export const nsiAnalyze = async (req, res) => {
  try {
    logRequest(req);

    const {
      fixtureId,
      team,
      opponent,
      minute,
      scoreDiff,
      venue,

      mustWin,
      knockout,
      derby,

      emotionIndex,
      xgMomentum,
      pressureIndex,
      behaviorDeviation,

      lastGoalMinutesAgo,
      lastCardMinutesAgo,
      lastVarMinutesAgo,
    } = req.query;

    const input = {
      fixtureId: fixtureId || null,
      team: team || null,
      opponent: opponent || null,
      minute: minute !== undefined ? Number(minute) : null,
      scoreDiff: scoreDiff !== undefined ? Number(scoreDiff) : null,
      venue: venue || null,
      context: {
        mustWin: mustWin === "true" || mustWin === "1",
        knockout: knockout === "true" || knockout === "1",
        derby: derby === "true" || derby === "1",
      },
      signals: {
        emotionIndex:
          emotionIndex !== undefined ? Number(emotionIndex) : null,
        xgMomentum:
          xgMomentum !== undefined ? Number(xgMomentum) : null,
        pressureIndex:
          pressureIndex !== undefined ? Number(pressureIndex) : null,
        behaviorDeviation:
          behaviorDeviation !== undefined ? Number(behaviorDeviation) : null,
      },
      triggers: {
        lastGoalMinutesAgo:
          lastGoalMinutesAgo !== undefined
            ? Number(lastGoalMinutesAgo)
            : null,
        lastCardMinutesAgo:
          lastCardMinutesAgo !== undefined
            ? Number(lastCardMinutesAgo)
            : null,
        lastVarMinutesAgo:
          lastVarMinutesAgo !== undefined ? Number(lastVarMinutesAgo) : null,
      },
    };

    const signature = runNSIEngine(input);

    return sendSuccess(res, {
      engine: "NSIEngine",
      mode: signature.mode,
      input,
      signature,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
