import express from "express";
import GeniusEngine from "../engine/GeniusEngine.js";

const router = express.Router();

router.get("/", (req, res) => {
  const output = GeniusEngine.run();
  res.json({
    success: true,
    engine: "Genius Engine",
    result: output,
  });
});

export default router;
