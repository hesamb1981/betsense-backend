// controllers/metaController.js
// Meta Behavior Engine - simple demo + health

const metaController = {
  // تست سلامت
  health: (req, res) => {
    res.json({
      ok: true,
      engine: "MetaBehaviorEngine",
      status: "META_ENGINE_HEALTHY",
      message: "Meta Behavior Engine is up and ready.",
    });
  },

  // دمو ساده برای تست اتصال
  demo: (req, res) => {
    // این مقادیر فقط برای دمو هستن
    const sampleInput = {
      gamesAnalyzed: 50,
      leagues: ["Premier League", "LaLiga", "Serie A"],
      seasons: ["2018-2019", "2019-2020", "2020-2021"],
    };

    const sampleOutput = {
      metaScore: 0.87,
      volatilityBand: "HIGH_SIGNAL",
      clustersDetected: 12,
      dominantPatterns: [
        "Late-game collapse risk under sustained high press",
        "High behavioral switching in final 15 minutes",
        "Momentum carry-over between back-to-back fixtures",
      ],
    };

    res.json({
      ok: true,
      engine: "MetaBehaviorEngine",
      mode: "demo",
      inputSample: sampleInput,
      metaSignature: sampleOutput,
    });
  },
};

export default metaController;
