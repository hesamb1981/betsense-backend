import express from "express";
import { debugAoie, runAoie } from "../controllers/aoieController.js";

const router = express.Router();

// Debug route
router.get("/debug", debugAoie);

// Run route
router.get("/run", runAoie);

export default router;
