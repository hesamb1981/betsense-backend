// server.js
// BetSense Ultra Backend – with Super & Intelligence layers

import express from "express";
import cors from "cors";

// 🔹 Base engine routes
import aoieRoutes from "./routes/aoieRoutes.js";
import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

// 🔹 Ultra Super Cores
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js";
import superRiskRoutes from "./routes/superRiskRoutes.js";

// 🔹 Orchestrators
import ultraMasterRoutes from "./routes/ultraMasterRoutes.js";
import intelligenceRoutes from "./routes/super/intelligenceRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// -------------------------------
// Middlewares
// -------------------------------
app.use(cors());
app.use(express.json());

// -------------------------------
// Root status
// -------------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Ultra Backend",
    message: "Backend is live and ready",
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------
// Attach base engine routes
// -------------------------------
app.use(aoieRoutes);
app.use(dataspineRoutes);
app.use(geniusRoutes);
app.use(metaRoutes);
app.use(nsiRoutes);
app.use(rbsRoutes);

// -------------------------------
// Attach Ultra Super Core routes
// -------------------------------
app.use(ultraRiskRoutes);
app.use(ultraMomentumRoutes);
app.use(ultraFusionRoutes);
app.use(superRiskRoutes);

// -------------------------------
// Attach orchestrator layers
// -------------------------------
app.use(ultraMasterRoutes);
app.use(intelligenceRoutes);

// -------------------------------
// Start server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
