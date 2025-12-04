import express from "express";
import cors from "cors";

// روت‌های اصلی سیستم BetSense (NSI، RBS، Fusion و بقیه)
import mainRoutes from "./routes.js";

// روت اختصاصی AOIE (Odds Intelligence Engine)
import aoieRoutes from "./routes/aoieRoutes.js";

const app = express();

// --------------------
// Middleware ها
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// روت سلامت اصلی بک‌اند
// --------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// --------------------
// روت‌های اصلی BetSense (همون قبلی‌ها)
// همه‌ی APIهای قبلی زیر /api در دسترس هستن
// --------------------
app.use("/api", mainRoutes);

// --------------------
// روت‌های AOIE زیر /aoie
// مثال: GET  /aoie/debug
//        POST /aoie/run
// --------------------
app.use("/aoie", aoieRoutes);

// --------------------
// شروع سرور روی Render
// --------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
