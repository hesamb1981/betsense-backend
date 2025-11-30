// routes/metaRoutes.js
import express from "express";
import { metaDemo, metaLive } from "../controllers/metaController.js";

const router = express.Router();

// GET /api/meta/demo
router.get("/demo", metaDemo);

// GET /api/meta/live
router.get("/live", metaLive);

export default router;
