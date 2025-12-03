import express from "express";
import { debugAoie, runAoie } from "../controllers/aoieController.js";

const router = express.Router();

// تست ساده برای این که مطمئن شویم روتر AOIE کار می‌کند
router.get("/debug", debugAoie);

// این همان روت اصلی است که باید POST روی /aoie/run را هندل کند
router.post("/run", runAoie);

export default router;
