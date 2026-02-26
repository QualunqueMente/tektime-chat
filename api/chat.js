export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key non configurata sul server" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Parametro messages mancante o non valido" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "HTTP-Referer": req.headers.origin || "https://tektime-chat.vercel.app",
        "X-Title": "Tektime Assistant"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: messages,
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Errore OpenRouter" });
    }

    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: "Errore server: " + e.message });
  }
}
