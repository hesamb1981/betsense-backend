// server.js
import express from "express";
import cors from "cors";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";

// روت‌های اصلی BetSense
import mainRoutes from "./routes.js";

// روت AOIE Engine
import aoieRoutes from "./routes/aoieRoutes.js";

// روت Ultra Risk Core
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";

const app = express();

// میدل‌ورها
app.use(cors());
app.use(express.json());

// روت سلامت اصلی بک‌اند
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// روت‌های اصلی BetSense (NSI, RBS و بقیه وقتی آماده شدند)
app.use("/api", mainRoutes);

// AOIE Engine
app.use("/aoie", aoieRoutes);

// Ultra Risk Core Engine
app.use("/ultra-risk", ultraRiskRoutes);

app.use("/ultra-momentum", ultraMomentumRoutes);
// پورت رندر
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
