import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  RefreshCw, 
  Layers, 
  SlidersHorizontal,
  Flame,
  Wand2,
  TrendingUp,
  Activity,
  Bot,
  Video
} from 'lucide-react';
import { MonetizationMethod } from '../types';
import { MONETIZATION_CATEGORIES } from '../data/monetizationCatalog';
import { MethodCard } from './MethodCard';

interface ContinuousFeedProps {
  methods: MonetizationMethod[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onGenerateNewMethod: (category?: string) => void;
  isGenerating: boolean;
  onOpenCustomWizard: () => void;
  onOpenContentGenerator?: () => void;
  onOpenFreeVideoTools?: () => void;
  onViewDetails: (method: MonetizationMethod) => void;
  onSyncTasks: (method: MonetizationMethod) => Promise<void>;
  syncingMethodId: string | null;
  syncedMethodIds: Set<string>;
}

export const ContinuousFeed: React.FC<ContinuousFeedProps> = ({
  methods,
  activeCategory,
  onSelectCategory,
  onGenerateNewMethod,
  isGenerating,
  onOpenCustomWizard,
  onOpenContentGenerator,
  onOpenFreeVideoTools,
  onViewDetails,
  onSyncTasks,
  syncingMethodId,
  syncedMethodIds,
}) => {

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMethods = methods.filter((m) => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.toolsNeeded.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Bento Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Bento Hero Card (8 cols) */}
        <div className="lg:col-span-8 bg-[#111] border border-[#333] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#3b82f6] transition-colors relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[#3b82f6] font-mono text-xs tracking-widest uppercase font-semibold">
                प्रॉफिट गाइड्स 2026
              </span>
              <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-ping" />
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              एआई से कमाई के आधुनिक मार्ग
            </h2>
            
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              आर्टिफिशियल इंटेलिजेंस की शक्ति का उपयोग करके अपनी आय बढ़ाने के स्टेप-बाय-स्टेप सिद्ध तरीके।
              प्रत्येक तरीके का 30-दिन का एक्शन प्लान बनाएं और सीधे <strong className="text-[#3b82f6]">Google Tasks</strong> में सिंक करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6 mt-4 border-t border-[#222]">
            <button
              id="feed-tell-more-btn"
              onClick={() => onGenerateNewMethod(activeCategory === 'All' ? undefined : activeCategory)}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'नया तरीका खोज रहा है...' : 'अगला तरीका बताओ'}</span>
            </button>

            <button
              id="feed-custom-wizard-btn"
              onClick={onOpenCustomWizard}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-white font-bold text-sm border border-[#333] hover:border-[#3b82f6] transition-all active:scale-95"
            >
              <Wand2 className="w-4 h-4 text-[#3b82f6]" />
              <span>कस्टम 30-दिन प्लान बनाएं</span>
            </button>

            {onOpenFreeVideoTools && (
              <button
                id="feed-free-video-tools-btn"
                onClick={onOpenFreeVideoTools}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0d1612] hover:bg-[#14231b] text-emerald-400 hover:text-emerald-300 font-bold text-sm border border-emerald-500/40 hover:border-emerald-400 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Video className="w-4 h-4 text-emerald-400" />
                <span>मुफ़्त वीडियो टूल्स</span>
              </button>
            )}

            {onOpenContentGenerator && (
              <button
                id="feed-content-generator-btn"
                onClick={onOpenContentGenerator}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#111] hover:bg-[#1a1a1a] text-blue-400 hover:text-blue-300 font-bold text-sm border border-[#3b82f6]/40 hover:border-[#3b82f6] transition-all active:scale-95 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#3b82f6]" />
                <span>AI Content Generator</span>
              </button>
            )}
          </div>

        </div>

        {/* Side Bento Stats Tiles (4 cols) */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Bento Tile 1: Market Demand */}
          <div className="bg-[#111] border border-[#333] rounded-3xl p-5 flex flex-col justify-between hover:border-[#10b981] transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-gray-400 font-medium">ग्लोबल AI डिमांड</span>
                <p className="text-2xl sm:text-3xl font-mono font-black text-white mt-0.5">+340%</p>
              </div>
              <div className="bg-[#10b981]/20 text-[#10b981] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-[#10b981]/30">
                Trending
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>फ्रीलांस व ऑटोमेशन हाई डिमांड</span>
            </div>
          </div>

          {/* Bento Tile 2: Active Methods in Database */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-5 flex flex-col justify-between hover:border-[#f59e0b] transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-gray-400 font-medium">सत्यापित ब्लू-प्रिंट्स</span>
                <p className="text-2xl sm:text-3xl font-mono font-black text-[#f59e0b] mt-0.5">
                  {methods.length}+ तरीके
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center border border-[#f59e0b]/30">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Gemini 2.5 Flash से निरंतर अपडेटेड
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-gray-400 pr-1 shrink-0 font-mono">
            <Layers className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>कैटेगरी:</span>
          </div>
          {MONETIZATION_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-cat-${cat}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-md shadow-[#3b82f6]/20'
                    : 'bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gray-500'
                }`}
              >
                {cat === 'All' ? 'सभी तरीके (All)' : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="feed-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="तरीका या AI टूल खोजें..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-2xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
        </div>
      </div>

      {/* Grid of Methods (Bento Grid) */}
      {filteredMethods.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#111] rounded-3xl border border-[#333]">
          <SlidersHorizontal className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">कोई तरीका नहीं मिला</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            खोज शब्द बदलें या AI से सीधे नया तरीका जनरेट करने के लिए ऊपर दिए गए बटन पर क्लिक करें।
          </p>
          <button
            id="feed-empty-generate-btn"
            onClick={() => onGenerateNewMethod()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200"
          >
            <Sparkles className="w-4 h-4 text-[#3b82f6]" />
            <span>AI से नया तरीका खोजें</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMethods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              onViewDetails={onViewDetails}
              onSyncTasks={onSyncTasks}
              isSyncingTasks={syncingMethodId === method.id}
              isTasksSynced={syncedMethodIds.has(method.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
