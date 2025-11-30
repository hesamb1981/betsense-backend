// routes/metaRoutes.js
// Meta Behavior Engine – API routes

import express from "express";
import metaController from "../controllers/metaController.js";

const router = express.Router();

// GET /api/meta/health
router.get("/health", metaController.health);

// GET /api/meta/demo
router.get("/demo", metaController.demo);

// POST /api/meta/analyze
router.post("/analyze", metaController.analyze);

export default router;
