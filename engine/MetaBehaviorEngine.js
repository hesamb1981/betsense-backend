// MetaBehaviorEngine.js
// Simple demo-only Meta Behavior Engine for Option D profiles

/**
 * Build a synthetic meta-behavior profile for demo mode.
 * In real mode this would fuse NSI, RBS, Emotion, OrderBook, etc.
 */
function buildMetaBehaviorProfile(options = {}) {
  const {
    club = "Demo Club",
    league = "Demo League",
    sampleWindow = 40,
    focus = "stability-vs-instability",
  } = options;

  // Fake metrics – just for demo wiring
  const stabilityScore = 68;
  const instabilityScore = 32;
  const lateFlipRisk = 41;
  const panicCollapseRisk = 27;
  const comebackPotential = 59;

  return {
    club,
    league,
    sampleWindow,
    focus,
    metrics: {
      stabilityScore,
      instabilityScore,
      lateFlipRisk,
      panicCollapseRisk,
      comebackPotential,
    },
    bands: [
      {
        label: "Normal tactical DNA",
        startMatch: -40,
        endMatch: -18,
        stability: "stable",
      },
      {
        label: "Drift & unstable regimes",
        startMatch: -17,
        endMatch: -6,
        stability: "unstable",
      },
      {
        label: "Re-balanced template",
        startMatch: -5,
        endMatch: 0,
        stability: "mixed",
      },
    ],
    narrative: [
      `Over the last ${sampleWindow} matches, ${club} has mostly behaved close to its normal tactical DNA, but with clear unstable pockets.`,
      "Instability spikes cluster around fixture blocks where pressure, injuries or tactical experiments pushed the club out of character.",
      "Late-flip risk is elevated in fixtures where the club chases the game or over-extends in transition.",
      "Comeback potential remains live, but is highly regime-dependent – strong when pressing template is intact, weak in panic phases.",
    ],
  };
}

/**
 * Public function used by metaController to serve the demo response.
 */
export async function runMetaBehaviorDemo(options = {}) {
  const profile = buildMetaBehaviorProfile(options);

  return {
    ok: true,
    engine: "META_BEHAVIOR",
    mode: options.mode || "demo",
    summary: "Meta Behavior Engine demo response generated successfully.",
    profile,
  };
}

// Optional default export if needed elsewhere
export default {
  runMetaBehaviorDemo,
};
