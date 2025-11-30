import express from "express";
import cors from "cors";

import rbsRoutes from "./engine/rbs/rbsRoutes.js";
import nsiRoutes from "./engine/nsi/nsiRoutes.js";
import metaRoutes from "./engine/meta/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// MAIN API ROUTES
// -------------------------
app.use("/api/rbs", rbsRoutes);
app.use("/api/nsi", nsiRoutes);
app.use("/api/meta", metaRoutes);

// -------------------------
// ROOT CHECK
// -------------------------
app.get("/", (req, res) => {
  res.json({ status: "Backend Running ✔️" });
});

// -------------------------
// NOT FOUND HANDLER
// -------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// -------------------------
// SERVER LISTEN
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
