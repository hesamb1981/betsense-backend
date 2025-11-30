import express from "express";
import cors from "cors";

import rbsRoutes from "./src/routes/rbsRoutes.js";
import nsiRoutes from "./src/routes/nsiRoutes.js";
import metaRoutes from "./src/routes/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Engine APIs
app.use("/api/rbs", rbsRoutes);
app.use("/api/nsi", nsiRoutes);
app.use("/api/meta", metaRoutes);

// Root health
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "BetSense backend running",
    engines: {
      rbs: "/api/rbs",
      nsi: "/api/nsi",
      meta: "/api/meta",
    },
  });
});

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("BetSense backend running on port", PORT);
});
