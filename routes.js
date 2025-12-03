// routes.js (ROOT)

// مثل همیشه Express را لود می‌کنیم
import express from "express";

// AOIE Routes را ایمپورت می‌کنیم
import aoieRoutes from "./routes/aoieRoutes.js";

const router = express.Router();

// مسیر تست روت اصلی
router.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// اتصال AOIE Engine مسیر
router.use("/aoie", aoieRoutes);

export default router;
