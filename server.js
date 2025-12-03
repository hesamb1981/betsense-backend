import express from "express";
import cors from "cors";

// Main API router (existing routes for other engines)
import routes from "./routes.js";

// AOIE routes (new engine for betting shops)
import aoieRoutes from "./routes/aoieRoutes.js";

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check for whole backend
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// Existing engines under /api
app.use("/api", routes);

// AOIE engine dedicated routes
app.use("/api/aoie", aoieRoutes);

// Port & listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
