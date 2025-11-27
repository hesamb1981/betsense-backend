// controllers/geniusController.js
// Controller for Genius Engine endpoints.
// فعلاً منطق اصلی به صورت placeholder است تا بعداً به GeniusEngine واقعی وصل شود.

import { logRequest, sendSuccess, sendError } from "../utils/index.js";

// GET /api/genius/health
export const geniusHealth = (req, res) => {
  logRequest(req);

  return sendSuccess(res, {
    engine: "GeniusEngine",
    status: "online",
  });
};

// GET /api/genius/analyze
// در نسخه‌ی بعدی این متد به GeniusEngine واقعی وصل می‌شود.
// فعلاً ورودی‌ها را می‌گیرد و یک خروجی تستی برمی‌گرداند.
export const geniusAnalyze = async (req, res) => {
  try {
    logRequest(req);

    const {
      fixtureId,
      homeTeam,
      awayTeam,
      oddsHome,
      oddsDraw,
      oddsAway,
    } = req.query;

    const input = {
      fixtureId: fixtureId || null,
      homeTeam: homeTeam || null,
      awayTeam: awayTeam || null,
      odds: {
        home: oddsHome ? Number(oddsHome) : null,
        draw: oddsDraw ? Number(oddsDraw) : null,
        away: oddsAway ? Number(oddsAway) : null,
      },
    };

    // 🔽 این قسمت فعلاً فقط یک خروجی نمایشی می‌دهد.
    // در مرحله‌ی بعدی به GeniusEngine واقعی وصل می‌شود.
    const mockResult = {
      recommendation: "HOLD",
      confidence: 0.5,
      notes: [
        "این پاسخ فقط برای تست API است.",
        "در نسخه‌ی بعدی، خروجی از GeniusEngine واقعی محاسبه می‌شود.",
      ],
    };

    return sendSuccess(res, {
      engine: "GeniusEngine",
      mode: "mock",
      input,
      result: mockResult,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
