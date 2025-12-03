// routes/aoieRoutes.js
// -----------------------------
// AOIE API Routes (Bet Shops Edition)

import express from "express";
import {
  aoieHealth,
  aoieTest,
  aoieTrain
} from "../controllers/aoie/aoieController.js";

const router = express.Router();

// سلامت AOIE
router.get("/health", aoieHealth);

// تست AOIE با ورودی دمو
router.get("/test", aoieTest);

// آموزش AOIE با STI Trainer
// مثال:
//   /api/aoie/train?matchId=M-ARS-TOT-2025-01-05&score=0.2
router.get("/train", aoieTrain);

export default router;
