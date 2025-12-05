// routes/super/intelligenceRoutes.js
// Intelligence Core v1.0 – Super Orchestrator Layer

import express from "express";

const router = express.Router();

// ----------------------------------------
// 1) HEALTH CHECK  (GET /super/intelligence-core)
// ----------------------------------------
router.get("/super/intelligence-core", (req, res) => {
  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Intelligence Core v1.0 online",
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------
// 2) MAIN POST ENDPOINT
//    (POST /super/intelligence-core)
// ----------------------------------------
router.post("/super/intelligence-core", (req, res) => {
  const payload = req.body || {};

  const matchId = payload.matchId || "INTEL-DEMO-001";

  const ultraRiskScore = 0.87;
  const ultraMomentumScore = 0.76;
  const ultraFusionScore = 0.91;

  const intelligenceScore =
    (ultraRiskScore * 0.35 +
      ultraMomentumScore * 0.25 +
      ultraFusionScore * 0.40);

  const decisionBand =
    intelligenceScore >= 0.85
      ? "ULTRA_EDGE"
      : intelligenceScore >= 0.70
      ? "STRONG_EDGE"
      : intelligenceScore >= 0.55
      ? "BALANCED_EDGE"
      : "NEUTRAL";

  res.json({
    ok: true,
    layer: "INTELLIGENCE_CORE",
    matchId,
    inputPreview: payload,
    engines: {
      ultraRisk: {
        code: "ULTRA_RISK_CORE",
        signal: "ACTIVE",
        score: ultraRiskScore,
      },
      ultraMomentum: {
        code: "ULTRA_MOMENTUM_CORE",
        signal: "BALANCED",
        score: ultraMomentumScore,
      },
      ultraFusion: {
        code: "ULTRA_FUSION_CORE",
        signal: "SYNCED",
        score: ultraFusionScore,
      },
    },
    intelligence: {
      score: Number(intelligenceScore.toFixed(3)),
      decisionBand,
      narrative:
        "Synthetic Intelligence Core score generated from three Ultra engines (risk, momentum, fusion) – demo-only, no external data.",
    },
    meta: {
      note: "Intelligence Core v1.0 demo response – wiring and orchestration layer are correct.",
      timestamp: new Date().toISOString(),
    },
  });
});

// ----------------------------------------
// 3) SIMPLE POST TEST PAGE (HTML)
//    (GET /test/intelligence-core)
// ----------------------------------------
router.get("/test/intelligence-core", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Intelligence Core POST Tester</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #050816;
        color: #f9fafb;
        padding: 24px;
      }
      h1 {
        font-size: 22px;
        margin-bottom: 12px;
      }
      button {
        padding: 10px 18px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 16px;
      }
      #sendBtn {
        background: linear-gradient(135deg, #22c55e, #4ade80);
      }
      pre {
        background: #020617;
        border-radius: 12px;
        padding: 16px;
        font-size: 12px;
        overflow-x: auto;
        border: 1px solid #1e293b;
      }
    </style>
  </head>
  <body>
    <h1>Intelligence Core POST Tester</h1>
    <p>Tap the button below to send a POST request.</p>
    <button id="sendBtn">Send POST Request</button>
    <pre id="output">{}</pre>

    <script>
      const btn = document.getElementById("sendBtn");
      const out = document.getElementById("output");

      btn.addEventListener("click", async () => {
        out.textContent = "Sending request...";
        try {
          const res = await fetch("/super/intelligence-core", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              test: "Hello Intelligence Core",
              source: "HTML tester",
            }),
          });
          const json = await res.json();
          out.textContent = JSON.stringify(json, null, 2);
        } catch (err) {
          out.textContent = "Error: " + err.message;
        }
      });
    </script>
  </body>
</html>`);
});

export default router;
