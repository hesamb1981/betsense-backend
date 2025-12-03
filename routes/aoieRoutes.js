// routes/aoieRoutes.js
import express from "express";
import { aoieDebug, aoieAnalyze } from "../controllers/aoieController.js";

const router = express.Router();

// ساده: دیباگ AOIE
router.get("/debug", aoieDebug);

// آنالیز اصلی AOIE
router.post("/analyze", aoieAnalyze);

export default router;
