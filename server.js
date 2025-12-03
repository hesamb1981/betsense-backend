import express from "express";
import cors from "cors";
import aoieRoutes from "./routes/aoieRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// -------------------------
// ROOT HEALTH CHECK
// -------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// -------------------------
// AOIE ROUTES
// -------------------------
app.use("/aoie", aoieRoutes);

// -------------------------
// START SERVER
// -------------------------
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
