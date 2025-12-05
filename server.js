import express from "express";
import cors from "cors";

// روتر روت اصلی (AOIE و غیره)
import rootRouter from "./rootRoutes.js";

// روتر مستقیم Trinity Core
import trinityCoreRoutes from "./routes/trinityCoreRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewareها
app.use(cors());
app.use(express.json());

// روت اصلی
app.use("/", rootRouter);

// اتصال مستقیم Trinity Core
app.use("/trinity", trinityCoreRoutes);

// یک هلت‌چک کلی برای بکیند
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Ultra Backend",
    message: "Global health endpoint OK",
    timestamp: new Date().toISOString()
  });
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
