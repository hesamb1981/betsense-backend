export const debugAoie = (req, res) => {
  res.json({
    ok: true,
    message: "AOIE Debug Route Active",
    timestamp: new Date().toISOString(),
  });
};

export const runAoie = (req, res) => {
  try {
    const { matchId, market, odds } = req.body;

    // Basic validation
    if (!matchId || !market || !odds) {
      return res.status(400).json({
        ok: false,
        error: "Missing parameters: matchId, market, odds are required.",
      });
    }

    const { home, draw, away } = odds;

    // Implied probability calculations
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
      market,
      odds,
      impliedProbabilities: implied,
      normalizedProbabilities: normalized,
      meta: {
        processedAt: new Date().toISOString(),
        engine: "AOIE v1.0",
        success: true,
      },
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};
