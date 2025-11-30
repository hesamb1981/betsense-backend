// betsense-backend/controllers/metaController.js

// اگر بعداً خواستی از فایل engine/MetaBehaviorEngine.js استفاده کنیم
// اینجا می‌تونیم ایمپورتش کنیم. فعلاً دمو رو همین‌جا می‌سازیم که خطا نده.
// const { runMetaBehaviorEngine } = require("../engine/MetaBehaviorEngine");

// ---------- DEMO ----------
exports.runMetaDemo = async (req, res) => {
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
          "Meta Behavior Engine detects a generally stable behavior structure across combined layers. " +
          "Fusion impact is moderately high, but deviation risk remains low. No major switching patterns detected.",
      },
    };

    return res.status(200).json(demoResponse);
  } catch (err) {
    console.error("Meta Behavior demo error:", err);
    return res.status(500).json({
      ok: false,
      error: "Meta Behavior demo failed.",
      details: err.message,
    });
  }
};

// ---------- LIVE (enterprise placeholder) ----------
exports.runMetaLive = async (req, res) => {
  try {
    const inputConfig = req.body || {};

    // این فقط یه شِل دمو هست برای تست روت؛
    // بعداً اینجا runMetaBehaviorEngine(inputConfig) صدا می‌زنیم.
    const liveResponse = {
      ok: true,
      engine: "Meta-Behavior",
      mode: "live",
      input: inputConfig,
      metrics: {
        stabilityScore: 79,
        deviationRisk: 31,
        switchingZones: 4,
        fusionImpact: 71,
        regimeInstability: 29,
        liveAdjustment: true,
      },
      narrative: {
        short:
          "Live meta-behavior profile shows mild instability with noticeable fusion impact.",
        long:
          "Live Meta Behavior Engine layer combines deviation, emotion, NSI, RBS and order-book pressure " +
          "to produce a unified meta-layer signal. Current conditions suggest increased sensitivity to regime flips " +
          "and micro-structure stress, but no critical breakdown detected yet.",
      },
    };

    return res.status(200).json(liveResponse);
  } catch (err) {
    console.error("Meta Behavior live error:", err);
    return res.status(500).json({
      ok: false,
      error: "Meta Behavior live failed.",
      details: err.message,
    });
  }
};
