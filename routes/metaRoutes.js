// src/routes/metaRoutes.js
import express from "express";
import { metaHealth, metaDemo, metaLive } from "../controllers/metaController.js";

const router = express.Router();

// Health check
router.get("/health", metaHealth);

// Demo endpoint
router.post("/demo", metaDemo);

// Live endpoint
router.post("/live", metaLive);

export default router;
