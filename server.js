import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api", routes);

// NOT FOUND HANDLER
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// START
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("SERVER RUNNING on port", PORT);
});
