// server.js

import express from "express";
import cors from "cors";

// همه روت‌های قبلی (NSI, RBS, Emotion, Genius, Fusion …)
import routes from "./routes/index.js";

// Meta Engine files
import metaRoutes from "./meta/metaRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Health check اصلی
app.get("/", (req, res) => {
  res.json({ ok: true, status: "BetSense Backend Running" });
});

// -----------------------------
// روت‌های اصلی تمام انجین‌ها
// -----------------------------
app.use("/api", routes);

// -----------------------------
// META BEHAVIOR ENGINE (Option D)
// -----------------------------
app.use("/api/meta", metaRoutes);

// -----------------------------
// 404 – هر مسیر دیگه
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
