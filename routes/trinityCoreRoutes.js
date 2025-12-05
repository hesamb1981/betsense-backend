import express from "express";
import { getTrinitySnapshot, getTrinityMemory, updateTrinityMemory } from "../controllers/trinityCoreController.js";

const router = express.Router();

// Snapshot (simulation + live)
router.get("/snapshot", getTrinitySnapshot);

// Memory → read
router.get("/memory", getTrinityMemory);

// Memory → update (NEW)
router.post("/memory/update", updateTrinityMemory);

export default router;
