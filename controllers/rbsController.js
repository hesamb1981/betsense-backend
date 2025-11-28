// controllers/rbsController.js

// 1) Health check برای RBS
export const getRBSHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "RBSEngine",
    status: "RBS engine health OK",
  });
};

// 2) Demo analysis (GET) برای تست سریع در مرورگر
export const getRBSDemo = (req, res) => {
  res.json({
    ok: true,
    engine: "RBSEngine",
    mode: "demo",
    summary: "RBS demo analysis (GET)",
    fixtureId: 123456,
    team: "Arsenal",
    opponent: "Spurs",
    minute: 78,
    scoreDiff: -1,
    signals: {
      pressureShift: "HIGH",
      orderbookImbalance: 0.78,
      momentumSwing: -0.42,
      volatilitySpike: true,
    },
    metrics: {
      reversalProbability: 62,
      collapseRisk: 21,
      lateGoalChance: 54,
    },
    flags: ["late_goal_watch", "orderbook_pressure", "momentum_reversal_zone"],
  });
};

// 3) (اختیاری) تحلیل اصلی – اگر بعداً لازم شد با POST از UI صداش می‌زنیم
export const getRBSAnalysis = (req, res) => {
  const {
    fixtureId,
    team,
    opponent,
    minute,
    scoreDiff,
  } = req.body || {};

  res.json({
    ok: true,
    engine: "RBSEngine",
    mode: "live",
    summary: "RBS live analysis (POST)",
    input: {
      fixtureId,
      team,
      opponent,
      minute,
      scoreDiff,
    },
    metrics: {
      reversalProbability: 64,
      collapseRisk: 18,
      lateGoalChance: 51,
    },
  });
};

// --- alias ها برای هر حالتی که routes قبلاً از اسم‌های دیگر استفاده کرده باشد ---
export const rbsHealth = getRBSHealth;
export const rbsDemo = getRBSDemo;
export const rbsAnalyze = getRBSAnalysis;

// در صورتی که جایی default import شده باشد:
export default {
  getRBSHealth,
  getRBSDemo,
  getRBSAnalysis,
  rbsHealth,
  rbsDemo,
  rbsAnalyze,
};
