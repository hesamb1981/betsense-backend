// routes/metaRoutes.js
import express from "express";
import { metaHealth, metaDemo, metaLive } from "../controllers/metaController.js";

const router = express.Router();

router.get("/health", metaHealth);
router.post("/demo", metaDemo);
router.post("/live", metaLive);

export default router;
