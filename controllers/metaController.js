// controllers/metaController.js
import MetaBehaviorEngine from "../engine/MetaBehaviorEngine.js";

export const metaHealth = (req, res) => {
  return res.json({ ok: true, engine: "Meta Behavior Engine", status: "running" });
};

export const metaDemo = async (req, res) => {
  try {
    const result = await MetaBehaviorEngine.demo();
    return res.json({ ok: true, mode: "demo", result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

export const metaLive = async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await MetaBehaviorEngine.live(payload);
    return res.json({ ok: true, mode: "live", result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
