import express from "express";
import metaController from "../controllers/metaController.js";

const router = express.Router();

// Health check for Meta Behavior Engine
router.get("/health", metaController.health);

// Demo endpoint – used by meta-demo.js (Netlify / UI)
router.post("/demo", metaController.demo);

// Live endpoint – used by meta-live.js (backend / live engines)
router.post("/live", metaController.live);

export default router;
