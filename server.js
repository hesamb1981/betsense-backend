// server.js
import express from "express";
import cors from "cors";

import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ساده‌ترین هلت‌چک برای Render
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// -------------------
//  API ROUTES
// -------------------
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/genius", geniusRoutes);
app.use("/api/meta", metaRoutes);

// -------------------
//  START SERVER
// -------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
