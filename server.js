import express from "express";
import cors from "cors";

// روت‌های اصلی سیستم (NSI، RBS، Fusion و غیره)
import mainRoutes from "./routes.js";

// روت اختصاصی AOIE
import aoieRoutes from "./routes/aoieRoutes.js";

const app = express();

// میدل‌ورها
app.use(cors());
app.use(express.json());

// روت سلامت اصلی بک‌اند
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// روت‌های اصلی BetSense (همون قبلی‌ها)
app.use("/api", mainRoutes);

// روت‌های AOIE زیر /aoie
app.use("/aoie", aoieRoutes);

// پورت رندر
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
