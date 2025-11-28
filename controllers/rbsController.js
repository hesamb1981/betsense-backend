// engine/controllers/rbsController.js
// RBS – Real Behavioral Switching Engine demo controller

// در نسخه دمو، برای ساده بودن، یک خروجی نمونه برمی‌گردانیم.
// بعداً اگر خواستی می‌تونیم اینجا RBS واقعی را از RBSEngine.js صدا بزنیم.

export const rbsHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "RBSEngine",
    status: "online",
    mode: "demo-ready",
    ts: new Date().toISOString(),
  });
};

export const rbsDemo = (req, res) => {
  // داده‌ی نمونه – فقط برای دمو
  const sampleTimelineLength = 9;

  const sampleSignature = {
    ok: true,
    engine: "RBSEngine",
    summary: {
      engine: "RBSEngine",
      points: sampleTimelineLength,
      averageTension: 0.71,
      totalSwitches: 3,
      criticalCollapseCount: 1,
      positiveLiftCount: 2,
      topCriticalCollapse: {
        minute: 78,
        type: "CRITICAL_COLLAPSE_SWITCH",
        direction: "negative",
        confidence: 0.88,
        window: { from: 72, to: 78 },
        tensionBefore: 0.74,
        tensionAfter: 0.49,
        explanation:
          "Critical negative switch – signs of collapse: rising pressure, behaviour deviation and drop in tension.",
      },
      topPositiveLift: {
        minute: 52,
        type: "POSITIVE_MOMENTUM_SWITCH",
        direction: "positive",
        confidence: 0.79,
        window: { from: 48, to: 52 },
        tensionBefore: 0.63,
        tensionAfter: 0.81,
        explanation:
          "Positive momentum swing – behaviour and xG/pressure shifting in favour of the team.",
      },
    },
    switches: [
      {
        minute: 34,
        type: "POSITIVE_MOMENTUM_SWITCH",
        direction: "positive",
        confidence: 0.72,
        window: { from: 30, to: 34 },
        tensionBefore: 0.52,
        tensionAfter: 0.73,
        explanation:
          "Positive momentum swing – behaviour and xG/pressure shifting in favour of the team.",
      },
      {
        minute: 52,
        type: "POSITIVE_MOMENTUM_SWITCH",
        direction: "positive",
        confidence: 0.79,
        window: { from: 48, to: 52 },
        tensionBefore: 0.63,
        tensionAfter: 0.81,
        explanation:
          "Positive momentum swing – behaviour and xG/pressure shifting in favour of the team.",
      },
      {
        minute: 78,
        type: "CRITICAL_COLLAPSE_SWITCH",
        direction: "negative",
        confidence: 0.88,
        window: { from: 72, to: 78 },
        tensionBefore: 0.74,
        tensionAfter: 0.49,
        explanation:
          "Critical negative switch – signs of collapse: rising pressure, behaviour deviation and drop in tension.",
      },
    ],
  };

  res.json({
    ok: true,
    engine: "RBSEngine",
    mode: "demo",
    demoFixture: {
      team: "Arsenal",
      opponent: "Spurs",
      minute: 78,
    },
    rbs: sampleSignature,
  });
};

// اگر جایی بخوایم default import استفاده کنیم:
const rbsController = {
  rbsHealth,
  rbsDemo,
};

export default rbsController;
