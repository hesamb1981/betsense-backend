const express = require("express");
const router = express.Router();

const metaController = require("../controllers/metaController");

// -------------------------------
//        META BEHAVIOR ROUTES
// -------------------------------

// Demo Mode (Option D)
router.get("/meta/demo", metaController.metaDemo);

// Live Mode (Enterprise)
router.get("/meta/live", metaController.metaLive);

module.exports = router;
