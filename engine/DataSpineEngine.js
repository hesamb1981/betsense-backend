// engine/DataSpineEngine.js
// Core logic for DataSpine Engine (for data providers / data companies)

function buildDemoOutput() {
  return {
    summary: "DataSpine Engine demo output",
    metrics: {
      coverageDepth: 91,        // عمق پوشش داده
      latencyScore: 12,         // تاخیر (هرچه کمتر بهتر)
      anomalyPressure: 28,      // فشار ناهنجاری‌ها
      vendorConsistency: 88,    // ثبات بین چند دیتا وندر
      signalClarity: 79,        // وضوح سیگنال بعد از پاک‌سازی
      liveAdjustmentReady: true // آماده برای وصل شدن به لایو
    },
    narrative: {
      short:
        "DataSpine نشان می‌دهد عمق پوشش داده بسیار بالاست و تاخیر در سطح پایین و قابل کنترل باقی مانده است.",
      long:
        "DataSpine Engine لایه‌های مختلف دیتا را اسکن می‌کند و نشان می‌دهد ترکیب فعلی از نظر پوشش مسابقات و مارکت‌ها قوی است. " +
        "اختلال‌ها و ناهنجاری‌ها در محدودهٔ قابل قبول هستند و ثبات بین وندرهای مختلف خوب ارزیابی می‌شود. " +
        "این ساختار برای اتصال مستقیم به فیدهای لایو و ساختن محصولات سطح Enterprise آماده است."
    }
  };
}

// برای آینده اگر خواستی روی ورودی واقعی کار کنی:
function buildLiveOutput(payload = {}) {
  // فعلاً دمو ساده؛ بعداً می‌تونیم payload (مثل vendorId, league, dateRange و ...) را استفاده کنیم
  return {
    summary: "DataSpine Engine live placeholder",
    metrics: {
      coverageDepth: 0,
      latencyScore: 0,
      anomalyPressure: 0,
      vendorConsistency: 0,
      signalClarity: 0,
      liveAdjustmentReady: true
    },
    narrative: {
      short:
        "Live endpoint DataSpine آمادهٔ اتصال به فیدهای واقعی است.",
      long:
        "در نسخهٔ نهایی، این خروجی بر اساس استریم‌های واقعی دیتا، کیفیت، تاخیر و ناهنجاری را به صورت لحظه‌ای محاسبه می‌کند. " +
        "در حال حاضر این یک placeholder امن برای تست اتصال UI و بکند است."
    },
    debug: {
      receivedPayload: payload || null
    }
  };
}

module.exports = {
  buildDemoOutput,
  buildLiveOutput
};
