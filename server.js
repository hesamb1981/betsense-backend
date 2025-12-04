// server.js
// BetSense Ultra Backend – Super Engines (AOIE + Super Cores)

import express from "express";
import cors from "cors";

// -----------------------------
// 1) ROUTE IMPORTS
// -----------------------------
import aoieRoutes from "./routes/aoieRoutes.js";
import dataSpineRoutes from "./routes/dataspineRoutes.js";

import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

// Super / Ultra cores
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraFusionRoutes from "./routes/ultraFusionRoutes.js";

// -----------------------------
// 2) APP INIT
// -----------------------------
const app = express();

app.use(cors());
app.use(express.json());

// -----------------------------
// 3) BASIC HEALTH CHECK
// -----------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "BetSense Ultra backend online",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------
// 4) LEGACY / BASE ENGINES
// -----------------------------
app.use("/aoie", aoieRoutes);
app.use("/dataspine", dataSpineRoutes);

app.use("/genius", geniusRoutes);
app.use("/meta", metaRoutes);
app.use("/nsi", nsiRoutes);
app.use("/rbs", rbsRoutes);

// -----------------------------
// 5) SUPER ULTRA CORES
// -----------------------------
// Ultra Risk Core
app.use("/ultra-risk", ultraRiskRoutes);

// Ultra Momentum Core
app.use("/ultra-momentum", ultraMomentumRoutes);

// Ultra Fusion Core
app.use("/ultra-fusion", ultraFusionRoutes);

// -----------------------------
// 6) 404 FALLBACK
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// -----------------------------
// 7) START SERVER
// -----------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("========================================");
  console.log(` BetSense Ultra backend running on port ${PORT}`);
  console.log("========================================");
});
