export const analyzeAOIE = async (req, res) => {
  try {
    // 1) مطمئن شو درخواست JSON است
    const isJson =
      req.is("application/json") ||
      req.is("json") ||
      (req.headers["content-type"] || "").includes("application/json");

    if (!isJson) {
      return res.status(400).json({
        ok: false,
        error: "Content-Type must be application/json",
      });
    }

    // 2) از کرش شدن روی undefined جلوگیری کن
    const body = req.body || {};
    const { matchId, market, odds } = body;

    // 3) اعتبارسنجی ورودی‌ها
    if (!matchId || !market || !odds) {
      return res.status(400).json({
        ok: false,
        error: "Missing fields: matchId, market, odds are required",
      });
    }

    if (
      typeof odds.home !== "number" ||
      typeof odds.draw !== "number" ||
      typeof odds.away !== "number"
    ) {
      return res.status(400).json({
        ok: false,
        error: "Odds.home, odds.draw, odds.away must be numbers",
      });
    }

    // 4) شبیه‌سازی منطق AOIE (نسخه ساده‌شده)
    const impliedHome = 1 / odds.home;
    const impliedDraw = 1 / odds.draw;
    const impliedAway = 1 / odds.away;
    const overround = impliedHome + impliedDraw + impliedAway;

    const normHome = impliedHome / overround;
    const normDraw = impliedDraw / overround;
    const normAway = impliedAway / overround;

    let sharpMove = "HOME";
    let maxProb = normHome;

    if (normDraw > maxProb) {
      sharpMove = "DRAW";
      maxProb = normDraw;
    }
    if (normAway > maxProb) {
      sharpMove = "AWAY";
      maxProb = normAway;
    }

    const confidence = Math.min(0.99, Math.max(0.5, maxProb + 0.1));

    const result = {
      matchId,
      market,
      odds,
      normalizedProbabilities: {
        home: normHome,
        draw: normDraw,
        away: normAway,
      },
      confidence,
      recommendation: "LIMIT",
      sharpMove,
      explanation:
        "AOIE normalized the odds and detected the sharpest side based on implied probabilities.",
      processedAt: new Date().toISOString(),
    };

    return res.json({
      ok: true,
      engine: "AOIE",
      result,
    });
  } catch (err) {
    console.error("AOIE Analyze Error:", err);
    return res.status(500).json({
      ok: false,
      error: "AOIE internal engine failure",
    });
  }
};
