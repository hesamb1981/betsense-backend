export const pingUltraRisk = (req, res) => {
  res.json({
    ok: true,
    engine: "Ultra Risk Core",
    status: "online",
    timestamp: new Date().toISOString(),
  });
};

export const runUltraRisk = (req, res) => {
  try {
    const { matchId, odds } = req.body;

    if (!matchId || !odds) {
      return res.status(400).json({
        ok: false,
        error: "matchId and odds are required",
      });
    }

    const { home, draw, away } = odds;

    const implied = {
      home: home ? (1 / home).toFixed(4) : null,
      draw: draw ? (1 / draw).toFixed(4) : null,
      away: away ? (1 / away).toFixed(4) : null,
    };

    const sum =
      (implied.home ? +implied.home : 0) +
      (implied.draw ? +implied.draw : 0) +
      (implied.away ? +implied.away : 0);

    const normalized = {
      home: (implied.home / sum).toFixed(4),
      draw: (implied.draw / sum).toFixed(4),
      away: (implied.away / sum).toFixed(4),
    };

    res.json({
      ok: true,
      matchId,
      odds,
      impliedProbabilities: implied,
      normalizedProbabilities: normalized,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};
