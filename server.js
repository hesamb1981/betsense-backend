import express from "express";
import cors from "cors";

// Routes for independent engines (inside /engine/routes)
import nsiRoutes from "./engine/routes/nsiRoutes.js";
import rbsRoutes from "./engine/routes/rbsRoutes.js";
import metaRoutes from "./engine/routes/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Attach engine APIs
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);

// Root health
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Engine Backend",
    engines: ["NSI", "RBS", "META"],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("BetSense Engine Backend running on port", PORT);
});
