// controllers/index.js
// Main controller for BetSense backend.
// For now we only expose a basic health check endpoint.

export const healthCheck = (req, res) => {
  return res.json({
    ok: true,
    service: "betsense-backend",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
};
