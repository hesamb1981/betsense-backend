// server.js
// -----------------------------
// BetSense Backend Main Server

import express from "express";
import cors from "cors";

import routes from "./routes.js";
import aoieRoutes from "./routes/aoieRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// روت سلامت اصلی بک‌اند
app.get("/", (req, res) => {
  return res.json({
    ok: true,
    status: "Backend Running"
  });
});

// روت‌های عمومی قبلی (متا، دیتااسپاین، NSI، RBS، Emotion، Genius و ...)
app.use("/api", routes);

// روت‌های مخصوص AOIE (بتینگ‌شاپ‌ها)
app.use("/api/aoie", aoieRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});

export default app;
