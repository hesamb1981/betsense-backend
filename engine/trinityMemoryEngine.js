// engine/trinityMemoryEngine.js
// Trinity Self-Evolving Core - In-Memory Self-Improvement Layer

let state = {
  calls: 0,
  totalError: 0,
  avgError: 0,
  lastSnapshot: null,
  lastUpdate: null,
  weightHistory: [],
};

/**
 * امن‌سازی و نرمال‌سازی وزن‌ها + تنظیم خودکار بر اساس خطا
 */
function computeAdjustedWeights(weights = {}, error = 0) {
  const safeWeights = {
    risk: typeof weights.risk === "number" ? weights.risk : 0.33,
    momentum: typeof weights.momentum === "number" ? weights.momentum : 0.33,
    fusion: typeof weights.fusion === "number" ? weights.fusion : 0.34,
  };

  // شدت تنظیم بر اساس خطا، بین 0.01 و 0.2
  const adjustmentStrength = Math.max(0.01, Math.min(error, 0.2));

  if (error > 0.15) {
    // خطا بالاست → سیستم محافظه‌کارتر می‌شود
    safeWeights.fusion = Math.min(0.6, safeWeights.fusion + adjustmentStrength / 2);
    safeWeights.risk = Math.min(0.6, safeWeights.risk + adjustmentStrength / 3);
    safeWeights.momentum = Math.max(0.1, safeWeights.momentum - adjustmentStrength / 2);
  } else {
    // خطا پایین است → اجازه تقویت مومنتوم
    safeWeights.momentum = Math.min(0.6, safeWeights.momentum + adjustmentStrength / 3);
    safeWeights.risk = Math.max(0.1, safeWeights.risk - adjustmentStrength / 4);
  }

  const sum = safeWeights.risk + safeWeights.momentum + safeWeights.fusion;

  return {
    risk: Number((safeWeights.risk / sum).toFixed(3)),
    momentum: Number((safeWeights.momentum / sum).toFixed(3)),
    fusion: Number((safeWeights.fusion / sum).toFixed(3)),
  };
}

/**
 * به‌روزرسانی حافظه Trinity بر اساس اسنپ‌شات جدید
 * و برگرداندن نسخه تقویت‌شده اسنپ‌شات
 */
export function updateTrinityMemory(snapshot = {}) {
  // اگر avgError نداریم، خطا را از روی کیفیت فعلی می‌سازیم
  const syntheticError =
    1 -
    (
      (snapshot.fusion_strength || 0) * 0.4 +
      (snapshot.stability_index || 0) * 0.4 +
      (snapshot.entropy_balance || 0) * 0.2
    );

  const rawError =
    snapshot.stats && typeof snapshot.stats.avgError === "number"
      ? snapshot.stats.avgError
      : syntheticError;

  const error = Math.max(0, Math.min(rawError, 1));

  state.calls += 1;
  state.totalError += error;
  state.avgError =
    state.calls === 0
      ? 0
      : Number((state.totalError / state.calls).toFixed(4));

  const adjustedWeights = computeAdjustedWeights(snapshot.weights, error);

  state.weightHistory.push({
    at: new Date().toISOString(),
    error,
    weights: adjustedWeights,
  });

  // فقط آخرین ۵۰ تنظیم را نگه می‌داریم
  if (state.weightHistory.length > 50) {
    state.weightHistory = state.weightHistory.slice(-50);
  }

  state.lastSnapshot = snapshot;
  state.lastUpdate = new Date().toISOString();

  return {
    ...snapshot,
    weights: adjustedWeights,
    stats: {
      ...(snapshot.stats || {}),
      calls: state.calls,
      avgError: state.avgError,
      lastError: error,
    },
    memory: {
      lastUpdate: state.lastUpdate,
      lastError: error,
      totalCalls: state.calls,
      recentAdjustments: state.weightHistory.slice(-5),
    },
  };
}

/**
 * برای دیباگ یا مانیتورینگ داخلی
 */
export function getTrinityMemoryState() {
  return state;
}
