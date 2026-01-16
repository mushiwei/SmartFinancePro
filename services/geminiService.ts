
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";
import { Locale } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (transactions: Transaction[], locale: Locale) => {
  const transactionSummary = transactions.map(t => ({
    date: t.date,
    type: t.type,
    amount: t.amount,
    category: t.category,
    desc: t.description
  }));

  const langPrompt = locale === 'zh' ? "Chinese" : "English";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these financial transactions (in CNY ¥) and provide insights in JSON format: ${JSON.stringify(transactionSummary)}`,
    config: {
      systemInstruction: `You are a world-class financial advisor. Analyze the user's spending habits in CNY (Yuan), suggest ways to save money, and provide a brief analysis of their financial health. You MUST return the response in ${langPrompt} language. Return ONLY a JSON object.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING, description: "Detailed analysis of the current financial situation" },
          suggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of actionable improvements"
          },
          savingTips: { type: Type.STRING, description: "A specific tip for saving money this month" }
        },
        required: ["analysis", "suggestions", "savingTips"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return null;
  }
};
