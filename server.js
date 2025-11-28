// server.js  (betsense-backend)

import express from "express";
import cors from "cors";

// مسیرهای درست (بدون src و بدون engine)
import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// -------------------------
//  API ROUTES
// -------------------------

// Genius Engine
app.use("/api/genius", geniusRoutes);

// NSI Engine
app.use("/api/nsi", nsiRoutes);

// RBS Engine
app.use("/api/rbs", rbsRoutes);

// -------------------------
//  ROOT HEALTH CHECK
// -------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, status: "BetSense backend running" });
});

// -------------------------
//  404 HANDLER
// -------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
