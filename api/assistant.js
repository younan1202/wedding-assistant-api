// Vercel Serverless Function at /api/assistant
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // CORS so Webflow can call this
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { messages = [], context = {} } = req.body || {};
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const system = `
You are a helpful destination wedding planning assistant.
- If info is missing, ask ONE clarifying question.
- Respect date, destination, guest count, and budget.
- Respond in Markdown with sections: Summary, Timeline (bulleted), Next Steps (3–5 bullets).
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: "Context: " + JSON.stringify(context) },
        ...messages
      ]
    });

    const reply = completion.choices?.[0]?.message?.content ?? "Sorry, no response.";
    return res.status(200).json({ reply });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Assistant error" });
  }
}
