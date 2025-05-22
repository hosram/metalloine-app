import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = "XYeyCb0ImFsL8hr97IjLcJyBy7NImVm4";
const loginToken = "09a16a9e8feb473bacb8ccfe1a0b2ecac9798d486193bac994022ba9e4697524d5b8de6dec5ad2af79cbae77d4ca2af0";

app.post("/api/hesabfa", async (req, res) => {
  try {
    const resp = await fetch("https://api.hesabfa.com/v1/contact/list", {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Login-Token": loginToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3030;
app.listen(port, () => console.log("Proxy server running on port", port));
