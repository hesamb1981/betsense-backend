import express from "express";
import { pingUltraRisk, runUltraRisk } from "../controllers/ultraRiskController.js";

const router = express.Router();

router.get("/ping", pingUltraRisk);
router.post("/run", runUltraRisk);

export default router;
