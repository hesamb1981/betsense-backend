import express from "express";
import cors from "cors";

// ----- IMPORT ROUTES -----
import rbsRoutes from "./engine/routes/rbsRoutes.js";

// ----- EXPRESS APP -----
const app = express();
app.use(cors());
app.use(express.json());

// ----- DEFAULT ROOT -----
app.get("/", (req, res) => {
  res.json({ status: "BetSense backend running" });
});

// ----- HEALTH CHECK -----
app.get("/api/rbs/health", (req, res) => {
  res.json({ status: "OK", engine: "RBS Engine Active" });
});

// ----- ROUTES -----
app.use("/api/rbs", rbsRoutes);

// ----- 404 HANDLER -----
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ----- START SERVER -----
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
