import express from "express";
import cors from "cors";

// Routes
import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";   // ← NEW (Meta Engine)

// Create App
const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// Attach Routes
app.use("/api/genius", geniusRoutes);
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);   // ← NEW (Meta Engine Route)

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
