export interface TermCard {
  term: string;
  definition: string;
  context: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartConfig {
  type: 'bar' | 'pie' | 'line';
  title: string;
  data: ChartDataPoint[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url?: string; // Original URL
  timestamp: string;
  summary: string; // The "Refined Summary"
  originalUrl?: string; // From search grounding
}

export interface NotebookItem {
  id: string;
  type: 'news' | 'term' | 'insight';
  content: NewsItem | TermCard | string; // Flexible content storage
  dateAdded: string;
}

export enum ViewMode {
  FEED = 'FEED',
  NOTEBOOK = 'NOTEBOOK',
  FLASHCARDS = 'FLASHCARDS',
  SOURCES = 'SOURCES'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export type Language = 'en' | 'zh';

export type DateFilter = 'today' | 'week' | 'month' | 'quarter' | 'older';