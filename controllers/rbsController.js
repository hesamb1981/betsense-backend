// controllers/rbsController.js

// تست سلامت RBS
export const rbsHealth = (req, res) => {
  res.json({
    ok: true,
    engine: "RBS",
    message: "RBS Engine health OK",
  });
};

// دمو آنالیز RBS
export const rbsDemoAnalysis = (req, res) => {
  const data = {
    ok: true,
    engine: "RBS",
    mode: "demo",
    summary: "RBS demo analysis (GET).",
    metrics: {
      switchRisk: 21,
      panicFlip: 37,
      comebackChance: 62,
    },
  };

  res.json(data);
};
