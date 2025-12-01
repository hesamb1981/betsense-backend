// routes.js  (نسخه‌ی جدید)

import dataspineRoutes from "./routes/dataspineRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import nsiRoutes from "./routes/nsiRoutes.js";
import rbsRoutes from "./routes/rbsRoutes.js";
import geniusRoutes from "./routes/geniusRoutes.js";

export default function registerRoutes(app) {
  // DataSpine Engine – live + historical + anomaly views
  app.use("/api/dataspine", dataspineRoutes);

  // Meta Behavior Engine
  app.use("/api/meta", metaRoutes);

  // NSI Engine
  app.use("/api/nsi", nsiRoutes);

  // RBS Engine
  app.use("/api/rbs", rbsRoutes);

  // Genius / Emotion Fusion (اگه فعلاً فقط یکی‌ش فعاله، بعداً می‌تونیم عوضش کنیم)
  app.use("/api/genius", geniusRoutes);
}
