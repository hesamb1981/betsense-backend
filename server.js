import express from "express";
import cors from "cors";

// --------------------------
// ROUTES
// --------------------------
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// --------------------------
// API MOUNT POINTS
// --------------------------
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);

// --------------------------
// ROOT HEALTH
// --------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
    engines: ["NSI", "RBS", "META"],
  });
});

// --------------------------
// 404 HANDLER
// --------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --------------------------
// SERVER START
// --------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("BetSense backend running on port", PORT);
});
