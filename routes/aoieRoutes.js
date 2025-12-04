import express from "express";
import { debugAoie, runAoie } from "../controllers/aoieController.js";

const router = express.Router();

// Debug route — برای تست سریع
router.get("/debug", debugAoie);

// Run route — این همونیه که فرانت‌اند صدا می‌زنه
// توجه: حتماً باید POST باشد، نه GET
router.post("/run", runAoie);

export default router;
