// engine/GeniusEngine.js
// Core logic for Genius Engine (backend version).
// This is a lightweight v0.1 implementation that converts odds into
// implied probabilities and derives a simple recommendation + confidence.

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const computeImpliedProbabilities = (odds) => {
  const oHome = safeNumber(odds.home);
  const oDraw = safeNumber(odds.draw);
  const oAway = safeNumber(odds.away);

  if (!oHome && !oDraw && !oAway) {
    return null;
  }

  const pHome = oHome ? 1 / oHome : 0;
  const pDraw = oDraw ? 1 / oDraw : 0;
  const pAway = oAway ? 1 / oAway : 0;

  const sum = pHome + pDraw + pAway || 1;

  return {
    home: pHome / sum,
    draw: pDraw / sum,
    away: pAway / sum,
  };
};

export const runGeniusEngine = (input) => {
  const { odds = {}, fixtureId, homeTeam, awayTeam } = input || {};

  const implied = computeImpliedProbabilities(odds);

  // If we have no usable odds, return informational mode.
  if (!implied) {
    return {
      mode: "info-only",
      recommendation: "HOLD",
      confidence: 0.2,
      notes: [
        "No valid odds supplied.",
        "Genius Engine is returning an informational HOLD state.",
      ],
      meta: {
        fixtureId: fixtureId || null,
        homeTeam: homeTeam || null,
        awayTeam: awayTeam || null,
      },
    };
  }

  // Basic shape metrics.
  const values = [implied.home, implied.draw, implied.away];
  const maxProb = Math.max(...values);
  const minProb = Math.min(...values);
  const spread = maxProb - minProb;

  let recommendation = "HOLD";
  const notes = [];

  // Determine dominant side
  let dominant = "home";
  if (implied.away > implied.home && implied.away > implied.draw) {
    dominant = "away";
  } else if (implied.draw > implied.home && implied.draw > implied.away) {
    dominant = "draw";
  }

  // Simple logic:
  // - if spread is small → market is tight → NO BET / HOLD
  // - if spread is moderate → lean BUY on dominant side
  // - if spread is high → strong BUY on dominant side
  if (spread < 0.07) {
    recommendation = "NO_BET";
    notes.push("Tight market profile – probabilities are clustered.");
  } else if (spread < 0.14) {
    recommendation = dominant === "draw" ? "HOLD" : `LEAN_${dominant.toUpperCase()}`;
    notes.push("Moderate edge – lean towards the dominant side.");
  } else {
    if (dominant === "draw") {
      recommendation = "HOLD";
      notes.push("High uncertainty – draw is dominant, keep risk light.");
    } else {
      recommendation = `BUY_${dominant.toUpperCase()}`;
      notes.push("Strong edge on dominant side based on implied probability spread.");
    }
  }

  // Confidence derived from spread, capped into 0–1.
  const baseConfidence = clamp(spread * 3.2, 0.05, 0.96);

  // Basic risk tags.
  if (spread < 0.07) {
    notes.push("Risk profile: high noise, low differentiation.");
  } else if (spread < 0.14) {
    notes.push("Risk profile: balanced with defined tilt.");
  } else {
    notes.push("Risk profile: aggressive with clear skew.");
  }

  return {
    mode: "live-v0.1",
    recommendation,
    confidence: baseConfidence,
    notes,
    meta: {
      fixtureId: fixtureId || null,
      homeTeam: homeTeam || null,
      awayTeam: awayTeam || null,
      implied,
      rawOdds: odds,
    },
  };
};
