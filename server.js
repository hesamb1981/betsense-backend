import express from "express";
import cors from "cors";

// ---- ROUTES ----
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

const app = express();

// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());

// ---- HEALTH ROOT ----
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Ultra Backend",
    routes: ["/api/nsi", "/api/rbs", "/api/meta"],
  });
});

// ---- API ROUTES ----
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);

// ---- 404 HANDLER ----
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl || null,
  });
});

// ---- START SERVER ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("BetSense backend running on port", PORT);
});
