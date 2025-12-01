// server.js  (نسخه‌ی تمیز و جدید)

// -------------------------
// Imports
// -------------------------
import express from "express";
import cors from "cors";

// Router files (همه از پوشه routes در روت پروژه)
import dataspineRoutes from "./routes/dataspineRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

// -------------------------
// App setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// تست ساده که ببینیم بک‌اند بالا هست
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// -------------------------
// API routes
// -------------------------
app.use("/api/dataspine", dataspineRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/genius", geniusRoutes);
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);

// -------------------------
// Start server
// -------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});

export default app;
