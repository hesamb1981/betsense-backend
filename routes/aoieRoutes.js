import express from "express";
import { debugAoie, runAoie } from "../controllers/aoieController.js";

const router = express.Router();

// Debug route  (GET)
router.get("/debug", debugAoie);

// Run route - GET برای تست ساده در مرورگر
router.get("/run", runAoie);

// Run route - POST برای ReqBin و فرانت‌اند
router.post("/run", runAoie);

export default router;
