// /api/assistant.js  (Plain serverless on Vercel)
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [{ role: "system", content: "You are a helpful destination wedding assistant." }]
    });
    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Assistant error" });
  }
}
