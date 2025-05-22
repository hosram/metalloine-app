export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = "XYeyCb0ImFsL8hr97IjLcJyBy7NImVm4";
  const loginToken = "09a16a9e8feb473bacb8ccfe1a0b2ecac9798d486193bac994022ba9e4697524d5b8de6dec5ad2af79cbae77d4ca2af0";

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    // لاگ کن تا ببینیم ورودی چی هست (فقط برای عیب‌یابی، بعداً پاک کن!)
    console.log("API Request Body:", body);

    const resp = await fetch("https://api.hesabfa.com/v1/contact/list", {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Login-Token": loginToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      // لاگ خطا برای عیب‌یابی سریع‌تر
      console.error("Hesabfa API Error:", errorText);
      res.status(resp.status).json({ 
        error: `Hesabfa error: ${resp.status} - ${errorText}`,
        inputBody: body
      });
      return;
    }

    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
}
