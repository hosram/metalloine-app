// api/tetherland.js
module.exports = async (req, res) => {
  try {
    // کلید API تترلند (محرمانه)
    const API_KEY = "RwhiHcpmdrOPYZjtOfdMLeIERPilFNMwFfO2XsgB";

    // آدرس واقعی برای گرفتن قیمت تتر (ساختار فرضی):
    const TETHERLAND_API = "https://api.tetherland.com/v1/usdt-price";

    // درخواست به تترلند:
    const response = await fetch(TETHERLAND_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Tetherland status code: ${response.status}`);
    }

    const data = await response.json();
    if (!data.price) {
      throw new Error("قیمت تتر در پاسخ تترلند یافت نشد");
    }

    // برگرداندن قیمت به فرانت‌اند
    res.status(200).json({
      success: true,
      tetherPrice: Number(data.price) // فرض می‌کنیم برحسب تومان است
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
