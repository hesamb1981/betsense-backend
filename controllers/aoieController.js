// =======================
//  AOIE Controller (FINAL)
// =======================

import aoieEngine from "../aoie/aoieEngine.js";
import testPayload from "../aoie/testPayload.json" assert { type: "json" };

// ---------------------------
// 1) Test Endpoint
// ---------------------------
export const aoieTest = async (req, res) => {
  try {
    const result = aoieEngine.run(testPayload);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "AOIE Test Error",
      detail: err.message,
    });
  }
};

// ---------------------------
// 2) Main Analyze Endpoint
// ---------------------------
export const aoieAnalyze = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({
        ok: false,
        error: "Payload is required",
      });
    }

    const result = aoieEngine.run(payload);

    return res.json({
      ok: true,
      engine: "AOIE",
      result,
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "AOIE Analyze Error",
      detail: err.message,
    });
  }
};
