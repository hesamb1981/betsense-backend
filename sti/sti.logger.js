// sti/sti.logger.js
// ---------------------------------------------
// این فایل تمام ورودی/خروجی‌های AOIE را لاگ می‌کند
// هر خط در فایل aoie-runs.jsonl یک رکورد مجزاست

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_PATH = path.join(__dirname, "logs");
const LOG_FILE = path.join(LOG_PATH, "aoie-runs.jsonl");

// مطمئن می‌شویم پوشه logs وجود دارد
if (!fs.existsSync(LOG_PATH)) {
  fs.mkdirSync(LOG_PATH, { recursive: true });
}

// تابع لاگ‌گیر
export function logAoieRun({ input, output, weightsVersion }) {
  try {
    const record = {
      timestamp: new Date().toISOString(),
      matchId: input?.match?.matchId || null,
      weightsVersion: weightsVersion || 1,
      inputFingerprint: {
        tis: input?.dataspin?.tisScore,
        neds: input?.dataspin?.nonEventPressureScore,
        chaos: input?.dataspin?.matchChaosIndex
      },
      outputFingerprint: {
        gdi: output?.gdi,
        globalRiskScore: output?.globalRisk?.globalRiskScore,
        antiOutcomeCount: output?.antiOutcomeSignals?.length || 0
      }
    };

    const line = JSON.stringify(record);
    fs.appendFileSync(LOG_FILE, line + "\n");

    return true;
  } catch (err) {
    console.error("STI logger error:", err);
    return false;
  }
}
