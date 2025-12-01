const express = require("express");
const router = express.Router();

// ---------------------------
//  API ROUTE MODULES
// ---------------------------
const dataspineRoutes = require("./routes/dataspineRoutes");
const geniusRoutes = require("./routes/geniusRoutes");
const metaRoutes = require("./routes/metaRoutes");
const nsiRoutes = require("./routes/nsiRoutes");
const rbsRoutes = require("./routes/rbsRoutes");

// کوچک برای تست /api
router.get("/", (req, res) => {
  res.json({ ok: true, scope: "api-root" });
});

// ---------------------------
//  MOUNT ENGINES
// ---------------------------
router.use("/dataspine", dataspineRoutes);
router.use("/genius", geniusRoutes);
router.use("/meta", metaRoutes);
router.use("/nsi", nsiRoutes);
router.use("/rbs", rbsRoutes);

module.exports = router;
