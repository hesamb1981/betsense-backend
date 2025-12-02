// controllers/dataspineController.js
import DataSpineEngine from "../engine/DataSpineEngine.js";

export const dataspineStatus = (req, res) => {
  return res.json({
    ok: true,
    engine: "DataSpine",
    message: "DataSpine controller is working",
  });
};

export const dataspineAnalyze = (req, res) => {
  try {
    // ورودی‌ها بعداً از UI ارسال می‌شود
    const input = req.body || {};

    const result = DataSpineEngine.analyze(input);

    return res.json({
      ok: true,
      engine: "DataSpine",
      mode: "live",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};
