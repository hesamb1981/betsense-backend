import express from "express";
import dataspineController from "../controllers/dataspineController.js";

const router = express.Router();

// Demo
router.post("/demo", dataspineController.demo);

// Live
router.post("/live", dataspineController.live);

export default router;
