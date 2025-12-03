import express from "express";

// -------------------------
// AOIE CONTROLLER FUNCTIONS
// -------------------------

// فقط برای تست وضعیت
export const debugAoie = (req, res) => {
  return res.json({
    ok: true,
    message: "AOIE Debug Route Active",
    timestamp: new Date().toISOString(),
  });
};

// پردازش اوودها و ساخت خروجی تحلیلی
export const runAoie = (req, res) => {
  try {
    const { matchId, market, odds } = req.body || {};

    // چک کردن ورودی
    if (
      !matchId ||
      !market ||
      !odds ||
      typeof odds.home !== "number" ||
      typeof odds.draw !== "number" ||
      typeof odds.away !== "number"
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Invalid payload. Expected { matchId, market, odds: { home, draw, away } }",
      });
    }

    // محاسبه احتمال ضمنی از روی اوودها
    const rawHome = 1 / odds.home;
    const rawDraw = 1 / odds.draw;
    const rawAway = 1 / odds.away;

    const overround = rawHome + rawDraw + rawAway;

    const normHome = rawHome / overround;
    const normDraw = rawDraw / overround;
    const normAway = rawAway / overround;

    const implied = {
      home: +(normHome * 100).toFixed(2),
      draw: +(normDraw * 100).toFixed(2),
      away: +(normAway * 100).toFixed(2),
      overround: +((overround - 1) * 100).toFixed(2),
    };

    // یک اسکور ساده برای پایداری مارکت
    let stabilityTier;
    if (implied.overround < 3) {
      stabilityTier = "HIGH";
    } else if (implied.overround < 6) {
      stabilityTier = "MEDIUM";
    } else {
      stabilityTier = "LOW";
    }

    const response = {
      ok: true,
      matchId,
      market,
      inputOdds: odds,
      impliedProbabilities: implied,
      meta: {
        engine: "AOIE v1.0",
        stabilityTier,
        createdAt: new Date().toISOString(),
      },
    };

    return res.json(response);
  } catch (err) {
    console.error("AOIE run error:", err);
    return res.status(500).json({
      ok: false,
      error: "AOIE processing error",
    });
  }
};
