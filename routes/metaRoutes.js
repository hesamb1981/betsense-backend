// routes/metaRoutes.js
import express from "express";
import metaController from "../controllers/metaController.js";

const router = express.Router();

// Health check برای Meta Behavior Engine
router.get("/health", metaController.health);

// Demo ساده برای تست
router.get("/demo", metaController.demo);

export default router;
