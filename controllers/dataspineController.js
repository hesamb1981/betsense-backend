// controllers/dataspineController.js

const DataSpineEngine = require("../engine/DataSpineEngine");

// DEMO endpoint – فقط خروجی دمو از DataSpineEngine
exports.demo = async (req, res) => {
  try {
    const output = DataSpineEngine.buildDemoOutput();

    return res.status(200).json({
      ok: true,
      engine: "DataSpine",
      mode: "demo",
      summary: output.summary,
      metrics: output.metrics,
      narrative: output.narrative
    });
  } catch (err) {
    console.error("DataSpine demo error:", err);
    return res.status(500).json({
      ok: false,
      error: "DataSpine demo failed.",
      details: err.message
    });
  }
};

// LIVE endpoint – فعلاً placeholder تا بعداً به فیدهای واقعی وصلش کنیم
exports.live = async (req, res) => {
  try {
    const payload = req.body || {};
    const output = DataSpineEngine.buildLiveOutput(payload);

    return res.status(200).json({
      ok: true,
      engine: "DataSpine",
      mode: "live",
      summary: output.summary,
      metrics: output.metrics,
      narrative: output.narrative,
      debug: output.debug
    });
  } catch (err) {
    console.error("DataSpine live error:", err);
    return res.status(500).json({
      ok: false,
      error: "DataSpine live failed.",
      details: err.message
    });
  }
};
