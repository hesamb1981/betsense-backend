// routes/dataSpineRoutes.js
import express from "express";
import { dataSpineHandler } from "../controllers/dataSpineController.js";

const router = express.Router();

router.post("/generate", dataSpineHandler);

export default router;
