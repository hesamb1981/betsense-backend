// selfCorrectionRoutes.js
// Route layer for Ultra Self-Correction Engine

import express from "express";
import selfCorrection from "../../engines/super/super/ultraSelfCorrectionRuntime.js";

const router = express.Router();

// -----------------------------
// VALIDATE ENGINE SIGNAL
// -----------------------------
router.post("/validate", (req, res) => {
  const { engine, signal } = req.body;

  if (!engine || !signal) {
    return res.status(400).json({
      ok: false,
      error: "Missing engine name or signal payload",
    });
  }

  try {
    const report = selfCorrection.validateSignal(engine, signal);
    return res.json({ ok: true, engine, report });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

// -----------------------------
// CORRECT ENGINE SIGNAL
// -----------------------------
router.post("/correct", (req, res) => {
  const { engine, signal } = req.body;

  if (!engine || !signal) {
    return res.status(400).json({
      ok: false,
      error: "Missing engine name or signal payload",
    });
  }

  try {
    const corrected = selfCorrection.correctSignal(engine, signal);
    return res.json({ ok: true, engine, corrected });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

// -----------------------------
// LIST ALL REGISTERED ENGINES
// -----------------------------
router.get("/engines", (req, res) => {
  return res.json({
    ok: true,
    engines: Object.keys(selfCorrection.engines),
  });
});

export default router;
