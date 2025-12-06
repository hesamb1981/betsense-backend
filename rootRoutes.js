// rootRoutes.js

import express from "express";

import aoieRoutes from "./routes/aoieRoutes.js";
import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import superRiskRoutes from "./routes/superRiskRoutes.js";
import trinityCoreRoutes from "./routes/trinityCoreRoutes.js";
import ultraMasterRoutes from "./routes/ultraMasterRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";

// --- SUPER / INTERNAL LAYERS ---
import trinityMemoryRoutes from "./routes/super/trinityMemoryRoutes.js";
import engineHealthRoutes from "./routes/super/engineHealthRoutes.js";
import ultraIntegrityRoutes from "./routes/super/ultraIntegrityRoutes.js";

const router = express.Router();

// ----------------- ROOT HEALTH CHECK -----------------
router.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
    services: ["AOIE_ENGINE", "TRINITY_CORE", "ULTRA_MASTER_ENGINE"],
    timestamp: new Date().toISOString()
  });
});

// ----------------- MAIN ENGINES -----------------
router.use("/aoie", aoieRoutes);
router.use("/dataspine", dataspineRoutes);
router.use("/genius", geniusRoutes);
router.use("/meta", metaRoutes);
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);
router.use("/super-risk", superRiskRoutes);
router.use("/trinity-core", trinityCoreRoutes);
router.use("/ultra-master", ultraMasterRoutes);
router.use("/ultra-momentum", ultraMomentumRoutes);
router.use("/ultra-risk", ultraRiskRoutes);

// ----------------- SUPER / INTERNAL LAYERS -----------------
router.use("/trinity-core/memory", trinityMemoryRoutes);
router.use("/super/engines", engineHealthRoutes);
router.use("/super/integrity", ultraIntegrityRoutes);

export default router;
