// server.js
import express from "express";
import cors from "cors";

// روتر اصلی که همه‌ی سرویس‌ها رو وصل می‌کند
import router from "./rootRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewareها
app.use(cors());
app.use(express.json());

// استفاده از روتر اصلی
app.use("/", router);

// یک هلت چک ساده برای اطمینان
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Ultra Backend",
    message: "Health endpoint OK",
    timestamp: new Date().toISOString()
  });
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
