// engine/EmotionEngine.js
// Core logic for Emotion Engine (backend version).
// v0.1 – combines crowd heat, pressure swings and shock risk into a single index.

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const safeScore = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  // we expect 0–100 inputs from UI or upstream feeds
  return clamp(n, 0, 100);
};

const normalize = (v) => {
  // map 0–100 → 0–1
  return clamp(v / 100, 0, 1);
};

/**
 * Input shape (all fields optional for now, v0.1):
 *
 * {
 *   fixtureId?: string
 *   homeTeam?: string
 *   awayTeam?: string
 *   metrics?: {
 *     crowdHeat?: number   // 0–100
 *     pressureSwing?: number // 0–100
 *     shockRisk?: number   // 0–100
 *   }
 * }
 */
export const runEmotionEngine = (input) => {
  const { fixtureId, homeTeam, awayTeam, metrics = {} } = input || {};

  const crowdHeat = safeScore(metrics.crowdHeat);
  const pressureSwing = safeScore(metrics.pressureSwing);
  const shockRisk = safeScore(metrics.shockRisk);

  const values = [
    crowdHeat ?? 40,
    pressureSwing ?? 40,
    shockRisk ?? 40,
  ];

  // normalize each 0–100 → 0–1
  const norm = values.map(normalize);

  const avg = (norm[0] + norm[1] + norm[2]) / 3;

  // a bit more weight on shock + swings (edges matter more than raw heat)
  const weighted =
    (norm[0] * 0.3) + // crowd heat
    (norm[1] * 0.35) + // pressure swings
    (norm[2] * 0.35); // shock risk

  const composite = clamp((avg + weighted) / 2, 0, 1);

  let band = "CALM";
  let label = "Low emotion / stable tempo";
  const notes = [];

  if (composite >= 0.8) {
    band = "EXTREME";
    label = "High shock risk / extreme pressure";
    notes.push("Expect violent swings and unstable prices.");
  } else if (composite >= 0.6) {
    band = "HIGH";
    label = "Elevated crowd heat and pressure";
    notes.push("Suitable for aggressive traders only.");
  } else if (composite >= 0.4) {
    band = "MEDIUM";
    label = "Moderate emotion environment";
    notes.push("Edges can appear around key events.");
  } else {
    band = "CALM";
    label = "Low emotion / stable tempo";
    notes.push("Market likely to be more orderly.");
  }

  // add more context based on specific dimensions
  if (shockRisk !== null && shockRisk >= 80) {
    notes.push("Shock risk spike – protect against flips and late goals.");
  }
  if (pressureSwing !== null && pressureSwing >= 70) {
    notes.push("Pressure swings are elevated – watch momentum changes.");
  }
  if (crowdHeat !== null && crowdHeat <= 25) {
    notes.push("Crowd heat is low – atmosphere may dampen volatility.");
  }

  return {
    mode: "live-v0.1",
    band,
    label,
    index: composite, // 0–1
    components: {
      crowdHeat: crowdHeat ?? null,
      pressureSwing: pressureSwing ?? null,
      shockRisk: shockRisk ?? null,
    },
    meta: {
      fixtureId: fixtureId || null,
      homeTeam: homeTeam || null,
      awayTeam: awayTeam || null,
    },
    notes,
  };
};
