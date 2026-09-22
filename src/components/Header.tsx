import React from 'react';
import { Sparkles, CheckCircle2, ListTodo, LogIn, LogOut, MessageSquare, BookOpen, Calculator, RefreshCw, Wand2, Video } from 'lucide-react';
import { GoogleUserProfile } from '../types';

interface HeaderProps {
  isConnected: boolean;
  userProfile: GoogleUserProfile | null;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onOpenTasks: () => void;
  onOpenChat: () => void;
  onOpenPrompts: () => void;
  onOpenCalculator: () => void;
  onOpenContentGenerator: () => void;
  onOpenFreeVideoTools: () => void;
  onTriggerNewIdea: () => void;
  isGeneratingNewIdea?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  userProfile,
  onConnectGoogle,
  onDisconnectGoogle,
  onOpenTasks,
  onOpenChat,
  onOpenPrompts,
  onOpenCalculator,
  onOpenContentGenerator,
  onOpenFreeVideoTools,
  onTriggerNewIdea,
  isGeneratingNewIdea,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-[#262626] text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#3b82f6] flex items-center justify-center shadow-lg shadow-[#3b82f6]/20 shrink-0 border border-[#3b82f6]/40">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[#3b82f6] font-mono text-[11px] tracking-widest uppercase font-semibold hidden xs:inline">
                  PROFIT GUIDES
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-[#161616] text-[#3b82f6] border border-[#333]">
                  2026 AI
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white truncate">
                एआई से कमाई के मार्ग
              </h1>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free Video Tools Button */}
            <button
              id="header-video-tools-btn"
              onClick={onOpenFreeVideoTools}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1612] hover:bg-[#14231b] text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm font-semibold border border-emerald-500/40 hover:border-emerald-400 transition-colors shadow-sm cursor-pointer"
              title="मुफ़्त AI वीडियो जनरेटर टूल्स (Kling AI, Hailuo, Luma, CapCut, etc.)"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">मुफ़्त वीडियो टूल्स</span>
              <span className="md:hidden">वीडियो टूल्स</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                FREE
              </span>
            </button>

            {/* AI Content Generator Button */}
            <button
              id="header-content-generator-btn"
              onClick={onOpenContentGenerator}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] hover:bg-[#1a1a1a] text-gray-200 text-xs sm:text-sm font-semibold border border-[#333] hover:border-[#3b82f6] transition-colors cursor-pointer"
              title="AI Content Generator (YouTube, Shorts, Reels, FB, Blog)"
            >
              <Wand2 className="w-4 h-4 text-[#3b82f6]" />
              <span className="hidden sm:inline">AI Content Generator</span>
              <span className="sm:hidden">Content</span>
            </button>

            {/* Quick Next Idea Button */}
            <button
              id="header-next-idea-btn"
              onClick={onTriggerNewIdea}
              disabled={isGeneratingNewIdea}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="नया AI कमाई का तरीका खोजें"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isGeneratingNewIdea ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">नया तरीका बताओ</span>
              <span className="sm:hidden">नया तरीका</span>
            </button>

            {/* Prompt Vault */}
            <button
              id="header-prompts-btn"
              onClick={onOpenPrompts}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] hover:bg-[#1a1a1a] text-gray-200 text-xs font-semibold border border-[#333] hover:border-[#3b82f6] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#f59e0b]" />
              <span>प्रॉम्प्ट्स</span>
            </button>

            {/* Income Calculator */}
            <button
              id="header-calc-btn"
              onClick={onOpenCalculator}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] hover:bg-[#1a1a1a] text-gray-200 text-xs font-semibold border border-[#333] hover:border-[#10b981] transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#10b981]" />
              <span>कमाई कैलकुलेटर</span>
            </button>

            {/* AI Guru Chat */}
            <button
              id="header-chat-btn"
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161616] hover:bg-[#202020] text-gray-200 text-xs sm:text-sm font-semibold border border-[#333] hover:border-[#3b82f6] transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
              <span className="hidden sm:inline">गुरु से पूछें</span>
            </button>


            {/* Google Tasks Auth Status */}
            {isConnected ? (
              <div className="flex items-center gap-1.5 bg-[#111] p-1 pr-2 rounded-xl border border-[#333]">
                <button
                  id="header-tasks-open-btn"
                  onClick={onOpenTasks}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#3b82f6]/20 hover:bg-[#3b82f6]/30 text-[#3b82f6] text-xs font-semibold border border-[#3b82f6]/40 transition-colors"
                  title="Google Tasks देखें"
                >
                  <ListTodo className="w-4 h-4 text-[#3b82f6]" />
                  <span className="hidden sm:inline font-mono">Google Tasks</span>
                </button>
                <div className="hidden xl:flex items-center gap-1 text-xs text-gray-400 px-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="max-w-[110px] truncate">{userProfile?.email || 'Connected'}</span>
                </div>
                <button
                  id="header-google-logout-btn"
                  onClick={onDisconnectGoogle}
                  className="p-1 text-gray-400 hover:text-rose-400 rounded transition-colors"
                  title="Disconnect Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="header-google-login-btn"
                onClick={onConnectGoogle}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#3b82f6]/20 transition-all active:scale-95 border border-[#3b82f6]/50"
              >
                <LogIn className="w-4 h-4" />
                <span>Google Tasks जोड़ें</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
