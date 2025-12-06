// ultraIntegrityRuntime.js
// Trinity Integrity Layer - Ultra Integrity Runtime
// هدف: چک کردن صحت و سلامت داده‌ها قبل از ورود به انجین‌ها

const UltraIntegrityRuntime = {
  // ساختار ثبت انجین‌ها و قانون‌هایشان
  registry: {},

  /**
   * ثبت یک انجین برای کنترل Integrity
   * name: نام انجین (مثلاً "nsi" یا "ultra_risk")
   * rules: آرایه‌ای از فانکشن‌ها که هر کدام یک چک انجام می‌دهند
   *  (payload) => { ok: boolean, code: string, message: string }
   */
  registerEngine(name, rules = []) {
    this.registry[name] = {
      rules,
      lastReport: null
    };
  },

  /**
   * اجرای چک Integrity روی یک payload
   * خروجی: { ok: boolean, engine: string, issues: [], timestamp: string }
   */
  validatePayload(engineName, payload) {
    const engineEntry = this.registry[engineName];

    if (!engineEntry) {
      return {
        ok: false,
        engine: engineName,
        issues: [
          {
            code: "ENGINE_NOT_REGISTERED",
            message: `Engine '${engineName}' is not registered in UltraIntegrityRuntime`
          }
        ],
        timestamp: new Date().toISOString()
      };
    }

    const issues = [];

    for (const rule of engineEntry.rules) {
      try {
        const result = rule(payload);

        // اگر قانون بالای فانکشن ok: false برگرداند، به issues اضافه می‌کنیم
        if (!result.ok) {
          issues.push({
            code: result.code || "RULE_FAILED",
            message: result.message || "Unknown integrity rule failure"
          });
        }
      } catch (err) {
        issues.push({
          code: "RULE_EXCEPTION",
          message: err.message || "Exception inside integrity rule"
        });
      }
    }

    const ok = issues.length === 0;

    const report = {
      ok,
      engine: engineName,
      issues,
      timestamp: new Date().toISOString()
    };

    this.registry[engineName].lastReport = report;

    return report;
  },

  /**
   * گرفتن آخرین گزارش Integrity برای یک انجین
   */
  getLastReport(engineName) {
    return this.registry[engineName]?.lastReport || null;
  }
};

export default UltraIntegrityRuntime;
