// controllers/metaController.js
// Meta Behavior Engine Controller (CommonJS)

// Health check
exports.health = (req, res) => {
  return res.status(200).json({
    ok: true,
    engine: "Meta-Behavior",
    status: "healthy",
  });
};

// DEMO endpoint – خروجی ثابت برای تست UI
exports.demo = async (req, res) => {
  try {
    const demoResponse = {
      ok: true,
      engine: "Meta-Behavior",
      mode: "demo",
      summary: "Meta Behavior Engine demo output (Option D)",
      metrics: {
        stabilityScore: 82,
        deviationRisk: 24,
        switchingZones: 3,
        fusionImpact: 67,
        regimeInstability: 22,
        liveAdjustment: false,
      },
      narrative: {
        short:
          "System behavior remains stable with moderate fusion impact and minor deviation risk.",
        long:
          "Meta Behavior Engine detects a generally stable behavior structure across combined layers. Fusion impact is moderately high, but deviation risk remains low. No major switching patterns detected.",
      },
    };

    return res.status(200).json(demoResponse);
  } catch (err) {
    console.error("Meta demo error:", err);
    return res.status(500).json({
      ok: false,
      error: "Meta Behavior demo failed.",
      details: err.message,
    });
  }
};

// LIVE endpoint – فعلاً نسخه ساده (بعداً به دیتای واقعی وصل می‌کنیم)
exports.live = async (req, res) => {
  try {
    return res.status(200).json({
      ok: true,
      engine: "Meta-Behavior",
      mode: "live",
      note:
        "Meta Behavior live endpoint placeholder – ready for real data wiring later.",
    });
  } catch (err) {
    console.error("Meta live error:", err);
    return res.status(500).json({
      ok: false,
      error: "Meta Behavior live failed.",
      details: err.message,
    });
  }
};
