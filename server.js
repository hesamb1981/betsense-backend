import express from "express";
import cors from "cors";

import routes from "./routes.js";
import geniusRoutes from "./routes/geniusRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.json({
    status: "BetSense backend running",
    success: true,
  });
});

// Global routes
app.use("/api", routes);

// Genius Engine route
app.use("/api/genius", geniusRoutes);

app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
