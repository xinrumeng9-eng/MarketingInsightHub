import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMarketingNews } from './services/geminiService';
import { NewsItem, NotebookItem, ViewMode, TermCard, Language, DateFilter } from './types';
import NewsCard from './components/NewsCard';
import Notebook from './components/Notebook';
import FlashcardReview from './components/FlashcardReview';
import TrustedSources from './components/TrustedSources';
import { Search, LayoutGrid, BookOpen, BarChart3, Globe, Calendar, Link2, Loader2 } from 'lucide-react';

const TOPICS_EN = [
  "Marketing Tech & AI",
  "Programmatic Advertising",
  "Brand Strategy",
  "MarTech",
  "AI Agent in Advertising"
];

const TOPICS_ZH = [
  "营销科技 & AI",
  "程序化广告",
  "品牌战略",
  "MarTech",
  "广告 AI 智能体"
];

const UI_TEXT = {
  en: {
    feed: "Feed",
    notebook: "Notebook",
    sources: "Sources",
    dailyBriefing: "Daily Briefing",
    searchPlaceholder: "Custom keyword...",
    loading: "Aggregating global intelligence for",
    loadingMore: "Discovering more insights...",
    noInsights: "No insights found. Try a different topic.",
    filter: {
      today: "Today",
      week: "Last Week",
      month: "Last Month",
      quarter: "Last 3 Months",
      older: "Older"
    }
  },
  zh: {
    feed: "资讯流",
    notebook: "笔记本",
    sources: "优质信息源",
    dailyBriefing: "每日简报",
    searchPlaceholder: "自定义关键词...",
    loading: "正在聚合全球情报：",
    loadingMore: "正在挖掘更多洞察...",
    noInsights: "未找到相关洞察，请尝试其他话题。",
    filter: {
      today: "今天",
      week: "最近一周",
      month: "最近一个月",
      quarter: "近三个月",
      older: "更长时间"
    }
  }
};

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FEED);
  const [language, setLanguage] = useState<Language>('zh');
  const [dateFilter, setDateFilter] = useState<DateFilter>('week');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notebook, setNotebook] = useState<NotebookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Ref to track the bottom of the list for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  const topics = language === 'zh' ? TOPICS_ZH : TOPICS_EN;
  const currentTopic = topics[activeTopicIndex];
  const t = UI_TEXT[language];

  // Reload news when language, topic, or date filter changes (Initial Load)
  useEffect(() => {
    const topicToSearch = searchQuery.trim() ? searchQuery : currentTopic;
    loadNews(topicToSearch, false);
  }, [language, activeTopicIndex, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadNews = async (topic: string, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      if (loadingMore || loading) return; // Prevent duplicate triggers
      setLoadingMore(true);
    } else {
      setLoading(true);
      setNews([]); // Clear current news while loading
    }

    try {
      // If loading more, pass the titles of existing news to exclude them
      const excludeTitles = isLoadMore ? news.map(item => item.title) : [];
      // Optimize: Only send the last 15 titles to avoid token limits, usually enough context
      const titlesToSend = excludeTitles.slice(-15);
      
      const data = await fetchMarketingNews(topic, language, dateFilter, titlesToSend);
      
      if (isLoadMore) {
        setNews(prev => {
          // Simple deduplication based on titles
          const existingTitles = new Set(prev.map(n => n.title));
          const uniqueNewItems = data.filter(n => !existingTitles.has(n.title));
          return [...prev, ...uniqueNewItems];
        });
      } else {
        setNews(data);
      }
    } catch (e) {
      console.error("Failed to load news", e);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Trigger load which uses the searchQuery state
      loadNews(searchQuery, false);
    }
  };

  const addToNotebook = (item: NotebookItem) => {
    setNotebook(prev => [...prev, item]);
  };

  const getNotebookTerms = (): TermCard[] => {
    return notebook.filter(item => item.type === 'term').map(item => item.content as TermCard);
  };

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore && news.length > 0) {
          const topicToSearch = searchQuery.trim() ? searchQuery : currentTopic;
          loadNews(topicToSearch, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, loadingMore, news.length, searchQuery, currentTopic, language, dateFilter]);


  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-brand-500/30">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
               <BarChart3 className="text-white" size={20} />
             </div>
             <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
               Marketing<span className="text-brand-400">Insight</span>Hub
             </h1>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode(ViewMode.FEED)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.FEED ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid size={16} /> {t.feed}
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.SOURCES)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.SOURCES ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white'}`}
              >
                <Link2 size={16} /> {t.sources}
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.NOTEBOOK)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.NOTEBOOK ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white'}`}
              >
                <BookOpen size={16} /> {t.notebook}
                {notebook.length > 0 && <span className="ml-1 bg-white/20 px-1.5 rounded-full text-xs">{notebook.length}</span>}
              </button>
            </nav>
            
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-mono">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {viewMode === ViewMode.FEED && (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col xl:flex-row gap-4 mb-10 items-center justify-between">
              
              {/* Quick Topics */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start flex-1">
                {topics.map((topic, index) => (
                  <button
                    key={topic}
                    onClick={() => { 
                      setActiveTopicIndex(index); 
                      setSearchQuery(""); // Clear manual search when clicking preset
                    }}
                    className={`h-10 px-4 rounded-full text-sm border whitespace-nowrap transition-all flex items-center ${activeTopicIndex === index && !searchQuery ? 'bg-brand-500/10 border-brand-500 text-brand-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Search & Date Filter */}
              <div className="flex gap-3 w-full xl:w-auto shrink-0 justify-center xl:justify-end">
                 <div className="relative h-10">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                      className="h-full appearance-none bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-8 text-sm focus:outline-none focus:border-brand-500 text-slate-300 cursor-pointer"
                    >
                      <option value="today">{t.filter.today}</option>
                      <option value="week">{t.filter.week}</option>
                      <option value="month">{t.filter.month}</option>
                      <option value="quarter">{t.filter.quarter}</option>
                      <option value="older">{t.filter.older}</option>
                    </select>
                 </div>

                <form onSubmit={handleSearch} className="relative w-full sm:w-64 h-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder={t.searchPlaceholder} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </form>
              </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto min-h-[50vh]">
               <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{t.dailyBriefing}</h2>
                  <span className="text-sm text-slate-500">{new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
               </div>
               
               {/* Initial Loading State */}
               {loading && (
                 <div className="flex flex-col items-center justify-center py-20 space-y-4">
                   <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-slate-400 animate-pulse">{t.loading} {searchQuery || currentTopic}...</p>
                 </div>
               )}

               {/* News List */}
               {!loading && (
                 <>
                   {news.map(item => (
                     <NewsCard key={item.id} item={item} onSave={addToNotebook} language={language} />
                   ))}
                   
                   {/* Empty State */}
                   {news.length === 0 && (
                     <div className="text-center py-20 text-slate-500">
                       {t.noInsights}
                     </div>
                   )}

                   {/* Load More Sentinel / Loading State */}
                   {news.length > 0 && (
                     <div ref={observerTarget} className="py-8 flex justify-center w-full">
                       {loadingMore ? (
                         <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800">
                           <Loader2 className="animate-spin text-brand-500" size={20} />
                           <span>{t.loadingMore}</span>
                         </div>
                       ) : (
                         <div className="h-4" /> // Invisible spacer to catch intersection
                       )}
                     </div>
                   )}
                 </>
               )}
            </div>
          </>
        )}

        {viewMode === ViewMode.SOURCES && (
          <TrustedSources language={language} />
        )}

        {viewMode === ViewMode.NOTEBOOK && (
          <Notebook 
            items={notebook} 
            onReviewFlashcards={() => setViewMode(ViewMode.FLASHCARDS)} 
            language={language}
          />
        )}

        {viewMode === ViewMode.FLASHCARDS && (
          <FlashcardReview 
            terms={getNotebookTerms()} 
            onExit={() => setViewMode(ViewMode.NOTEBOOK)} 
            language={language}
          />
        )}

      </main>

    </div>
  );
}

export default App;