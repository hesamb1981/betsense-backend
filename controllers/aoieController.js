export const aoieDebug = (req, res) => {
  return res.json({
    ok: true,
    message: "AOIE Debug Route Active",
    timestamp: new Date().toISOString(),
  });
};
