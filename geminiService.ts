
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceAppDescription = async (appName: string, rawDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional App Store copywriter. Take this app name: "${appName}" and this raw description: "${rawDescription}". 
      Write a highly engaging, professional, and SEO-friendly description for an app store page. Use bullet points for key features. 
      Keep it structured and appealing for potential users.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return rawDescription;
  }
};

export const getAIReviewSummary = async (appName: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this app description for "${appName}": "${description}", generate a short "AI Insight" (max 2 sentences) about why users should download it.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "This app offers unique features for its category.";
  }
};
