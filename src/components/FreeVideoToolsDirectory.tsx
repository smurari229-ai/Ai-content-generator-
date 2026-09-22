import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Search,
  Video,
  Film,
  UserCheck,
  SlidersHorizontal,
  Layers,
  Wand2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { FREE_VIDEO_TOOLS, VIDEO_TOOL_CATEGORIES } from '../data/freeVideoToolsData';
import { FreeVideoTool } from '../types';
import { copyToClipboard } from '../utils/safeClipboard';

interface FreeVideoToolsDirectoryProps {
  currentPromptToCopy?: string;
  onSelectTool?: (tool: FreeVideoTool) => void;
  isCompact?: boolean;
}

export const FreeVideoToolsDirectory: React.FC<FreeVideoToolsDirectoryProps> = ({
  currentPromptToCopy,
  onSelectTool,
  isCompact = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredTools = FREE_VIDEO_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.hindiDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyPromptAndOpen = async (tool: FreeVideoTool, promptText?: string) => {
    const textToCopy = promptText || currentPromptToCopy || '';
    if (textToCopy) {
      await copyToClipboard(textToCopy);
      setCopiedKey(tool.id);
      setTimeout(() => setCopiedKey(null), 2500);
    }
    try {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('window.open blocked:', e);
    }
    if (onSelectTool) {
      onSelectTool(tool);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Video Gen':
        return <Video className="w-3.5 h-3.5" />;
      case 'Motion & Animation':
        return <Film className="w-3.5 h-3.5" />;
      case 'Talking Avatar':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'Video Editor & Captions':
        return <SlidersHorizontal className="w-3.5 h-3.5" />;
      case 'Image Keyframe':
        return <Layers className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4" id="free-video-tools-directory">
      {/* Header Info Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d131f] via-[#091515] to-[#0d1611] border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                100% मुफ़्त टूल्स (0 Cost Tools)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                12+ Verified Tools
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>मुफ़्त AI वीडियो जनरेटर टूल्स डायरेक्टरी</span>
            </h4>
            <p className="text-xs text-gray-300">
              बिना किसी पेड API या क्रेडिट कार्ड के टेक्स्ट और फोटो से शानदार रील्स, शॉर्ट्स व यूट्यूब वीडियो बनाएं।
            </p>
          </div>

          {currentPromptToCopy && (
            <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/30 shrink-0 max-w-xs sm:text-right">
              <span className="text-[10px] text-cyan-400 font-mono block font-semibold">
                ⚡ Active Scene Prompt Ready
              </span>
              <span className="text-[11px] text-gray-300 truncate block">
                किसी भी टूल पर क्लिक करें, प्रॉम्प्ट ऑटो-कॉपी हो जाएगा!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {VIDEO_TOOL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-400'
                    : 'bg-[#121216] text-gray-400 hover:text-white hover:bg-[#1b1b22] border border-[#26262e]'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 md:w-56">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="टूल या फ़ीचर खोजें..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#111116] border border-[#2b2b36] focus:border-emerald-500 text-xs text-white placeholder-gray-500 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-3`}>
        {filteredTools.map((tool) => {
          const isCopied = copiedKey === tool.id;
          return (
            <div
              key={tool.id}
              className="p-4 rounded-2xl bg-[#0c0c10] border border-[#202028] hover:border-emerald-500/50 hover:bg-[#101016] transition-all flex flex-col justify-between space-y-3 group shadow-lg"
            >
              <div className="space-y-2.5">
                {/* Top header with name, badge, category */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {tool.name}
                      </h5>
                      {tool.badge && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                      {getCategoryIcon(tool.category)}
                      <span>{tool.category}</span>
                      {tool.rating && <span className="text-amber-400">★ {tool.rating}</span>}
                    </span>
                  </div>

                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#18181f] text-gray-400 hover:text-white hover:bg-emerald-600 transition-all shrink-0"
                    title="आधिकारिक वेबसाइट खोलें"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Descriptions */}
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {tool.hindiDescription}
                </p>

                {/* Free Tier Info Box */}
                <div className="p-2.5 rounded-xl bg-[#14141a] border border-[#252532] text-[11px] font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Zap className="w-3 h-3" />
                    <span>फ्री ऑफ़र / सीमा:</span>
                  </div>
                  <p className="text-gray-300 text-[10px] leading-tight">
                    {tool.freeTierDetails}
                  </p>
                </div>

                {/* Key Features Bullet List */}
                <div className="space-y-1">
                  {tool.features.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended for */}
                <div className="pt-2 border-t border-[#1a1a22] text-[10px] text-gray-400 font-mono">
                  <span className="text-gray-500">बेस्ट उपयोग: </span>
                  <span className="text-gray-300 font-sans">{tool.recommendedFor}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPromptAndOpen(tool)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#171720] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/30 hover:border-emerald-500 text-xs font-semibold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title={currentPromptToCopy ? "प्रॉम्प्ट कॉपी करके टूल खोलें" : "मुफ़्त टूल खोलें"}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="text-white">Copied & Opening!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{currentPromptToCopy ? 'Copy & Open Tool' : 'Open Free Tool'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-[#0e0e12] border border-[#222] space-y-2">
          <p className="text-xs text-gray-400 font-mono">कोई टूल नहीं मिला।</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#1a1a22] text-xs text-white"
          >
            सभी टूल्स देखें
          </button>
        </div>
      )}
    </div>
  );
};
