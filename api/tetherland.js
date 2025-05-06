// api/tetherland.js

/**
 * یک نمونه Serverless Function مخصوص Vercel:
 * قیمت تتر را از تترلند می‌گیرد (با فرض این‌که داده در /currencies باشد).
 * کلید API را در این فایل می‌گذاریم تا در فرانت‌اند آشکار نشود.
 */

module.exports = async (req, res) => {
  try {
    // کلید API تترلند شما (مثال):
    const API_KEY = "RwhiHcpmdrOPYZjtOfdMLeIERPilFNMwFfO2XsgB";

    // آدرس جدید تترلند که گفتید: https://api.tetherland.com/currencies
    const TETHERLAND_API = "https://api.tetherland.com/currencies";

    // درخواست به تترلند:
    const response = await fetch(TETHERLAND_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // فرض می‌کنیم باید Bearer باشد؛ اگر متفاوت است، اصلاح کنید
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`وضعیت HTTP نامناسب: ${response.status}`);
    }

    // پاسخ را به‌صورت JSON
    const data = await response.json();
    // ساختار پاسخ را حدس می‌زنیم؛ مثلاً ممکن است شبیه:
    // {
    //   success: true,
    //   data: {
    //     currencies: [
    //       { symbol: "usdt", buyPrice: 45000, ... },
    //       { symbol: "btc", buyPrice: 900000, ... }
    //     ]
    //   }
    // }
    // لطفاً با مستندات یا خروجی واقعی کنترل کنید.

    if (!data?.data?.currencies) {
      throw new Error("فیلد data.currencies در پاسخ یافت نشد. ساختار را بررسی کنید.");
    }

    // پیدا کردن شیء مربوط به تتر (symbol === "usdt" یا "USDT")
    const usdtObj = data.data.currencies.find(item => 
      item.symbol?.toLowerCase() === "usdt"
    );

    if (!usdtObj) {
      throw new Error("شیء تتر (usdt) در آرایه currencies پیدا نشد.");
    }

    // مثلاً قیمت خرید را به عنوان قیمت تتر در نظر می‌گیریم
    // (با فرض اینکه فیلدش buyPrice است)
    const tetherPrice = usdtObj.buyPrice; 
    if (!tetherPrice) {
      throw new Error("مقدار buyPrice برای usdt یافت نشد. فیلد را بررسی کنید.");
    }

    // برگرداندن پاسخ به فرانت‌اند
    res.status(200).json({
      success: true,
      tetherPrice: Number(tetherPrice)
    });
  } catch (err) {
    console.error("خطا در تابع tetherland.js:", err);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت قیمت تتر از تترلند.",
      error: String(err)
    });
  }
};
