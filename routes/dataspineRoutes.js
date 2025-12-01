// routes/dataspineRoutes.js

const express = require("express");
const dataspineController = require("../controllers/dataspineController");

const router = express.Router();

// Health ساده برای تست اگر خواستی
router.get("/health", (req, res) => {
  res.json({ ok: true, engine: "DataSpine", status: "Route OK" });
});

// DEMO
router.get("/demo", dataspineController.demo);

// LIVE
router.post("/live", dataspineController.live);

module.exports = router;
