import express from "express";
import cors from "cors";

// ROUTES
import nsiRoutes from "./engine-nsi/nsiRoutes.js";
import rbsRoutes from "./engine-rbs/rbsRoutes.js";
import metaRoutes from "./meta/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// ENGINES
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);

// NOT FOUND (global)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
