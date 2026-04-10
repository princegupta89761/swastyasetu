import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getHealthAdvice(message: string, history: { role: string, parts: { text: string }[] }[]) {
  try {
    // Format history for the new API
    const contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: "You are SwasthyaSetu AI, a helpful healthcare assistant. Your goal is to provide general health guidance, explain medical terms, and suggest healthy habits. IMPORTANT: You are NOT a doctor. You MUST NOT provide medical diagnoses or prescribe medications. ALWAYS include a disclaimer: '⚠️ This is not a medical diagnosis. Please consult a doctor.' Keep responses simple, safe, and empathetic." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am SwasthyaSetu AI, your health companion. I will provide general guidance and always remind users to consult a professional for medical concerns. How can I help you today?" }],
        },
        ...contents
      ],
    });

    return response.text || "I'm sorry, I couldn't generate a response. ⚠️ This is not a medical diagnosis. Please consult a doctor.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later. ⚠️ This is not a medical diagnosis. Please consult a doctor.";
  }
}

