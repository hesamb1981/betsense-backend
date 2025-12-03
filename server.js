import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aoieRoutes from "./src/routes/aoieRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ------------------------------
// TEST ROOT ROUTE
// ------------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, status: "Backend Running" });
});

// ------------------------------
// AOIE ROUTES
// ------------------------------
app.use("/aoie", aoieRoutes);

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
