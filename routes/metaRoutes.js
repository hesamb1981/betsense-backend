// metaRoutes.js
// Routes for Meta Behavior Engine

import express from "express";
import metaController from "./metaController.js";

const router = express.Router();

// Health check for Meta engine
router.get("/health", metaController.health);

// Demo endpoint (used by meta-demo.js / demo UI)
router.post("/demo", metaController.demo);

// Live endpoint (used by meta-live.js / future live wiring)
router.post("/live", metaController.live);

export default router;
