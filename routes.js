// routes.js (ROOT)

// لود کردن Express
import express from "express";

// AOIE Routes
import aoieRoutes from "./routes/aoieRoutes.js";

// تست اینتلیجنس کور (فایلش همین الان توی routes/test/intelligenceTest.js وجود دارد)
import intelligenceTestRoutes from "./routes/test/intelligenceTest.js";

const router = express.Router();

// مسیر تست روت اصلی
router.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// اتصال AOIE Engine
router.use("/aoie", aoieRoutes);

// اتصال تست اینتلیجنس کور
router.use("/test", intelligenceTestRoutes);

export default router;
