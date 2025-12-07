import React, { useState } from 'react';
import { TermCard, Language } from '../types';
import { RotateCcw, Check, X } from 'lucide-react';

interface FlashcardReviewProps {
  terms: TermCard[];
  onExit: () => void;
  language: Language;
}

const UI_TEXT = {
  en: {
    title: "Knowledge Review",
    empty: "No terms saved in your notebook yet.",
    back: "Back to Notebook",
    reveal: "Click to reveal definition",
    exit: "Exit Review",
    next: "Next Card"
  },
  zh: {
    title: "知识复习",
    empty: "笔记本中暂无收藏的术语。",
    back: "返回笔记本",
    reveal: "点击查看定义",
    exit: "退出复习",
    next: "下一张卡片"
  }
};

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ terms, onExit, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const t = UI_TEXT[language];

  if (terms.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">{t.empty}</p>
        <button onClick={onExit} className="text-brand-400 hover:underline">{t.back}</button>
      </div>
    );
  }

  const currentTerm = terms[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % terms.length);
    }, 200);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        <span className="text-slate-400 font-mono text-sm">{currentIndex + 1} / {terms.length}</span>
      </div>

      <div 
        className="relative h-80 w-full perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-slate-800 rounded-xl border border-brand-500/30 flex flex-col items-center justify-center p-8 shadow-2xl">
            <h3 className="text-3xl font-mono font-bold text-brand-400 mb-4 text-center">{currentTerm.term}</h3>
            <p className="text-slate-500 text-sm uppercase tracking-widest">{t.reveal}</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-brand-900 rounded-xl border border-brand-500 flex flex-col items-center justify-center p-8 shadow-2xl" style={{ transform: 'rotateY(180deg)' }}>
            <p className="text-xl text-white text-center mb-6 leading-relaxed">{currentTerm.definition}</p>
            <div className="w-full border-t border-brand-700 pt-4">
              <p className="text-brand-300 text-sm italic text-center">"{currentTerm.context}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-10">
         <button 
           onClick={onExit}
           className="px-6 py-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors font-medium"
         >
           {t.exit}
         </button>
         <button 
           onClick={handleNext}
           className="px-8 py-3 rounded-full bg-brand-600 text-white hover:bg-brand-500 transition-colors font-bold shadow-lg shadow-brand-900/50 flex items-center gap-2"
         >
           {t.next} <RotateCcw size={16} />
         </button>
      </div>
    </div>
  );
};

export default FlashcardReview;