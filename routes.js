// routes.js
// Master router for BetSense backend

import express from "express";

import metaRoutes from "./routes/metaRoutes.js";
import dataspineRoutes from "./routes/dataspineRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// Engine Routes
router.use("/meta", metaRoutes);
router.use("/dataspine", dataspineRoutes);
router.use("/genius", geniusRoutes);
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);

export default router;
