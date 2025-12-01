import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import geniusRoutes from "./routes/geniusRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// ROOT TEST
// ----------------------
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// ----------------------
// ENGINE ROUTES
// ----------------------
app.use("/api/genius", geniusRoutes);
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);
app.use("/api/meta", metaRoutes);   // <-- مهم‌ترین خط

// ----------------------
// STATIC
// ----------------------
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
