// server.js  – BetSense Backend

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Internal error:", err);
  res.status(500).json({ error: "Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});

module.exports = app;
