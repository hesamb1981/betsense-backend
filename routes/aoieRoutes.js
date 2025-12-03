// routes/aoieRoutes.js

import { Router } from "express";
import { debugAoie, runAoie } from "../controllers/aoieController.js";

const router = Router();

// تست سلامت AOIE
router.get("/debug", debugAoie);

// اجرای AOIE – هم با GET هم با POST کار می‌کند
router.get("/run", runAoie);
router.post("/run", runAoie);

export default router;
