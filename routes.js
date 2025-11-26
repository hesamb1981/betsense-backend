// routes.js

import express from "express";
import geniusRoutes from "./routes/geniusRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API root working",
    success: true,
  });
});

router.use("/genius", geniusRoutes);

export default router;
