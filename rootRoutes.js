import express from "express";

// Import routes
import aoieRoutes from "./routes/aoieRoutes.js";
import trinityCoreRoutes from "./routes/trinityCoreRoutes.js";
import ultraMasterRoutes from "./routes/ultraMasterRoutes.js";

const router = express.Router();

// Root check
router.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
    services: [
      "AOIE_ENGINE",
      "TRINITY_CORE",
      "ULTRA_MASTER_ENGINE"
    ],
    timestamp: new Date().toISOString()
  });
});

// AOIE
router.use("/aoie", aoieRoutes);

// Trinity Core
router.use("/trinity", trinityCoreRoutes);

// Ultra Master Engine
router.use("/ultra-master", ultraMasterRoutes);

export default router;
