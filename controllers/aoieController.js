// controllers/aoieController.js

export const debugAoie = (req, res) => {
  return res.json({
    ok: true,
    message: "AOIE Debug Route Active",
    timestamp: new Date().toISOString(),
  });
};

export const runAoie = (req, res) => {
  return res.json({
    ok: true,
    message: "AOIE Run Route Reached",
    timestamp: new Date().toISOString(),
  });
};
