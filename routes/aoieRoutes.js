import express from "express";
import aoieController from "../controllers/aoieController.js";

const router = express.Router();

// Debug route (GET)
router.get("/debug", (req, res) => {
  res.json({ ok: true, message: "AOIE Debug Route Works" });
});

// Main AOIE processing route (POST)
router.post("/process", async (req, res) => {
  try {
    const result = await aoieController.run(req.body);
    return res.json({ ok: true, result });
  } catch (err) {
    console.error("AOIE PROCESS ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "AOIE Engine Failed",
      details: err.message,
    });
  }
});

export default router;
