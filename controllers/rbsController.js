// controllers/rbsController.js

// ساده‌ترین هِلث‌چک برای RBS Engine
export const rbsHealthCheck = (req, res) => {
  res.json({
    ok: true,
    engine: "RBS Engine",
    status: "RBS controller OK",
  });
};

// دمو برای RBS – بعداً هرطور خواستیم می‌تونیم هوشمندش کنیم
export const rbsDemo = (req, res) => {
  res.json({
    ok: true,
    message: "RBS demo endpoint",
    sample: {
      matchId: 12345,
      homeTeam: "Home FC",
      awayTeam: "Away FC",
      exampleSwitchIndex: 0.72,
    },
  });
};
