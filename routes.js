// routes.js (ROOT)

import express from "express";

// AOIE Engine routes
import aoieRoutes from "./routes/aoieRoutes.js";

const router = express.Router();

// Root test route
router.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
    services: ["AOIE_ENGINE", "TRINITY_CORE"],
    timestamp: new Date().toISOString()
  });
});

// AOIE Engine
router.use("/aoie", aoieRoutes);

// Trinity Core – simple inline test route
router.get("/trinity/core-test", (req, res) => {
  res.json({
    ok: true,
    layer: "TRINITY_CORE_TEST",
    message: "Trinity Core inline route /trinity/core-test is working ✅",
    timestamp: new Date().toISOString()
  });
});

export default router;
