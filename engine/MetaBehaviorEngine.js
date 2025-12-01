// engine/MetaBehaviorEngine.js

// این نسخه فقط برای تست Route هست.
// بعداً اینجا هوشِ واقعیِ متا رو می‌ریزیم.

async function runMetaDemo() {
  return {
    message: "MetaBehaviorEngine DEMO is working ✅",
    timestamp: new Date().toISOString(),
  };
}

async function runMetaLive(payload) {
  return {
    message: "MetaBehaviorEngine LIVE is working ✅",
    timestamp: new Date().toISOString(),
    // هر داده‌ای از فرانت بگیریم برمی‌گردونیم که ببینی وصل است
    receivedPayload: payload || null,
  };
}

module.exports = {
  runMetaDemo,
  runMetaLive,
};
