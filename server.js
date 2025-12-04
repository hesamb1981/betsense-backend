import express from "express";
import cors from "cors";

// ----------------------
//  Import engine routes
// ----------------------

// Core + legacy engines
import aoieRoutes from "./routes/aoieRoutes.js";
import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

// Super / Ultra engines
import superRiskRoutes from "./routes/superRiskRoutes.js";
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js"; // ✅ مسیر درست

const app = express();
const PORT = process.env.PORT || 10000;

// ----------------------
//  Global middleware
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
//  Root health-check
// ----------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "BetSense Ultra backend is online",
    timestamp: new Date().toISOString(),
  });
});

// ----------------------
//  Core engine mounts
// ----------------------
app.use("/aoie", aoieRoutes);
app.use("/dataspine", dataspineRoutes);
app.use("/genius", geniusRoutes);
app.use("/meta", metaRoutes);
app.use("/nsi", nsiRoutes);
app.use("/rbs", rbsRoutes);

// ----------------------
//  Super / Ultra engine mounts
// ----------------------
app.use("/super-risk", superRiskRoutes);
app.use("/ultra-risk", ultraRiskRoutes);
app.use("/ultra-momentum", ultraMomentumRoutes);
app.use("/ultra-fusion", ultraFusionRoutes);

// ----------------------
//  404 fallback
// ----------------------
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ----------------------
//  Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});

export default app;
