import express from "express";

// Import main super-engine routes
import intelligenceRoutes from "./routes/super/intelligenceRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js";

// Import test routes
import intelligenceTestRoutes from "./routes/test/intelligenceTest.js";

const router = express.Router();

// ROOT CHECK
router.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Ultra Backend Router",
    message: "Routing system online",
    timestamp: new Date().toISOString()
  });
});

// Super Engine API Routes
router.use("/super", intelligenceRoutes);
router.use("/super", ultraFusionRoutes);

// Test Routes
router.use("/test", intelligenceTestRoutes);

export default router;
