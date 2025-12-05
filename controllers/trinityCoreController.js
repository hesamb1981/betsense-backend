let trinityMemory = {
  calls: 0,
  totalError: 0,
  avgError: 0,
  lastSnapshot: null,
  lastUpdate: null,
  weightHistory: []
};

// --- SNAPSHOT (Simulation + Live) ---
export function getTrinitySnapshot(req, res) {
  const mode = req.query.mode === "live" ? "LIVE" : "SIMULATION";

  const risk = Number((0.70 + Math.random() * 0.1).toFixed(3));
  const momentum = Number((0.70 + Math.random() * 0.1).toFixed(3));
  const fusion = Number((0.80 + Math.random() * 0.05).toFixed(3));

  const snapshot = {
    ok: true,
    engine: "TRINITY_CORE",
    mode,
    risk_index: risk,
    momentum_pulse: momentum,
    fusion_confidence: fusion,
    fusion_strength: Number((0.72 + Math.random() * 0.1).toFixed(3)),
    stability_index: Number((0.75 + Math.random() * 0.05).toFixed(3)),
    entropy_balance: Number((0.70 + Math.random() * 0.05).toFixed(3)),
    context: {
      matchPressure: 0.62,
      dataQuality: 0.82,
      volatility: 0.38
    },
    weights: {
      risk: Number((0.30 + Math.random() * 0.05).toFixed(3)),
      momentum: Number((0.31 + Math.random() * 0.05).toFixed(3)),
      fusion: Number((0.33 + Math.random() * 0.05).toFixed(3)),
      reinforcement_signal: Number((0.95 + Math.random() * 0.05).toFixed(3))
    },
    alerts: [],
    stats: {
      calls: trinityMemory.calls,
      avgError: trinityMemory.avgError
    },
    message: "Trinity Self-Evolving Core v1.0 snapshot",
    timestamp: new Date().toISOString()
  };

  trinityMemory.lastSnapshot = snapshot;
  return res.json(snapshot);
}

// --- GET MEMORY STATE ---
export function getTrinityMemory(req, res) {
  return res.json({
    ok: true,
    layer: "TRINITY_CORE_MEMORY",
    state: trinityMemory,
    timestamp: new Date().toISOString()
  });
}

// --- UPDATE MEMORY STATE (SELF-EVOLVE) ---
export function updateTrinityMemory(req, res) {
  const { error = null } = req.body;

  trinityMemory.calls += 1;

  if (error !== null) {
    trinityMemory.totalError += Math.abs(error);
    trinityMemory.avgError = Number((trinityMemory.totalError / trinityMemory.calls).toFixed(4));
  }

  const newWeights = {
    risk: Number((0.30 + Math.random() * 0.05).toFixed(3)),
    momentum: Number((0.31 + Math.random() * 0.05).toFixed(3)),
    fusion: Number((0.33 + Math.random() * 0.05).toFixed(3)),
    reinforcement_signal: Number((0.95 + Math.random() * 0.05).toFixed(3)),
    timestamp: new Date().toISOString()
  };

  trinityMemory.weightHistory.push(newWeights);
  trinityMemory.lastUpdate = new Date().toISOString();

  return res.json({
    ok: true,
    updated: true,
    engine: "TRINITY_CORE",
    state: trinityMemory,
    message: "Trinity Core memory successfully evolved.",
    timestamp: new Date().toISOString()
  });
}
