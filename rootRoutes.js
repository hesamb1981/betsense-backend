// rootRoutes.js
import express from "express";

// AOIE Engine routes
import aoieRoutes from "./routes/aoieRoutes.js";

// TRINITY CORE routes
import trinityCoreRoutes from "./routes/trinityCoreRoutes.js";
import ultraMasterRoutes from "./routes/ultraMasterRoutes.js";
const router = express.Router();

// Root test route
router.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "BetSense Backend Running",
    services: ["AOIE_ENGINE", "TRINITY_CORE"],
    timestamp: new Date().toISOString()
  });
});

// ----------------------
// REGISTER THE ROUTES
// ----------------------

// AOIE Engine
router.use("/aoie", aoieRoutes);

// TRINITY CORE
router.use("/trinity", trinityCoreRoutes);

export default router;
app.use("/ultra-master", ultraMasterRoutes);
