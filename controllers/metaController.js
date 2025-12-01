// controllers/metaController.js

const {
  runMetaDemo,
  runMetaLive,
} = require("../engine/MetaBehaviorEngine");

// DEMO
async function handleMetaDemo(req, res, next) {
  try {
    const result = await runMetaDemo();
    res.json({
      ok: true,
      engine: "meta",
      mode: "demo",
      result,
    });
  } catch (err) {
    console.error("META DEMO ERROR:", err);
    next(err);
  }
}

// LIVE
async function handleMetaLive(req, res, next) {
  try {
    // هرچی از فرانت می‌فرستی میاد تو body
    const payload = req.body || {};

    const result = await runMetaLive(payload);

    res.json({
      ok: true,
      engine: "meta",
      mode: "live",
      input: payload,
      result,
    });
  } catch (err) {
    console.error("META LIVE ERROR:", err);
    next(err);
  }
}

module.exports = {
  handleMetaDemo,
  handleMetaLive,
};
