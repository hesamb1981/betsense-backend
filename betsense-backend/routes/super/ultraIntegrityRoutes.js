// ultraIntegrityRoutes.js
// Trinity Integrity Layer - HTTP interface
// هدف: یک نقطه‌ی مشترک برای چک کردن سلامت ورودی‌های انجین‌ها

import express from "express";
import UltraIntegrityRuntime from "../../engines/super/super/ultraIntegrityRuntime.js";

const router = express.Router();

// ----------------- DEFAULT ENGINE REGISTRATION -----------------
// این‌جا فقط انجین‌ها را ثبت می‌کنیم تا اگر قانونی نداشتند، حداقل
// به خاطر "ENGINE_NOT_REGISTERED" رد نشوند و ok:true برگردد.
const KNOWN_ENGINES = [
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

for (const name of KNOWN_ENGINES) {
  UltraIntegrityRuntime.registerEngine(name, []);
}

// ----------------- ROUTES -----------------

// ساده‌ترین ورژن: یک نقطه برای چک کردن هر payload
// POST /super/integrity/check
// body: { engine: "nsi", payload: { ... } }
router.post("/check", (req, res) => {
  try {
    const { engine, engineName, payload } = req.body || {};

    const selectedEngine = engine || engineName;

    if (!selectedEngine) {
      return res.status(400).json({
        ok: false,
        error: "ENGINE_NAME_REQUIRED",
        message: "Field 'engine' (or 'engineName') is required"
      });
    }

    if (typeof payload === "undefined" || payload === null) {
      return res.status(400).json({
        ok: false,
        error: "PAYLOAD_REQUIRED",
        message: "Field 'payload' is required for integrity check"
      });
    }

    const report = UltraIntegrityRuntime.validatePayload(selectedEngine, payload);

    return res.json(report);
  } catch (err) {
    console.error("[UltraIntegrity] /check error:", err);

    return res.status(500).json({
      ok: false,
      error: "INTEGRITY_RUNTIME_EXCEPTION",
      message: err.message || "Unknown integrity runtime error"
    });
  }
});

// گرفتن آخرین گزارش ثبت‌شده برای یک انجین
// GET /super/integrity/last/:engine
router.get("/last/:engine", (req, res) => {
  try {
    const { engine } = req.params;

    const report = UltraIntegrityRuntime.getLastReport(engine);

    if (!report) {
      return res.status(404).json({
        ok: false,
        error: "NO_REPORT",
        message: `No integrity report stored for engine '${engine}'`
      });
    }

    return res.json(report);
  } catch (err) {
    console.error("[UltraIntegrity] /last error:", err);

    return res.status(500).json({
      ok: false,
      error: "INTEGRITY_RUNTIME_EXCEPTION",
      message: err.message || "Unknown integrity runtime error"
    });
  }
});

export default router;
