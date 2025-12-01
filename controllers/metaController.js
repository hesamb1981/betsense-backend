// src/controllers/metaController.js

export const metaHealth = (req, res) => {
  res.json({ status: "ok", engine: "meta-behavior", time: Date.now() });
};

export const metaDemo = (req, res) => {
  res.json({
    mode: "demo",
    message: "Meta Behavior Engine DEMO endpoint working ✔️"
  });
};

export const metaLive = (req, res) => {
  res.json({
    mode: "live",
    message: "Meta Behavior Engine LIVE endpoint working ✔️"
  });
};
