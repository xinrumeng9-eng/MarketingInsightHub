import { NewsItem, Language, DateFilter } from "../types";

// Base API URL - relies on the proxy set up in netlify.toml
// In development with `netlify dev`, this proxies correctly.
// In production, this proxies to the serverless functions.
const API_BASE = '/api';

export const fetchMarketingNews = async (
  topic: string, 
  language: Language, 
  dateFilter: DateFilter = 'week',
  excludeTitles: string[] = []
): Promise<NewsItem[]> => {
  try {
    const response = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, language, dateFilter, excludeTitles })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return []; 
  }
};

export const synthesizeNotebook = async (items: any[], language: Language): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, language })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error synthesizing notebook:", error);
    return "Error generating synthesis. Please try again later.";
  }
};

// Returns a proxy object that matches the interface expected by ExpertChat.tsx
// utilizing the stateless backend API.
export const createChatSession = (context: string, language: Language) => {
  // We keep a local history here because the serverless function is stateless.
  // Each message sends the full history to the backend.
  let history: { role: string; parts: { text: string }[] }[] = [];

  return {
    sendMessage: async ({ message }: { message: string }) => {
      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            context, 
            language, 
            history, // Send previous history
            message  // Send new message
          })
        });

        if (!response.ok) {
          throw new Error("Chat API failed");
        }

        const data = await response.json();
        
        // Update local history with the turn
        history.push({ role: 'user', parts: [{ text: message }] });
        history.push({ role: 'model', parts: [{ text: data.text }] });

        return { text: data.text };
      } catch (e) {
        console.error("Chat error", e);
        return { text: "I'm having trouble connecting to the server right now." };
      }
    }
  };
};