// server.js
// BetSense Backend – Main Server Entry

import express from "express";
import cors from "cors";

// Routes
import mainRoutes from "./routes.js";
import aoieRoutes from "./routes/aoieRoutes.js";
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// Main BetSense API routes
app.use("/api", mainRoutes);

// AOIE engine routes
app.use("/aoie", aoieRoutes);

// Ultra Risk Core engine routes
app.use("/ultra-risk", ultraRiskRoutes);

// Render port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
