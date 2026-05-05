export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.3",
        input: prompt,
        temperature: 0.4,
        max_output_tokens: 700,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const text = data.output[0].content[0].text;

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: "Failed to generate recipes" });
  }
}
