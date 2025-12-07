import React from 'react';
import { NewsItem, NotebookItem, Language } from '../types';
import { Bookmark, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  onSave: (item: NotebookItem) => void;
  language: Language;
}

const UI_TEXT = {
  en: {
    summary: "Executive Summary",
    saveNews: "Save to Notebook",
  },
  zh: {
    summary: "核心摘要",
    saveNews: "保存至笔记本",
  }
};

const NewsCard: React.FC<NewsCardProps> = ({ item, onSave, language }) => {
  const t = UI_TEXT[language];

  // Helper to ensure URL is absolute and uses HTTPS
  const getSafeUrl = (url?: string) => {
    if (!url) return "#";
    let safeUrl = url.trim();
    // If it doesn't start with http:// or https://, assume it's a domain and prepend https://
    if (!/^https?:\/\//i.test(safeUrl)) {
      safeUrl = `https://${safeUrl}`;
    }
    return safeUrl;
  };

  const saveToNotebook = () => {
    onSave({
      id: Date.now().toString(),
      type: 'news',
      content: item,
      dateAdded: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="glass-panel rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/10 border-l-4 border-l-brand-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-brand-400 bg-brand-900/30 px-2 py-1 rounded">
              {item.source}
            </span>
            <span className="text-xs text-slate-500">{item.timestamp}</span>
          </div>
          <a 
            href={getSafeUrl(item.url || item.originalUrl)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <h2 className="text-xl font-bold text-slate-100 leading-tight group-hover:text-brand-400 transition-colors inline-flex items-center gap-2">
              {item.title}
              <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" />
            </h2>
          </a>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={saveToNotebook}
            className="p-2 text-slate-400 hover:text-brand-400 transition-colors" 
            title={t.saveNews}
          >
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="relative pl-4 border-l-2 border-slate-700">
         <p className="text-slate-300 leading-relaxed text-base">{item.summary}</p>
      </div>
    </div>
  );
};

export default NewsCard;