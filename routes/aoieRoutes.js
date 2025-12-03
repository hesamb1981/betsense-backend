import express from "express";
import { debugAoie, runAoie } from "../controllers/aoieController.js";

const router = express.Router();

// Debug route (GET - برای چک کردن سلامت AOIE)
router.get("/debug", debugAoie);

// Run route (GET - برای تست ساده در مرورگر)
router.get("/run", runAoie);

// Run route (POST - برای تست با ReqBin و سایر کلاینت‌ها)
router.post("/run", runAoie);

export default router;
