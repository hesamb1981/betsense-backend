// controllers/metaController.js

const path = require("path");

// در نسخه‌های بعدی اگر MetaBehaviorEngine واقعی داشتی، اینجا ایمپورتش می‌کنیم
// const MetaBehaviorEngine = require("../engine/MetaBehaviorEngine");

// یک هندلر ساده برای تستِ سلامت و متا-اطلاعات بک‌اند
const getMetaStatus = (req, res) => {
  try {
    const payload = {
      ok: true,
      engine: "META_BEHAVIOR",
      mode: "demo",
      summary: "Meta Behavior meta-endpoint is online.",
      timestamp: new Date().toISOString(),
      // فقط برای این که بعدا بدونیم به کدوم نسخه فرانت وصل است
      meta: {
        version: "1.0.0",
        ui: {
          optionD: "/meta/MetaBehaviorOptionD.html",
        },
      },
    };

    return res.status(200).json(payload);
  } catch (err) {
    console.error("MetaController error:", err);
    return res.status(500).json({
      ok: false,
      engine: "META_BEHAVIOR",
      error: "Meta controller failed to generate response.",
    });
  }
};

// اگر بعداً خواستی دمو محاسباتی هم داشته باشی از این استفاده می‌کنیم
const runMetaDemo = (req, res) => {
  try {
    // در آینده اینجا تحلیل واقعی روی MetaBehaviorEngine انجام می‌دهیم
    const demoResponse = {
      ok: true,
      engine: "META_BEHAVIOR",
      mode: "demo-local",
      summary: "Meta Behavior demo response generated successfully.",
      narrative: [
        "Engine fuses deviation, stability and regime-shift layers into one meta profile.",
        "Meta profile highlights where club behavior breaks from its long-horizon tactical DNA.",
        "Designed for desks that need a single, compressed risk signal before going live.",
      ],
    };

    return res.status(200).json(demoResponse);
  } catch (err) {
    console.error("Meta demo error:", err);
    return res.status(500).json({
      ok: false,
      engine: "META_BEHAVIOR",
      error: "Failed to generate meta demo response.",
    });
  }
};

module.exports = {
  getMetaStatus,
  runMetaDemo,
};
