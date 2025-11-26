import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API root working",
    success: true,
  });
});

export default router;
