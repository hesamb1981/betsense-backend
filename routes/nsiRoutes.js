import express from "express";
import nsiController from "../controllers/nsiController.js";

const router = express.Router();

// Health
router.get("/health", nsiController.health);

// Analyze (manual)
router.post("/analyze", nsiController.analyze);

// Analyze (demo)
router.post("/demo", (req, res) => {
  res.json({
    ok: true,
    message: "NSI Demo Route Working!",
    demoSample: {
      team: "Arsenal",
      opponent: "Spurs",
      nsiScore: 0.82,
      state: "Momentum Surge",
    },
  });
});

export default router;
