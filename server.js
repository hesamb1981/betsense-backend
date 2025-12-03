import express from "express";
import cors from "cors";
import aoieRoutes from "./routes/aoieRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Test root
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// AOIE ROUTES
app.use("/aoie", aoieRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
