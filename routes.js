import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API root working",
    success: true
  });
});

router.post("/fusion", (req, res) => {
  res.json({
    success: true,
    message: "Fusion endpoint test OK"
  });
});

export default router;
