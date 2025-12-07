import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface ExpertChatProps {
  contextText: string;
  language: Language;
}

const UI_TEXT = {
  en: {
    placeholder: "Ask strategic questions...",
    greeting: "I am your virtual CMO. Ask me about the strategic implications of this event.",
    error: "Apologies, I encountered an error analyzing that."
  },
  zh: {
    placeholder: "询问战略问题...",
    greeting: "我是您的虚拟 CMO。请询问关于此事件的战略影响。",
    error: "抱歉，分析时遇到错误。"
  }
};

const ExpertChat: React.FC<ExpertChatProps> = ({ contextText, language }) => {
  const t = UI_TEXT[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat when context or language changes
  useEffect(() => {
    setMessages([{ role: 'model', text: t.greeting }]);
    chatSessionRef.current = createChatSession(contextText, language);
  }, [contextText, language]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
        const modelMsg: ChatMessage = { role: 'model', text: result.text };
        setMessages(prev => [...prev, modelMsg]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: t.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-600' : 'bg-purple-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-600/20 border border-brand-500/30' : 'bg-slate-800 border border-slate-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center">
               <Loader2 className="animate-spin text-slate-400" size={16} />
             </div>
          </div>
        )}
      </div>
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.placeholder}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-md transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExpertChat;