// controllers/dataspineController.js

// DataSpine Controller
// فقط هندلرهای ساده که فعلاً بدون هیچ انجینی کار کنن.
// مهم اینه که اسم اکسپورت‌ها با روترها یکی باشه، تا دیپلوی ارور نده.

/**
 * Health check برای DataSpine
 * GET /api/dataspine/health
 */
export const dataspineHealthCheck = (req, res) => {
  return res.json({
    ok: true,
    engine: "DataSpine",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Demo endpoint برای DataSpine
 * GET /api/dataspine/demo
 */
export const dataspineDemo = (req, res) => {
  const samplePayload = {
    ok: true,
    engine: "DataSpine",
    mode: "demo",
    description: "Sample DataSpine response for demo/testing.",
    sampleMetrics: {
      marketsCovered: 128,
      seasonsAnalyzed: 12,
      eventsPerMinute: 45,
    },
  };

  return res.json(samplePayload);
};

/**
 * Live endpoint (در صورت نیاز روتر ازش استفاده کند)
 * GET /api/dataspine/live
 * فعلاً یه خروجی ساده می‌دهد تا فقط سرور بالا بیاید.
 */
export const dataspineLive = (req, res) => {
  return res.json({
    ok: true,
    engine: "DataSpine",
    mode: "live-placeholder",
    message:
      "DataSpine live endpoint is wired correctly. Replace with real logic when ready.",
  });
};
