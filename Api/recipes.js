export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
    const MODEL_NAME = "gemini-2.0-flash-thinking-exp"; 

    // Google Gemini API endpoint (using the v1beta API for experimental thinking models)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    // Extracting the text from Gemini's nested response format
    const rawText = data.candidates[0].content.parts[0].text;

    // Thinking models sometimes wrapper JSON in markdown code blocks like ```json ... ```
    // We clean it to ensure JSON.parse works seamlessly
    const cleanJsonText = rawText.replace(/```json|```/gi, "").trim();

    // Parse it back to an object and send it directly to your frontend
    const parsedData = JSON.parse(cleanJsonText);
    
    res.status(200).json(parsedData);

  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to generate recipes with Gemini" });
  }
}
