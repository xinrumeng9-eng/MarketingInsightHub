import React from 'react';
import { ExternalLink, Globe, Rss, User } from 'lucide-react';
import { Language } from '../types';

interface TrustedSourcesProps {
  language: Language;
}

interface SourceItem {
  name: string;
  url: string;
  descriptionEn: string;
  descriptionZh: string;
}

// 1. International Websites (Global)
const GLOBAL_SOURCES: SourceItem[] = [
  {
    name: "Ad Age",
    url: "https://adage.com",
    descriptionEn: "Global media brand focusing on curated news, analysis and data.",
    descriptionZh: "专注于营销和媒体新闻、分析及数据的全球媒体品牌。"
  },
  {
    name: "Adweek",
    url: "https://www.adweek.com",
    descriptionEn: "Leading source of news and insight serving the brand marketing ecosystem.",
    descriptionZh: "服务于品牌营销生态系统的领先新闻与洞察来源。"
  },
  {
    name: "Digiday",
    url: "https://digiday.com",
    descriptionEn: "A vertical media company and community for digital media professionals.",
    descriptionZh: "面向数字媒体、营销和广告专业人士的垂直媒体和社区。"
  },
  {
    name: "The Drum",
    url: "https://www.thedrum.com",
    descriptionEn: "Global media platform and biggest marketing website in Europe.",
    descriptionZh: "全球媒体平台，欧洲最大的营销网站。"
  },
  {
    name: "MarTech",
    url: "https://martech.org",
    descriptionEn: "Marketing technology news, tactics and strategies.",
    descriptionZh: "营销技术新闻、战术与策略。"
  },
  {
    name: "eMarketer",
    url: "https://www.insiderintelligence.com",
    descriptionEn: "Top-tier data and research on digital marketing trends.",
    descriptionZh: "关于数字营销趋势的顶级数据与研究。"
  },
  {
    name: "Forrester",
    url: "https://www.forrester.com",
    descriptionEn: "Research and advisory company providing insights for business growth.",
    descriptionZh: "提供业务增长洞察的研究与咨询公司。"
  },
  {
    name: "Gartner",
    url: "https://www.gartner.com",
    descriptionEn: "Expert guidance and tools for marketing leaders.",
    descriptionZh: "为营销领导者提供的专家指导与工具。"
  }
];

// 2. Domestic Websites (China)
const CHINA_SOURCES: SourceItem[] = [
  {
    name: "SocialBeta",
    url: "https://socialbeta.com",
    descriptionEn: "Leading social marketing digital media in China.",
    descriptionZh: "中国领先的社交营销数字媒体。"
  },
  {
    name: "Digitaling (数英)",
    url: "https://www.digitaling.com",
    descriptionEn: "Authoritative digital media and employment platform for advertising.",
    descriptionZh: "广告营销行业权威数字媒体及招聘平台。"
  },
  {
    name: "Morketing",
    url: "https://www.morketing.com",
    descriptionEn: "Global marketing business media platform.",
    descriptionZh: "全球营销商业媒体平台。"
  },
  {
    name: "36Kr (36氪)",
    url: "https://36kr.com",
    descriptionEn: "Focuses on new economy, providing high-speed industry news.",
    descriptionZh: "聚焦新经济，提供高速、独家、深度的行业新闻。"
  },
  {
    name: "Meihua (梅花网)",
    url: "https://www.meihua.info",
    descriptionEn: "Marketing works library and creative community.",
    descriptionZh: "营销作品库与创意社区。"
  },
  {
    name: "Tencent Ads",
    url: "https://ad.weixin.qq.com",
    descriptionEn: "Official news and insights from Tencent Marketing.",
    descriptionZh: "腾讯广告官方新闻与洞察。"
  }
];

// 3. Individual Accounts (Personal/Experts)
const INDIVIDUAL_SOURCES: SourceItem[] = [
  {
    name: "Seth Godin",
    url: "https://seths.blog",
    descriptionEn: "Daily short, impactful marketing wisdom.",
    descriptionZh: "每日简短而有力的营销智慧。"
  },
  {
    name: "Scott Brinker",
    url: "https://chiefmartec.com",
    descriptionEn: "The leading voice on Marketing Technology (MarTech).",
    descriptionZh: "营销技术 (MarTech) 领域的领军人物。"
  },
  {
    name: "Neil Patel",
    url: "https://neilpatel.com",
    descriptionEn: "SEO and digital marketing analytics expert.",
    descriptionZh: "SEO 和数字营销分析专家。"
  },
  {
    name: "Rand Fishkin",
    url: "https://sparktoro.com/blog",
    descriptionEn: "Founder of Moz & SparkToro, expert in audience intelligence.",
    descriptionZh: "Moz 和 SparkToro 创始人，受众智能专家。"
  },
  {
    name: "Ann Handley",
    url: "https://annhandley.com",
    descriptionEn: "Pioneer in digital marketing and content strategy.",
    descriptionZh: "数字营销和内容策略的先驱。"
  }
];

interface SourceCardProps {
  source: SourceItem;
  language: Language;
  fallbackIcon: React.ReactNode;
}

const SourceCard: React.FC<SourceCardProps> = ({ source, language, fallbackIcon }) => {
  // Use Google's favicon service to fetch the logo
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=128`;

  return (
    <a 
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/10 relative overflow-hidden h-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink size={16} className="text-brand-400" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden">
          <img 
            src={faviconUrl} 
            alt={`${source.name} logo`} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // If image fails, hide it and the parent will show background
              (e.target as HTMLImageElement).style.display = 'none';
              // We could render the fallback icon here if we controlled the parent state, 
              // but simplest is to rely on the parent div or absolute positioning, 
              // or just let it be empty white which looks okay, or css fallback.
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-200 group-hover:text-white leading-tight">{source.name}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed">
        {language === 'zh' ? source.descriptionZh : source.descriptionEn}
      </p>
    </a>
  );
};

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-6 mt-12 first:mt-0 border-b border-slate-800 pb-3">
    <div className="text-brand-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
  </div>
);

const TrustedSources: React.FC<TrustedSourcesProps> = ({ language }) => {
  const titles = language === 'zh' ? {
    global: "国际营销媒体",
    china: "国内营销媒体",
    personal: "行业专家与个人账号"
  } : {
    global: "International Media",
    china: "Domestic Media (China)",
    personal: "Experts & Individual Accounts"
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white mb-2">
          {language === 'zh' ? '优质信息源' : 'Trusted Sources'}
        </h2>
        <p className="text-slate-400 max-w-2xl">
          {language === 'zh' 
            ? '聚合全球视野，连接本土洞察。为您精选三大领域的高价值信息渠道。' 
            : 'Aggregating global vision with local insights. Curated high-value channels across three key sectors.'}
        </p>
      </div>

      {/* Global Sources */}
      <SectionHeader title={titles.global} icon={<Globe size={24} />} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GLOBAL_SOURCES.map((source) => (
          <SourceCard 
            key={source.name} 
            source={source} 
            language={language} 
            fallbackIcon={<Globe size={24} className="text-slate-400" />}
          />
        ))}
      </div>

      {/* China Sources */}
      <SectionHeader title={titles.china} icon={<Rss size={24} />} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CHINA_SOURCES.map((source) => (
          <SourceCard 
            key={source.name} 
            source={source} 
            language={language} 
            fallbackIcon={<Rss size={24} className="text-slate-400" />}
          />
        ))}
      </div>

      {/* Individual Sources */}
      <SectionHeader title={titles.personal} icon={<User size={24} />} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {INDIVIDUAL_SOURCES.map((source) => (
          <SourceCard 
            key={source.name} 
            source={source} 
            language={language} 
            fallbackIcon={<User size={24} className="text-slate-400" />}
          />
        ))}
      </div>
    </div>
  );
};

export default TrustedSources;