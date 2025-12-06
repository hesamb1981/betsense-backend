// ultraSelfCorrectionRuntime.js
// Singleton runtime for Ultra Self-Correction Layer

import UltraSelfCorrection from "./ultraSelfCorrection.js";

// Create single global guardian instance
const selfCorrection = new UltraSelfCorrection();

// Register all main engines with simple baselines
const ENGINE_LIST = [
  "aoie",
  "dataspine",
  "genius",
  "meta",
  "nsi",
  "rbs",
  "super_risk",
  "trinity_core",
  "ultra_master",
  "ultra_momentum",
  "ultra_risk"
];

ENGINE_LIST.forEach((name) => {
  selfCorrection.registerEngine(name, {
    // baseline structure – can extend later
    expectedRange: "0-1",
    allowAutoCorrection: true,
  });
});

// Export the singleton instance
export default selfCorrection;
