import express from "express";
import cors from "cors";

import nsiRoutes from "./engine/routes/nsiRoutes.js";
import rbsRoutes from "./engine/routes/rbsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// ROOT TEST
// -------------------------
app.get("/", (req, res) => {
  res.json({ status: "BetSense backend running ✔️" });
});

// -------------------------
// ROUTES
// -------------------------
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);

// -------------------------
// 404 HANDLER
// -------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// -------------------------
// START SERVER
// -------------------------
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
