// betsense-backend/routes.js

import express from "express";

import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

const router = express.Router();

// -------- Engine route groups --------

// DataSpine Engine
router.use("/dataspine", dataspineRoutes);

// Genius / Emotion Engine
router.use("/genius", geniusRoutes);

// NSI Engine
router.use("/nsi", nsiRoutes);

// RBS Engine
router.use("/rbs", rbsRoutes);

// Meta Behavior Engine  🔥
router.use("/meta", metaRoutes);

export default router;
