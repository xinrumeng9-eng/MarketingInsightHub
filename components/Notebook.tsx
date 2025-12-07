import React, { useState } from 'react';
import { NotebookItem, TermCard, NewsItem, Language } from '../types';
import { synthesizeNotebook } from '../services/geminiService';
import { Sparkles, Book, FileText, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NotebookProps {
  items: NotebookItem[];
  onReviewFlashcards: () => void;
  language: Language;
}

const UI_TEXT = {
  en: {
    title: "Knowledge Notebook",
    subtitle: (count: number) => `You have collected ${count} insights.`,
    reviewBtn: "Review Terms",
    synthBtn: "Generate Case Study",
    synthTitle: "AI Strategic Synthesis",
    savedInsights: "Saved Insights",
    termBank: "Terminology Bank",
    noNews: "No news saved yet.",
    noTerms: "No terms saved yet."
  },
  zh: {
    title: "知识笔记本",
    subtitle: (count: number) => `您已收集 ${count} 条洞察。`,
    reviewBtn: "复习术语",
    synthBtn: "生成案例串联",
    synthTitle: "AI 战略综合分析",
    savedInsights: "收藏的洞察",
    termBank: "专业术语库",
    noNews: "暂无收藏资讯。",
    noTerms: "暂无收藏术语。"
  }
};

const Notebook: React.FC<NotebookProps> = ({ items, onReviewFlashcards, language }) => {
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const t = UI_TEXT[language];

  const handleSynthesize = async () => {
    if (items.length < 2) return;
    setIsSynthesizing(true);
    const result = await synthesizeNotebook(items.map(i => i.content), language);
    setSynthesis(result);
    setIsSynthesizing(false);
  };

  const newsItems = items.filter(i => i.type === 'news');
  const termItems = items.filter(i => i.type === 'term');

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
          <p className="text-slate-400">{t.subtitle(items.length)}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onReviewFlashcards}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            <BrainCircuit size={18} /> {t.reviewBtn} ({termItems.length})
          </button>
          <button 
            onClick={handleSynthesize}
            disabled={items.length < 2 || isSynthesizing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-brand-900/50"
          >
            {isSynthesizing ? <span className="animate-spin">✨</span> : <Sparkles size={18} />}
            {t.synthBtn}
          </button>
        </div>
      </div>

      {synthesis && (
        <div className="mb-10 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl border border-brand-500/30 shadow-2xl">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400 mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-brand-400" /> {t.synthTitle}
          </h3>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{synthesis}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
            <FileText size={16} /> {t.savedInsights}
          </h3>
          <div className="space-y-4">
            {newsItems.map(item => {
              const content = item.content as NewsItem;
              return (
                <div key={item.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 hover:border-brand-500/30 transition-colors">
                  <span className="text-xs text-brand-400 mb-1 block">{item.dateAdded}</span>
                  <h4 className="font-bold text-slate-200 mb-2">{content.title}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">{content.summary}</p>
                </div>
              );
            })}
            {newsItems.length === 0 && <p className="text-slate-600 italic">{t.noNews}</p>}
          </div>
        </div>

        <div>
           <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
            <Book size={16} /> {t.termBank}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {termItems.map(item => {
              const content = item.content as TermCard;
              return (
                <div key={item.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <h4 className="font-mono text-brand-400 font-bold text-sm mb-1">{content.term}</h4>
                  <p className="text-xs text-slate-400 line-clamp-3">{content.definition}</p>
                </div>
              );
            })}
             {termItems.length === 0 && <p className="text-slate-600 italic">{t.noTerms}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;