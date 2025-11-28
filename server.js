import express from "express";
import cors from "cors";

import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);

// HEALTH
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
