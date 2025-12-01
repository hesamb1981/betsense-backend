import express from "express";

import metaRoutes from "./routes/metaRoutes.js";
import datasplineRoutes from "./routes/dataspineRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import emotionRoutes from "./routes/emotionRoutes.js";

const router = express.Router();

// -----------------------------
// HEALTH CHECK
// -----------------------------
router.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// -----------------------------
// CONNECT ALL ROUTES
// -----------------------------
router.use("/meta", metaRoutes);
router.use("/dataspine", datasplineRoutes);
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);
router.use("/genius", geniusRoutes);
router.use("/emotion", emotionRoutes);

export default router;
