import express from "express";
import cors from "cors";
import metaRoutes from "./src/routes/metaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/meta", metaRoutes);

app.get("/", (req, res) => {
  res.send("BetSense API Running ✔️");
});

export default app;
