// server.js
import express from "express";
import cors from "cors";

import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// Engine routes
app.use("/api/genius", geniusRoutes);
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
