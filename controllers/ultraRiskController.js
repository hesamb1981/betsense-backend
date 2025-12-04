// controllers/ultraRiskController.js

export const ultraRiskPing = (req, res) => {
  return res.json({
    ok: true,
    engine: "ULTRA_RISK_CORE",
    status: "online",
    message: "Ultra Risk Core controller active",
    timestamp: new Date().toISOString(),
  });
};

// =========================
//   SAMPLE RISK ENGINE
//   (initial minimal version)
// =========================

export const ultraRiskProcess = (req, res) => {
  try {
    const { odds } = req.body;

    if (!odds) {
      return res.status(400).json({
        ok: false,
        error: "Missing odds input",
      });
    }

    // --- Minimal calculation (will evolve into full engine) ---
    const impliedHome = 1 / odds.home;
    const impliedDraw = 1 / odds.draw;
    const impliedAway = 1 / odds.away;

    const total = impliedHome + impliedDraw + impliedAway;

    const normalized = {
      home: (impliedHome / total).toFixed(4),
      draw: (impliedDraw / total).toFixed(4),
      away: (impliedAway / total).toFixed(4),
    };

    return res.json({
      ok: true,
      engine: "ULTRA_RISK_CORE",
      input: odds,
      normalizedProbabilities: normalized,
      processedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Risk engine internal error",
    });
  }
};
