import express from "express";

const router = express.Router();

router.get("/intelligence-core", async (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h2>Intelligence Core POST Tester</h2>

        <button onclick="sendPost()" 
          style="padding: 10px 20px; background: black; color: white; border-radius: 6px;">
          Send POST Request
        </button>

        <pre id="result" style="margin-top:20px; background:#222; color:#0f0; padding:15px;"></pre>

        <script>
          async function sendPost() {
            const response = await fetch("/super/intelligence-core", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                matchId: "TEST12345",
                homeTeam: "Team A",
                awayTeam: "Team B"
              })
            });

            const text = await response.text();
            document.getElementById("result").innerText = text;
          }
        </script>
      </body>
    </html>
  `);
});

export default router;
