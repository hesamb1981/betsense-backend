// server.js
// BetSense Ultra Backend – using rootRoutes.js as the main router

import express from "express";
import cors from "cors";

// روت اصلی که تمام انجین‌ها و لایه‌ها را مدیریت می‌کند
import router from "./rootRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// ----------------- MIDDLEWARES -----------------
app.use(cors());
app.use(express.json());

// ----------------- MAIN ROUTER -----------------
// تمام روت‌ها (aoie, dataspine, trinity-core, ultra-risk, ultra-momentum, ultra-master, memory و غیره)
// از طریق rootRoutes.js مدیریت می‌شوند
app.use("/", router);

// ----------------- HEALTH CHECK -----------------
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "BetSense Ultra Backend",
    message: "Health endpoint OK",
    timestamp: new Date().toISOString()
  });
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
