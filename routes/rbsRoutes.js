import express from "express";
import { rbsHealthCheck, rbsDemo } from "../controllers/rbsController.js";

const router = express.Router();

// Health check
router.get("/", (req, res) => {
  return res.json({
    ok: true,
    engine: "RBS Engine",
    status: "RBS route OK",
  });
});

// Demo endpoint
router.get("/demo", rbsDemo);

// Health endpoint
router.get("/health", rbsHealthCheck);

export default router;
