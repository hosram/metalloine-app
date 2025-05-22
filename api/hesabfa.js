export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const apiKey = "XYeyCb0ImFsL8hr97IjLcJyBy7NImVm4";
  const loginToken = "09a16a9e8feb473bacb8ccfe1a0b2ecac9798d486193bac994022ba9e4697524d5b8de6dec5ad2af79cbae77d4ca2af0";

  try {
    // اصلاح body برای Vercel: ممکن است نیاز باشد req.body را به صورت json بخوانی:
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    const resp = await fetch("https://api.hesabfa.com/v1/contact/list", {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Login-Token": loginToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // اگر پاسخ حسابفا 200 نبود، متن خطا را کامل لاگ کن
    if (!resp.ok) {
      const errorText = await resp.text();
      res.status(500).json({ error: `Hesabfa error: ${resp.status} - ${errorText}` });
      return;
    }

    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
}
