import express from "express";
import cors from "cors";

// -------------------------
// IMPORT ROUTES
// -------------------------

// NSI & RBS & DATA ROUTES
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import aoieRoutes from "./routes/aoieRoutes.js";

// SUPER ENGINE ROUTES
import superRiskRoutes from "./routes/super/superRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// HEALTH CHECK ROOT
// -------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Backend",
    message: "Service is running",
    timestamp: new Date().toISOString(),
  });
});

// -------------------------
// REGISTER NORMAL ROUTES
// -------------------------
app.use("/nsi", nsiRoutes);
app.use("/rbs", rbsRoutes);
app.use("/dataspine", dataspineRoutes);
app.use("/genius", geniusRoutes);
app.use("/meta", metaRoutes);
app.use("/aoie", aoieRoutes);

// -------------------------
// REGISTER SUPER ENGINE ROUTES
// -------------------------
app.use("/super-risk", superRiskRoutes);
app.use("/ultra-momentum", ultraMomentumRoutes);
app.use("/ultra-risk", ultraRiskRoutes);
app.use("/ultra-fusion", ultraFusionRoutes);

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
