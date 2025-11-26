import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.json({
    status: "BetSense backend is running",
    success: true
  });
});

// API routes
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`BetSense backend running on port ${PORT}`);
});
