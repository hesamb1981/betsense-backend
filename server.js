// server.js  (CommonJS)

const express = require("express");
const cors = require("cors");

// روتر اصلی که همه‌ی انجین‌ها رو زیر /api می‌آورد
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 10000;

// ----------------------
// Middleware عمومی
// ----------------------
app.use(cors());
app.use(express.json());

// Health check اصلی بک‌اند
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// تمام روت‌های انجین‌ها زیر /api
app.use("/api", routes);

// 404 برای هر مسیر ناشناس
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend listening on port ${PORT}`);
});
