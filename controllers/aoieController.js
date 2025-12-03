export const analyzeAOIE = async (req, res) => {
  try {
    // دریافت ورودی
    const { matchId, market, odds } = req.body;

    // چک کردن مقادیر ضروری
    if (!matchId || !market || !odds) {
      return res.status(400).json({
        ok: false,
        error: "Missing fields: matchId, market, odds are required"
      });
    }

    // شبیه‌سازی پردازش AOIE Engine
    const result = {
      matchId,
      market,
      confidence: 0.82,
      recommendation: "LIMIT",
      explanation: "AOIE analyzed odds and produced a stable recommendation.",
      sharpMove: odds.home > odds.away ? "HOME" : "AWAY",
      processedAt: new Date().toISOString()
    };

    // خروجی نهایی
    res.json({
      ok: true,
      engine: "AOIE",
      result
    });

  } catch (err) {
    console.error("AOIE Analyze Error:", err);
    res.status(500).json({
      ok: false,
      error: "AOIE internal engine failure"
    });
  }
};
