// utils/index.js
// Shared utility functions for BetSense backend.
// These helpers are generic and can be reused by all engines
// (Genius, Fusion, Golden, Emotion, BehaviorDeviation, MatchNarrative, OrderBookPressure, etc.)

export const logRequest = (req) => {
  const { method, originalUrl, query, body } = req;
  console.log(
    `[BetSense] ${method} ${originalUrl}`,
    "query:",
    query,
    "body:",
    body,
    "@",
    new Date().toISOString()
  );
};

export const sendSuccess = (res, data) => {
  return res.json({
    ok: true,
    data,
  });
};

export const sendError = (res, error, statusCode = 500) => {
  console.error("[BetSense ERROR]", error);
  return res.status(statusCode).json({
    ok: false,
    error: error?.message || "Internal server error",
  });
};
