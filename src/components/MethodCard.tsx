import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Wrench, 
  Copy, 
  Check, 
  ListPlus, 
  ArrowRight, 
  Sparkles, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { MonetizationMethod } from '../types';

interface MethodCardProps {
  method: MonetizationMethod;
  onViewDetails: (method: MonetizationMethod) => void;
  onSyncTasks: (method: MonetizationMethod) => Promise<void>;
  isSyncingTasks?: boolean;
  isTasksSynced?: boolean;
}

export const MethodCard: React.FC<MethodCardProps> = ({
  method,
  onViewDetails,
  onSyncTasks,
  isSyncingTasks,
  isTasksSynced,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(method.starterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30';
      case 'medium':
        return 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30';
      default:
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    }
  };

  return (
    <div 
      id={`method-card-${method.id}`}
      className="group relative flex flex-col justify-between bg-[#111] hover:bg-[#141414] border border-[#333] hover:border-[#3b82f6] rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3b82f6]/5"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
            {method.category}
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[11px] font-mono font-medium rounded-md border ${getDifficultyColor(method.difficulty)}`}>
              {method.difficulty}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {method.timeToFirstRupee}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-snug mb-2">
          {method.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {method.tagline}
        </p>

        {/* Earning Potential & Investment Bar (Bento Inset) */}
        <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-[#050505] border border-[#222] mb-4">
          <div>
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" /> संभावित आय
            </span>
            <p className="text-sm font-bold font-mono text-[#10b981] mt-0.5 truncate">
              {method.earningPotential}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 font-mono">
              <Zap className="w-3.5 h-3.5 text-[#f59e0b]" /> निवेश
            </span>
            <p className="text-sm font-medium text-gray-200 mt-0.5 truncate">
              {method.investmentRequired}
            </p>
          </div>
        </div>

        {/* Tools Badges */}
        <div className="mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-400 font-mono mb-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>AI टूल्स:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {method.toolsNeeded.slice(0, 4).map((tool, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-[#1a1a1a] text-gray-300 border border-[#333]"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </div>

        {/* Starter Prompt Snippet (Bento Inset) */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[#050505] border border-[#222]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-medium text-[#f59e0b] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#f59e0b]" /> AI मास्टर प्रॉम्प्ट
            </span>
            <button
              id={`copy-prompt-btn-${method.id}`}
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors bg-[#161616] hover:bg-[#222] border border-[#333] px-2 py-0.5 rounded"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3 h-3 text-[#10b981]" />
                  <span className="text-[#10b981] font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 font-mono line-clamp-2 italic">
            "{method.starterPrompt}"
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#222] flex items-center gap-2">
        <button
          id={`view-plan-btn-${method.id}`}
          onClick={() => onViewDetails(method)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-white text-xs sm:text-sm font-semibold border border-[#333] hover:border-gray-500 transition-colors"
        >
          <span>प्लान विवरण</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#3b82f6]" />
        </button>

        <button
          id={`sync-tasks-btn-${method.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSyncTasks(method);
          }}
          disabled={isSyncingTasks}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
            isTasksSynced
              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 hover:bg-[#10b981]/30'
              : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-md shadow-[#3b82f6]/20'
          }`}
          title="यह प्लान Google Tasks में जोड़ें"
        >
          {isTasksSynced ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span className="hidden sm:inline font-mono">Synced</span>
            </>
          ) : (
            <>
              <ListPlus className={`w-4 h-4 ${isSyncingTasks ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline font-mono">Tasks Sync</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
