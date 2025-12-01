// controllers/dataSpineController.js
import { generateDataSpineInsights } from "../engine/dataspine/DataSpineEngine.js";

export const dataSpineHandler = (req, res) => {
  const result = generateDataSpineInsights(req.body);
  res.json(result);
};
