// engine/NSIEngine.js
// Neuro-Situational Identity Engine (NSI Engine) · v0.1
// This module turns raw match context + stack signals into a "neuro state"
// and NSI signature. This is the first internal version – fully BetSense only.

const clamp = (value, min, max) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
};

const clamp01 = (value) => clamp(value, 0, 1);

const safeNum = (value, fallback = null) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n;
};

const normalize100 = (value, fallback = 0.4) => {
  const n = safeNum(value, null);
  if (n === null) return fallback;
  return clamp01(n / 100);
};

/**
 * Input shape (v0.1 – demo)
 *
 * {
 *   fixtureId?: string,
 *   team?: string,
 *   opponent?: string,
 *   minute?: number,           // 0–120
 *   scoreDiff?: number,        // teamGoals - opponentGoals
 *   venue?: "HOME" | "AWAY" | "NEUTRAL",
 *   context?: {
 *     mustWin?: boolean,
 *     knockout?: boolean,
 *     derby?: boolean,
 *   },
 *   signals?: {
 *     emotionIndex?: number,        // 0–100 (Emotion Engine)
 *     xgMomentum?: number,          // 0–100 (xG swing, pressure)
 *     pressureIndex?: number,       // 0–100 (Orderbook / market)
 *     behaviorDeviation?: number,   // 0–100 (Behavior Deviation Scanner)
 *   },
 *   triggers?: {
 *     lastGoalMinutesAgo?: number | null,
 *     lastCardMinutesAgo?: number | null,
 *     lastVarMinutesAgo?: number | null,
 *   }
 * }
 */

export const runNSIEngine = (input) => {
  const {
    fixtureId,
    team,
    opponent,
    minute,
    scoreDiff,
    venue,
    context = {},
    signals = {},
    triggers = {},
  } = input || {};

  // 1) Normalize core signals (0–1)
  const emotion = normalize100(signals.emotionIndex, 0.4);
  const xgMomentum = normalize100(signals.xgMomentum, 0.4);
  const pressure = normalize100(signals.pressureIndex, 0.4);
  const deviation = normalize100(signals.behaviorDeviation, 0.4);

  // 2) Basic game-state features
  const m = clamp(Number(minute || 0), 0, 130);
  const isLate = m >= 70 ? 1 : m >= 55 ? 0.7 : m >= 35 ? 0.4 : 0.1;

  const diff = safeNum(scoreDiff, 0);
  const losing = diff < 0 ? 1 : 0;
  const winning = diff > 0 ? 1 : 0;
  const level = diff === 0 ? 1 : 0;

  const mustWin = context.mustWin ? 1 : 0;
  const knockout = context.knockout ? 1 : 0;
  const derby = context.derby ? 1 : 0;

  const venueBoost = venue === "HOME" ? 0.1 : venue === "AWAY" ? -0.05 : 0;

  // 3) Trigger normalization (recency of shocks)
  const recencyScore = (mins) => {
    const n = safeNum(mins, null);
    if (n === null) return 0;
    if (n <= 2) return 1;
    if (n <= 5) return 0.8;
    if (n <= 10) return 0.6;
    if (n <= 20) return 0.4;
    if (n <= 35) return 0.2;
    return 0.1;
  };

  const goalShock = recencyScore(triggers.lastGoalMinutesAgo);
  const cardShock = recencyScore(triggers.lastCardMinutesAgo);
  const varShock = recencyScore(triggers.lastVarMinutesAgo);

  // 4) Compute some internal NSI components

  // How likely the team is in an unstable emotional window
  const emotionalInstability =
    clamp01(
      emotion * 0.6 +
      deviation * 0.6 +
      goalShock * 0.4 +
      cardShock * 0.3 +
      varShock * 0.3 +
      isLate * 0.2
    );

  // How much "clutch" potential exists (high pressure but still coherent)
  const clutchPotential =
    clamp01(
      (emotion * 0.4) +
      (xgMomentum * 0.4) +
      (pressure * 0.3) +
      (isLate * 0.4) +
      (mustWin * 0.3) +
      (knockout * 0.3) +
      (derby * 0.2) +
      (level * 0.2) // level games invite clutch moments
    );

  // Collapse risk: emotional instability + losing + late game + external shocks
  const collapseRisk =
    clamp01(
      emotionalInstability * 0.6 +
      losing * 0.4 +
      isLate * 0.5 +
      goalShock * 0.3 +
      pressure * 0.3 +
      deviation * 0.3
    );

  // Stability baseline: opposite of deviation, adjusted by venue & game state
  const stability =
    clamp01(
      (1 - deviation) * 0.6 +
      (1 - emotionalInstability) * 0.4 +
      winning * 0.3 +
      (0.2 + venueBoost)
    );

  // Overall NSI intensity – how "charged" the neuro-situational state is
  const overallIntensity =
    clamp01(
      emotionalInstability * 0.5 +
      clutchPotential * 0.4 +
      collapseRisk * 0.5 +
      isLate * 0.3 +
      goalShock * 0.3 +
      cardShock * 0.2 +
      varShock * 0.2
    );

  // 5) Decide discrete neuro state
  let neuroState = "STABLE";
  const flags = [];
  const notes = [];

  if (collapseRisk >= 0.8 && emotionalInstability >= 0.7) {
    neuroState = "PANIC";
    flags.push("HIGH_COLLAPSE_RISK");
    notes.push("Neuro state drifting into panic – protect against rapid collapse.");
  } else if (emotionalInstability >= 0.7 && losing && isLate >= 0.7) {
    neuroState = "TILT";
    flags.push("TILT_RISK");
    notes.push("Team under emotional tilt – decisions may become chaotic.");
  } else if (clutchPotential >= 0.7 && isLate >= 0.6 && (mustWin || knockout)) {
    neuroState = "CLUTCH";
    flags.push("CLUTCH_WINDOW");
    notes.push("Clutch window – team may overperform critical actions.");
  } else if (overallIntensity <= 0.3 && stability >= 0.6) {
    neuroState = "CALM";
    flags.push("CALM_STATE");
    notes.push("Low-intensity calm window – stable but less volatile.");
  } else {
    neuroState = "STABLE";
    notes.push("Neutral stable band – no extreme neuro pattern detected.");
  }

  if (derby) {
    notes.push("Derby context – emotional variance can spike unexpectedly.");
  }
  if (knockout) {
    notes.push("Knockout tie – elimination risk amplifies neuro responses.");
  }

  // 6) Build NSI signature object
  const signature = {
    neuroState,
    overallIntensity,
    components: {
      emotionalInstability,
      clutchPotential,
      collapseRisk,
      stability,
      goalShock,
      cardShock,
      varShock,
      isLate,
      losing,
      winning,
      level,
    },
    context: {
      minute: m,
      scoreDiff: diff,
      venue: venue || null,
      mustWin: !!mustWin,
      knockout: !!knockout,
      derby: !!derby,
    },
    meta: {
      fixtureId: fixtureId || null,
      team: team || null,
      opponent: opponent || null,
    },
    flags,
    notes,
    mode: "nsi-v0.1",
  };

  return signature;
};
