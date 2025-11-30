// server.js
import express from "express";
import cors from "cors";

import { geniusRouter } from "./routes/geniusRoutes.js";
import { nsiRouter } from "./routes/nsiRoutes.js";
import { rbsRouter } from "./routes/rbsRoutes.js";
import { metaRouter } from "./routes/metaRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// API routes
app.use("/api/genius", geniusRouter);
app.use("/api/nsi", nsiRouter);
app.use("/api/rbs", rbsRouter);
app.use("/api/meta", metaRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
