import { GoogleGenAI, Modality } from "@google/genai";
import { NewsItem, ChartConfig, TermCard, Language, DateFilter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRUSTED_SOURCES = [
  "Ad Age", "Adweek", "Digiday", "The Drum", "MarTech Today", "AdExchanger", 
  "eMarketer", "Insider Intelligence", "Forrester Research", "Gartner", "Warc",
  "梅花网", "数英 DIGITALING", "Morketing", "SocialBeta", 
  "巨量引擎 (Ocean Engine)", "腾讯广告 (Tencent Ads)", "百度营销 (Baidu Marketing)", 
  "艾瑞咨询 (iResearch)", "易观分析 (Analysys)",
  "Seth Godin", "Scott Brinker", "Rand Fishkin", "Ann Handley"
].join(", ");

export const fetchMarketingNews = async (
  topic: string, 
  language: Language, 
  dateFilter: DateFilter = 'week',
  excludeTitles: string[] = []
): Promise<NewsItem[]> => {
  try {
    const langInstruction = language === 'zh' 
      ? "Respond strictly in Simplified Chinese (简体中文)."
      : "Respond in English.";

    let timeContext = "";
    switch (dateFilter) {
      case 'today': timeContext = "published in the last 24 hours"; break;
      case 'week': timeContext = "published in the last 7 days"; break;
      case 'month': timeContext = "published in the last 30 days"; break;
      case 'quarter': timeContext = "published in the last 3 months"; break;
      case 'older': timeContext = "published in the last 12 months"; break;
      default: timeContext = "published recently";
    }

    // Context for exclusion to simulate pagination
    const exclusionInstruction = excludeTitles.length > 0
      ? `CRITICAL: Do NOT include any news with these titles (or very similar): ${JSON.stringify(excludeTitles)}.`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search for the latest news about "${topic}" in Marketing, AdTech, and Commercialization.
      
      Timeframe: Find news ${timeContext}.
      
      PRIORITY SOURCES:
      ${TRUSTED_SOURCES}
      
      Requirements:
      1. Find exactly 10 distinct news items.
      2. ${langInstruction}
      3. ${exclusionInstruction}
      4. CRITICAL: Output ONLY the JSON array. NO conversational text.
      
      For each news item, provide:
      1. title: Concise headline.
      2. source: Source name.
      3. url: Full direct URL (must start with https://).
      4. summary: 2 concise sentences on the core impact.

      Output JSON Structure:
      [
        {
          "title": "string",
          "source": "string",
          "url": "string",
          "summary": "string"
        }
      ]`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a specialized Marketing Intelligence Agent. You provide fast, accurate, and structured data feeds."
      }
    });

    let text = response.text || "[]";
    
    // Robust JSON cleaning
    text = text.replace(/```json/g, '').replace(/```/g, '');
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.substring(firstBracket, lastBracket + 1);
    }

    let rawData: any[] = [];
    try {
        rawData = JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response", text.substring(0, 500) + "...");
        return [];
    }
    
    // Map to add IDs and sanitize
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleDateString(),
    }));

  } catch (error) {
    console.error("Error fetching news:", error);
    return []; 
  }
};

export const synthesizeNotebook = async (items: any[], language: Language): Promise<string> => {
  try {
    const context = JSON.stringify(items);
    const langInstruction = language === 'zh' ? "Write in Simplified Chinese." : "Write in English.";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Context: ${context}. 
      Task: Act as a Marketing Strategist. Analyze the saved items in the user's notebook. 
      Connect the dots between these disparate pieces of information to form a cohesive "Market Case Study" or "Strategic Narrative".
      Identify patterns, contradictions, or opportunities.
      Format using Markdown. ${langInstruction}`
    });
    return response.text || "Could not synthesize insights.";
  } catch (error) {
    console.error("Error synthesizing notebook:", error);
    return "Error generating synthesis.";
  }
};

export const createChatSession = (context: string, language: Language) => {
  const langInstruction = language === 'zh' 
    ? "Respond in Simplified Chinese (简体中文)." 
    : "Respond in English.";

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are a virtual Chief Marketing Officer (CMO).
      
      Context provided by user:
      ${context}
      
      Instructions:
      1. Answer questions based on the provided context if relevant.
      2. Provide strategic marketing advice.
      3. ${langInstruction}`
    }
  });
};