import express from "express";
import cors from "cors";

// --------------------
// Import ALL engines
// --------------------
import routes from "./routes/index.js"; // NSI - RBS - Emotion - Genius - Fusion

// META (new engine)
import metaRoutes from "./engine/meta/metaRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ---------------------------
// MAIN HEALTH
// ---------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, status: "BetSense Backend Running" });
});

// ---------------------------
// OLD ENGINES
// ---------------------------
app.use("/api", routes);

// ---------------------------
// META ENGINE (Option D)
// ---------------------------
app.use("/api/meta", metaRoutes);

// ---------------------------
// 404
// ---------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ---------------------------
// START SERVER
// ---------------------------
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
