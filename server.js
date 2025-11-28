import express from "express";
import cors from "cors";

// Correct paths (because backend has controllers inside /src)
import rbsRoutes from "./src/routes/rbsRoutes.js";
import nsiRoutes from "./src/routes/nsiRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rbs", rbsRoutes);
app.use("/api/nsi", nsiRoutes);

// Health route
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// Not found
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
