// betsense-backend/controllers/dataspineController.js
import DataSpineEngine from "../engine/DataSpineEngine.js";

// فقط برای سلامت ساده
export const dataspineHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "DataSpine",
    message: "DataSpine health OK",
  });
};

// دموی ساده‌ی DataSpine – بعداً می‌توانیم از خود Engine استفاده کنیم
export const dataspineDemo = (req, res) => {
  // اینجا فعلاً یک جواب نمونه می‌دهیم
  // بعداً می‌توانیم این را به متد واقعی DataSpineEngine وصل کنیم
  res.json({
    ok: true,
    engine: "DataSpine",
    mode: "demo",
    summary: "Sample DataSpine demo response",
    metrics: {
      momentumScore: 78,
      volatilityIndex: 21,
      pressureBias: "home",
      patternCluster: "late-comeback-risk",
    },
  });
};

// فعلاً برای تست، analyze هم همین دمو را برمی‌گرداند
export const dataspineAnalyze = (req, res) => {
  res.json({
    ok: true,
    engine: "DataSpine",
    mode: "analyze-demo",
  });
};

export default {
  dataspineHealth,
  dataspineDemo,
  dataspineAnalyze,
};
