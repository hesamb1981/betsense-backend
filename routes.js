// routes.js  (betsense-backend)

// ----------------------
// Base router
// ----------------------
const express = require("express");
const router = express.Router();

// ----------------------
// Engine route modules
// ----------------------
const geniusRoutes = require("./routes/geniusRoutes");
const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");
const metaRoutes = require("./routes/metaRoutes");

// ----------------------
// Health check
// ----------------------
router.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "BetSense backend router running",
  });
});

// ----------------------
// Mount engine routes
// ----------------------
router.use("/genius", geniusRoutes);
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);
router.use("/meta", metaRoutes);

// ----------------------
module.exports = router;
