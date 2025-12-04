// routes/ultraMasterRoutes.js
// Ultra Master Core – Orchestrator for all ultra engines

import express from "express";

const router = express.Router();

// --------------------------------------
// GET: Health Check
// --------------------------------------
router.get("/ultra/master-core/ping", (req, res) => {
  res.json({
    ok: true,
    layer: "ULTRA_MASTER_CORE",
    engines: ["ULTRA_RISK_CORE", "ULTRA_MOMENTUM_CORE", "ULTRA_FUSION_CORE"],
    message: "Ultra Master Core orchestrator is online",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------
// POST DEMO — Full Test Engine
// --------------------------------------
router.post("/ultra/master-core/demo", (req, res) => {
  const input = req.body || {};

  res.json({
    ok: true,
    layer: "ULTRA_MASTER_CORE",
    received: input,
    output: {
      ultraRisk: "ACTIVE",
      ultraMomentum: "BALANCED",
      ultraFusion: "SYNCED",
      masterConfidence: 0.94,
    },
    message: "Ultra Master POST demo received",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------
// NEW: HTML PAGE → Allows POST from browser
// --------------------------------------
router.get("/ultra/master-core/post-tester", (req, res) => {
  res.send(`
    <html>
      <body style="font-family:Arial; padding:40px;">
        <h2>Ultra Master Core POST Tester</h2>
        <p>Tap the button below to send a POST request.</p>

        <button 
          onclick="sendPost()" 
          style="padding:12px 25px; font-size:16px; background:black; color:white; border:none; border-radius:6px;"
        >
          Send POST Request
        </button>

        <pre id="output" style="margin-top:20px; background:#f3f3f3; padding:15px;"></pre>

        <script>
          function sendPost() {
            fetch('/ultra/master-core/demo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ test: 'Hello Master Core' })
            })
            .then(res => res.json())
            .then(data => {
              document.getElementById('output').textContent = JSON.stringify(data, null, 2);
            })
            .catch(err => alert('Error: ' + err));
          }
        </script>
      </body>
    </html>
  `);
});

export default router;
