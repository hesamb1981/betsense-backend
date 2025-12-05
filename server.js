// routes.js (ROOT)

import express from "express";

// AOIE Engine routes
import aoieRoutes from "./routes/aoieRoutes.js";

// Trinity Core routes
import trinityCoreRoutes from "./routes/trinityCoreRoutes.js";

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

// Trinity Core
router.use("/trinity", trinityCoreRoutes);

export default router;
