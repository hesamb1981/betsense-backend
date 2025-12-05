// server.js
// BetSense Ultra Backend – Full Router Wiring

import express from "express";
import cors from "cors";

// 🔹 Existing engine routes
import aoieRoutes from "./routes/aoieRoutes.js";
import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

// 🔹 Intelligence Core v1.0
import intelligenceCoreRoutes from "./routes/intelligenceCoreRoutes.js";

// 🔹 Ultra Super Engines (Risk / Momentum / Fusion / Super-Risk / Master)
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js";
import superRiskRoutes from "./routes/superRiskRoutes.js";
import ultraMasterRoutes from "./routes/ultraMasterRoutes.js";

// 🔹 Meta-Behavior Engine v1.0
import metaBehaviorEngineRoutes from "./routes/metaBehaviorEngine.js";

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
// Attach all route modules
// -------------------------------
app.use(aoieRoutes);
app.use(dataspineRoutes);
app.use(geniusRoutes);
app.use(metaRoutes);
app.use(nsiRoutes);
app.use(rbsRoutes);
 
// Intelligence Core
app.use(intelligenceCoreRoutes);

// Ultra Super Cores
app.use(ultraRiskRoutes);
app.use(ultraMomentumRoutes);
app.use(ultraFusionRoutes);
app.use(superRiskRoutes);
app.use(ultraMasterRoutes);

// Meta-Behavior Engine
app.use(metaBehaviorEngineRoutes);

// -------------------------------
// Start server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
