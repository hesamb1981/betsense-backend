import express from "express";
import cors from "cors";

// --- Correct absolute paths based on YOUR project structure ---
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- Register Routes ---
app.use("/api/nsi", nsiRoutes);
app.use("/api/rbs", rbsRoutes);

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend is running" });
});

// --- Not found ---
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
