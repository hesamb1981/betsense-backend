import express from "express";
import cors from "cors";

// روت‌های اصلی سیستم (NSI، RBS، Meta، Genius و غیره)
import mainRoutes from "./routes.js";

// روت اختصاصی AOIE
import aoieRoutes from "./routes/aoieRoutes.js";

// روت‌های ابر انجین‌ها (Risk / Momentum / Fusion)
import ultraRiskRoutes from "./routes/ultraRiskRoutes.js";
import ultraMomentumRoutes from "./routes/ultraMomentumRoutes.js";
import ultraFusionRoutes from "./routes/super/ultraFusionRoutes.js";

const app = express();

// میدل‌ورها
app.use(cors());
app.use(express.json());
app.use(require("./routes/superRiskRoutes"));

// روت سلامت اصلی بک‌اند
app.get("/", (req, res) => {
  res.json({
    ok: true,
    status: "Backend Running",
  });
});

// روت‌های اصلی BetSense (قدیمی‌ها)
app.use("/api", mainRoutes);

// روت AOIE زیر /aoie
app.use("/aoie", aoieRoutes);

// سوپر انجین‌ها
app.use("/ultra-risk", ultraRiskRoutes);
app.use("/ultra-momentum", ultraMomentumRoutes);
app.use("/ultra-fusion", ultraFusionRoutes);

// پورت رندر
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
