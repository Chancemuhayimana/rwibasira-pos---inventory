
import { GoogleGenAI } from "@google/genai";
import { Product, Sale } from "../types";

export const getBusinessInsights = async (products: Product[], sales: Sale[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following supermarket business data and provide 3 actionable insights or recommendations.
    
    Inventory:
    ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.quantity, min: p.minStockLevel })))}
    
    Recent Sales Summary:
    Total Sales Records: ${sales.length}
    Current Profits Recorded: ${sales.reduce((sum, s) => sum + s.totalProfit, 0).toFixed(2)}
    
    Please return the response in a concise, friendly, and professional tone for a shop owner.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate insights at this moment. Please try again later.";
  }
};
