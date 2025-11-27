// server.js
// Main Express server for BetSense backend.

import express from "express";
import cors from "cors";

// Routes
import geniusRoutes from "./routes/geniusRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ------------------------------
// Health Check (Root)
// ------------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "betsense-backend",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------
// Genius Engine Routes
// ------------------------------
app.use("/api/genius", geniusRoutes);

// ------------------------------
// Start Server
// ------------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
