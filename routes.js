import express from "express";
import GeniusEngine from "./engine/GeniusEngine.js";

const router = express.Router();
const genius = new GeniusEngine();

router.get("/", (req, res) => {
  res.json({ status: "API root working", success: true });
});

router.post("/genius", (req, res) => {
  try {
    const output = genius.analyzeMatch(req.body);
    res.json(output);
  } catch (error) {
    res.status(500).json({ error: true, msg: "GENIUS endpoint failed" });
  }
});

export default router;
