import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Clock, 
  Wrench, 
  Sparkles, 
  Copy, 
  Check, 
  ListPlus, 
  CheckCircle2, 
  CheckCircle,
  Lightbulb,
  Zap,
  ListTodo,
  CheckSquare,
  Square
} from 'lucide-react';
import { MonetizationMethod } from '../types';
import { storageService } from '../utils/storageService';

interface PlanDetailModalProps {
  method: MonetizationMethod | null;
  onClose: () => void;
  onSyncTasks: (method: MonetizationMethod) => Promise<void>;
  isSyncingTasks?: boolean;
  isTasksSynced?: boolean;
  isGoogleConnected: boolean;
  onConnectGoogle: () => void;
  onOpenContentGenerator?: (topic: string) => void;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  method,
  onClose,
  onSyncTasks,
  isSyncingTasks,
  isTasksSynced,
  isGoogleConnected,
  onConnectGoogle,
  onOpenContentGenerator,
}) => {

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [completions, setCompletions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCompletions(storageService.getTaskCompletions());
  }, [method]);

  if (!method) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(method.starterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleToggleTask = (taskKey: string) => {
    const res = storageService.toggleTaskCompletion(taskKey);
    setCompletions(res.completions);
  };

  const handleSync = async () => {
    if (!isGoogleConnected) {
      onConnectGoogle();
      return;
    }
    await onSyncTasks(method);
  };

  // Calculate completion percentage for this method's tasks
  const allTasksKeys = method.googleTasks.map((_, idx) => `${method.id}_task_${idx}`);
  const completedCount = allTasksKeys.filter((k) => completions[k]).length;
  const progressPercent = allTasksKeys.length > 0 ? Math.round((completedCount / allTasksKeys.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="plan-detail-modal-container"
        className="relative w-full max-w-3xl bg-[#111] border border-[#333] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0c0c0c] shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-lg bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
              {method.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Difficulty: {method.difficulty}
            </span>
          </div>
          <button
            id="close-plan-detail-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Title & Earning Bar */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {method.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{method.tagline}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
              <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" /> संभावित आय
              </span>
              <p className="text-sm font-bold font-mono text-[#10b981] mt-1">{method.earningPotential}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
              <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> पहली कमाई का समय
              </span>
              <p className="text-sm font-semibold font-mono text-gray-200 mt-1">{method.timeToFirstRupee}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
              <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                <Zap className="w-3.5 h-3.5 text-[#f59e0b]" /> शुरुआती निवेश
              </span>
              <p className="text-sm font-semibold font-mono text-[#f59e0b] mt-1">{method.investmentRequired}</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-[#050505] border border-[#222]">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
              तरीके का विवरण (How It Works)
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {method.description}
            </p>
          </div>

          {/* Key Execution Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
              शुरुआत करने के मुख्य स्टेप्स
            </h4>
            <div className="space-y-2">
              {method.keySteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#050505] border border-[#222] text-xs sm:text-sm text-gray-300">
                  <span className="w-5 h-5 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] font-mono font-bold flex items-center justify-center shrink-0 text-xs border border-[#3b82f6]/30">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Required */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#3b82f6]" /> आवश्यक AI टूल्स
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {method.toolsNeeded.map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050505] border border-[#222]">
                  <span className="text-xs font-semibold text-gray-200">{tool.name}</span>
                  {tool.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                      {tool.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Starter Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#f59e0b]" /> कॉपी-पेस्ट AI मास्टर प्रॉम्प्ट
              </h4>
              <button
                id="copy-modal-prompt-btn"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl bg-[#161616] hover:bg-[#222] text-gray-200 border border-[#333] transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-[#10b981] font-semibold font-mono">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-mono">Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-[#050505] border border-[#222] font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
              {method.starterPrompt}
            </div>
          </div>

          {/* Action Tasks with Interactive Completion Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4 text-[#3b82f6]" /> एक्शन टास्क सूची (कार्य पूरा होने पर टिक करें)
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#10b981] font-bold">
                  {completedCount}/{method.googleTasks.length} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2">
              {method.googleTasks.map((task, idx) => {
                const taskKey = `${method.id}_task_${idx}`;
                const isChecked = Boolean(completions[taskKey]);

                return (
                  <div 
                    key={idx} 
                    id={`task-item-${idx}`}
                    onClick={() => handleToggleTask(taskKey)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 text-xs ${
                      isChecked 
                        ? 'bg-[#0a1a0f] border-[#10b981]/40 text-gray-400' 
                        : 'bg-[#050505] hover:bg-[#0c0c0c] border-[#222] hover:border-[#444] text-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        type="button"
                        className="mt-0.5 shrink-0 text-[#10b981] transition-transform active:scale-90"
                        title={isChecked ? "Mark Incomplete" : "Mark Complete"}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                        )}
                      </button>
                      <div>
                        <span className={`font-semibold ${isChecked ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                          {task.title}
                        </span>
                        <p className={`text-[11px] mt-0.5 ${isChecked ? 'text-gray-500' : 'text-gray-400'}`}>
                          {task.notes}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shrink-0">
                      Day +{task.dayOffset}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pro Tips & Channels if available */}
          {method.proTips && method.proTips.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#1a1405] border border-[#f59e0b]/30 space-y-1.5">
              <h5 className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" /> प्रो टिप
              </h5>
              <ul className="text-xs text-amber-200/90 space-y-1 list-disc list-inside leading-relaxed">
                {method.proTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626] bg-[#0c0c0c] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="close-modal-footer-btn"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 text-xs sm:text-sm font-semibold border border-[#333] transition-colors"
            >
              बंद करें
            </button>
            {onOpenContentGenerator && (
              <button
                id="modal-generate-content-btn"
                onClick={() => {
                  onOpenContentGenerator(method.title);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#161616] hover:bg-[#202020] text-blue-400 text-xs sm:text-sm font-semibold border border-[#3b82f6]/30 hover:border-[#3b82f6] transition-colors flex items-center gap-1.5"
                title="इस टॉपिक पर वीडियो/पोस्ट कंटेंट बनाएं"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span className="hidden xs:inline">AI कंटेंट बनाएं</span>
              </button>
            )}
          </div>

          <button
            id="sync-modal-tasks-btn"
            onClick={handleSync}
            disabled={isSyncingTasks}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 ${
              isTasksSynced
                ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[#3b82f6]/20'
            }`}
          >
            {isTasksSynced ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span className="font-mono">Google Tasks में सिंक हो गया!</span>
              </>
            ) : (
              <>
                <ListPlus className={`w-4 h-4 ${isSyncingTasks ? 'animate-spin' : ''}`} />
                <span>{isSyncingTasks ? 'Google Tasks में सिंक हो रहा है...' : 'Google Tasks में सिंक करें'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

