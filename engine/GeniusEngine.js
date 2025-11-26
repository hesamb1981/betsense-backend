// engine/GeniusEngine.js
// Genius Engine v1.0.0  – structure for advanced football analytics

class GeniusEngine {
  // ---- Public API: main analysis method ----
  static analyzeMatch(payload = {}) {
    const {
      matchId = null,
      league = "Unknown League",
      homeTeam = "Home",
      awayTeam = "Away",
      kickoffTime = null,
      markets = {},
    } = payload;

    const attackBias = this._calcAttackBias(markets);
    const momentumIndex = this._calcMomentum(payload);
    const volatilityScore = this._calcVolatility(markets, league);

    // 0–1 score که هرچه بالاتر، موقعیت پایدارتر و جذاب‌تر است
    const geniusScore = Number(
      (
        0.4 * attackBias +
        0.3 * momentumIndex +
        0.3 * (1 - volatilityScore)
      ).toFixed(2)
    );

    const confidence = Number(
      (0.7 * (1 - volatilityScore) + 0.3 * momentumIndex).toFixed(2)
    );

    return {
      matchId,
      league,
      homeTeam,
      awayTeam,
      kickoffTime,
      geniusScore,   // بین 0 و 1
      confidence,    // بین 0 و 1
      components: {
        attackBias,
        momentumIndex,
        volatilityScore,
      },
      narrative: this._buildNarrative({
        homeTeam,
        awayTeam,
        geniusScore,
        confidence,
        momentumIndex,
        volatilityScore,
      }),
    };
  }

  // ---- Public API: health check ----
  static health() {
    return {
      ok: true,
      engine: "Genius Engine",
      version: "1.0.0",
      capabilities: [
        "Match-level quality score",
        "Momentum index",
        "Volatility radar",
        "Human-readable narrative",
      ],
    };
  }

  // ---- Internal helpers ----

  // تخمین تمایل بازی به سمت حمله، با توجه به مارکت‌های گل و BTTS
  static _calcAttackBias(markets = {}) {
    const {
      over25GoalsOdds = 2.0,
      bttsYesOdds = 2.0,
    } = markets;

    // هرچه اوور ۲.۵ و BTTS ضریب پایین‌تر => احتمال گل بیشتر
    const overComponent = this._normalizeOddsToAggression(over25GoalsOdds);
    const bttsComponent = this._normalizeOddsToAggression(bttsYesOdds);

    return Number(((overComponent + bttsComponent) / 2).toFixed(2));
  }

  // مومنتوم تیمی – بعداً می‌تونیم با داده واقعی جایگزین کنیم
  static _calcMomentum(payload = {}) {
    const { homeForm = [], awayForm = [] } = payload;

    const homeScore = this._formScore(homeForm); // آرایه‌ای مثل ["W","D","L","W","W"]
    const awayScore = this._formScore(awayForm);

    // ۰.۵ یعنی متعادل، بالاتر یعنی مومنتوم بیشتر برای تیم میزبان
    const momentum = 0.5 + (homeScore - awayScore) / 2;

    return Number(Math.max(0, Math.min(1, momentum)).toFixed(2));
  }

  // نوسان مارکت – بازی‌های لیگ‌های عجیب/پرگل، نوسان بالاتر
  static _calcVolatility(markets = {}, league = "") {
    const { oddsShift = 0 } = markets; // مثلا تغییر شدید ضرایب قبل از بازی

    let base =
      /friendly|u19|u21|reserve/i.test(league) ? 0.6 :
      /cup|knockout/i.test(league)            ? 0.5 :
                                               0.35;

    const shiftImpact = Math.max(0, Math.min(0.4, Math.abs(oddsShift)));

    const volatility = Math.max(0, Math.min(1, base + shiftImpact));
    return Number(volatility.toFixed(2));
  }

  // نمره فرم تیمی بین ۰ تا ۱
  static _formScore(formArr = []) {
    if (!Array.isArray(formArr) || formArr.length === 0) return 0.5;

    let score = 0;
    const weightStep = 1 / formArr.length;

    formArr.forEach((res, index) => {
      const w = (index + 1) * weightStep; // بازی‌های جدیدتر وزن بیشتری
      if (res === "W") score += 1 * w;
      if (res === "D") score += 0.5 * w;
      if (res === "L") score += 0 * w;
    });

    // نرمال‌سازی به ۰–۱
    return Math.max(0, Math.min(1, score / (formArr.length * weightStep)));
  }

  static _normalizeOddsToAggression(odds) {
    if (!odds || typeof odds !== "number") return 0.5;

    // ضرایب ۱.۴ تا ۲.۲ معمولا نشانه بازی پرگل‌تر است
    if (odds <= 1.4) return 0.85;
    if (odds <= 1.7) return 0.75;
    if (odds <= 2.0) return 0.65;
    if (odds <= 2.4) return 0.55;
    if (odds <= 2.8) return 0.45;
    if (odds <= 3.3) return 0.35;
    return 0.3;
  }

  static _buildNarrative({
    homeTeam,
    awayTeam,
    geniusScore,
    confidence,
    momentumIndex,
    volatilityScore,
  }) {
    let tone;
    if (geniusScore >= 0.8 && confidence >= 0.75 && volatilityScore <= 0.4) {
      tone = "strong-edge";
    } else if (geniusScore >= 0.65 && confidence >= 0.6) {
      tone = "controlled-edge";
    } else if (volatilityScore >= 0.7) {
      tone = "high-volatility";
    } else {
      tone = "balanced";
    }

    const summaryMap = {
      "strong-edge": `Genius Engine یک برتری قوی در این بازی شناسایی کرده است.`,
      "controlled-edge": `Genius Engine یک موقعیت قابل‌قبول اما نه فوق‌العاده را نشان می‌دهد.`,
      "high-volatility": `این بازی نوسان بسیار بالایی دارد و برای استراتژی‌های محافظه‌کار مناسب نیست.`,
      "balanced": `الگوهای بازی متعادل است و هیچ برتری واضحی دیده نمی‌شود.`,
    };

    return {
      tone,
      summary: summaryMap[tone],
      details: {
        geniusScore,
        confidence,
        comments: [
          `مومنتوم فعلی به سمت ${momentumIndex >= 0.5 ? homeTeam : awayTeam} متمایل است.`,
          `نمره نوسان (volatility) روی ${volatilityScore} تنظیم شده که نشان‌دهنده ${
            volatilityScore >= 0.7
              ? "ریسک بالا"
              : volatilityScore <= 0.4
              ? "بازار نسبتاً پایدار"
              : "شرایط متوسط بازار"
          } است.`,
        ],
      },
    };
  }
}

export default GeniusEngine;
