// ultraSimulationRoutes.js
// API for Ultra Simulation Layer

import express from "express";
import simulation from "../../engines/super/super/ultraSimulationRuntime.js";

const router = express.Router();

// -----------------------------------------
// RUN FORWARD SIMULATION
// -----------------------------------------
router.post("/run", (req, res) => {
  const { engine, state, steps } = req.body;

  if (!engine || !state) {
    return res.status(400).json({
      ok: false,
      error: "Missing engine name or initial state"
    });
  }

  try {
    const report = simulation.simulateForward(engine, state, steps || 5);
    return res.json({ ok: true, report });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

// -----------------------------------------
// LIST REGISTERED ENGINES FOR SIMULATION
// -----------------------------------------
router.get("/engines", (req, res) => {
  return res.json({
    ok: true,
    engines: Object.keys(simulation.simulations)
  });
});

// -----------------------------------------
// READ/WRITE GLOBAL SIMULATION MEMORY
// -----------------------------------------
router.post("/memory/save", (req, res) => {
  const { key, value } = req.body;
  simulation.saveMemory(key, value);

  return res.json({
    ok: true,
    message: "Memory saved",
    key,
    value
  });
});

router.get("/memory/:key", (req, res) => {
  const key = req.params.key;
  const value = simulation.loadMemory(key);

  return res.json({
    ok: true,
    key,
    value
  });
});

export default router;
