import express from "express";
import cors from "cors";

// Super Engine Routes
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Root Test
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "BetSense Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Super Engines
app.use("/ultra-risk", ultraRiskRoutes);
app.use("/ultra-momentum", ultraMomentumRoutes);
app.use("/ultra-fusion", ultraFusionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Route Not Found",
  });
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
