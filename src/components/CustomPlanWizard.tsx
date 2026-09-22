import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wand2, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Copy, 
  Check, 
  ListPlus, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  ListTodo,
  CheckSquare,
  Square,
  IndianRupee
} from 'lucide-react';
import { CustomRoadmapPlan } from '../types';
import { generateRealistic30DayPlan } from '../data/customPlanGenerator';
import { storageService } from '../utils/storageService';
import { safeFetchJson } from '../services/apiHelper';

interface CustomPlanWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncTasks: (title: string, tasks: { title: string; notes: string; dayOffset: number }[]) => Promise<void>;
  isGoogleConnected: boolean;
  onConnectGoogle: () => void;
}

export const CustomPlanWizard: React.FC<CustomPlanWizardProps> = ({
  isOpen,
  onClose,
  onSyncTasks,
  isGoogleConnected,
  onConnectGoogle,
}) => {
  const [skillLevel, setSkillLevel] = useState('Beginner (शुरुआती)');
  const [dailyTime, setDailyTime] = useState('2 घंटे प्रतिदिन');
  const [budget, setBudget] = useState('₹0 (सिर्फ फ्री AI टूल्स)');
  const [earningGoal, setEarningGoal] = useState('₹30,000 / महीना');
  const [niche, setNiche] = useState('YouTube / Reels & Content Creation');
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');

  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<CustomRoadmapPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [taskCompletions, setTaskCompletions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const savedPlan = storageService.getCustomPlan();
      if (savedPlan) {
        setPlan(savedPlan);
      }
      setTaskCompletions(storageService.getTaskCompletions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSynced(false);

    try {
      // 1. First attempt Gemini API endpoint
      let generatedPlan: CustomRoadmapPlan | null = null;
      try {
        const res = await safeFetchJson<{
          success: boolean;
          plan?: CustomRoadmapPlan;
          error?: string;
        }>('/api/ai/custom-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillLevel,
            dailyTime,
            budget,
            earningGoal,
            niche,
            language,
          }),
        });

        if (res.ok && res.data && res.data.success && res.data.plan) {
          generatedPlan = res.data.plan;
        }
      } catch (apiErr) {
        console.warn('API generation fallback to offline 30-day generator:', apiErr);
      }

      // 2. Reliable offline fallback generator with all 30 days if server API is unavailable
      if (!generatedPlan) {
        generatedPlan = generateRealistic30DayPlan({
          niche,
          dailyTime,
          budget,
          skillLevel,
          earningGoal,
          language,
        });
      }

      setPlan(generatedPlan);
      storageService.saveCustomPlan(generatedPlan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'योजना बनाने में त्रुटि हुई। कृपया पुन: प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (taskKey: string) => {
    const res = storageService.toggleTaskCompletion(taskKey);
    setTaskCompletions(res.completions);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSyncToGoogle = async () => {
    if (!plan) return;
    if (!isGoogleConnected) {
      onConnectGoogle();
      return;
    }

    setIsSyncing(true);
    try {
      await onSyncTasks(plan.title, plan.googleTasks || []);
      setIsSynced(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const totalTasks = plan?.googleTasks?.length || 0;
  const completedTasksCount = (plan?.googleTasks || []).filter((_, idx) =>
    Boolean(taskCompletions[`custom_plan_task_${idx}`])
  ).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="custom-plan-modal-container"
        className="relative w-full max-w-4xl bg-[#111] border border-[#333] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0c0c0c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center border border-[#3b82f6]/30">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                कस्टम AI कमाई रोडमैप जनरेटर (30-दिन प्लान)
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                समय, बजट और कमाई लक्ष्य के आधार पर Day 1 से Day 30 तक एक्शन प्लान
              </p>
            </div>
          </div>
          <button
            id="close-custom-wizard-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Configuration Form */}
          {!plan && (
            <form onSubmit={handleGeneratePlan} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Niche */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
                    आपकी रुचि / फील्ड (Niche)
                  </label>
                  <select
                    id="wizard-niche-select"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-[#050505] border border-[#262626] rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="YouTube / Reels & Content Creation">
                      YouTube / Reels & AI वीडियो क्रिएशन
                    </option>
                    <option value="Freelancing & Copywriting">
                      AI कॉपीराइटिंग, ट्रांसलेशन व फ्रीलांसिंग
                    </option>
                    <option value="Local Business AI Chatbots & Agency">
                      लोकल बिजनेसेज के लिए AI चैटबॉट्स व लीड जेनरेशन
                    </option>
                    <option value="Digital Products & Notion Templates">
                      प्रॉम्प्ट पैक्स, ई-बुक्स और Notion टेम्पलेट्स (पैसिव इनकम)
                    </option>
                    <option value="AI Workflow Automation (Make/Zapier)">
                      AI वर्कफ़्लो ऑटोमेशन कंसल्टिंग
                    </option>
                    <option value="Micro-SaaS & Web Tools">
                      Micro-SaaS और कस्टम AI टूल्स
                    </option>
                  </select>
                </div>

                {/* Earning Goal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-[#10b981]" /> मासिक कमाई का लक्ष्य
                  </label>
                  <select
                    id="wizard-goal-select"
                    value={earningGoal}
                    onChange={(e) => setEarningGoal(e.target.value)}
                    className="w-full bg-[#050505] border border-[#262626] rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="₹15,000 - ₹30,000 / महीना">₹15,000 - ₹30,000 / महीना (साइड इनकम)</option>
                    <option value="₹30,000 - ₹60,000 / महीना">₹30,000 - ₹60,000 / महीना (पार्ट-टाइम ग्रोथ)</option>
                    <option value="₹75,000 - ₹1,50,000+ / महीना">₹75,000 - ₹1,50,000+ / महीना (फुल-टाइम एजेंसी/SaaS)</option>
                  </select>
                </div>

                {/* Daily Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
                    प्रतिदिन कितना समय दे सकते हैं?
                  </label>
                  <select
                    id="wizard-time-select"
                    value={dailyTime}
                    onChange={(e) => setDailyTime(e.target.value)}
                    className="w-full bg-[#050505] border border-[#262626] rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="1 घंटा प्रतिदिन (Part-time / Student)">1 घंटा प्रतिदिन (पार्ट-टाइम / स्टूडेंट)</option>
                    <option value="2-3 घंटे प्रतिदिन">2-3 घंटे प्रतिदिन (आदर्श शुरुआत)</option>
                    <option value="5+ घंटे (Full-time Solopreneur)">5+ घंटे (फुल-टाइम डेडिकेटेड)</option>
                  </select>
                </div>

                {/* Starting Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
                    शुरुआती बजट
                  </label>
                  <select
                    id="wizard-budget-select"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#050505] border border-[#262626] rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="₹0 (सिर्फ फ्री AI टूल्स)">₹0 (सिर्फ 100% फ्री टूल्स)</option>
                    <option value="₹1,000 - ₹3,000 (डोमेन व बेसिक सब्सक्रिप्शन)">₹1,000 - ₹3,000 (स्मॉल स्टार्ट)</option>
                    <option value="₹5,000+ (प्रीमियम AI टूल्स व ऐड्स)">₹5,000+ (फास्ट ग्रोथ)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  id="wizard-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-sm shadow-lg shadow-[#3b82f6]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                >
                  <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'AI 30-दिन का एक्शन प्लान बना रहा है...' : 'मेरा कस्टम 30-दिन प्लान बनाएं'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Generated Plan View */}
          {plan && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Banner */}
              <div className="p-5 rounded-3xl bg-[#050505] border border-[#333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-lg bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                      {plan.difficulty} Level
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-lg bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                      30-Day Blueprint
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-white mt-2">{plan.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{plan.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="wizard-regenerate-btn"
                    onClick={() => {
                      setPlan(null);
                      storageService.saveCustomPlan(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#161616] hover:bg-[#222] text-gray-300 text-xs font-semibold border border-[#333] transition-colors"
                  >
                    नया प्लान बनाएं
                  </button>
                  <button
                    id="wizard-sync-tasks-btn"
                    onClick={handleSyncToGoogle}
                    disabled={isSyncing}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 ${
                      isSynced
                        ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                        : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[#3b82f6]/20'
                    }`}
                  >
                    {isSynced ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                        <span className="font-mono">Google Tasks में सिंक हो गया!</span>
                      </>
                    ) : (
                      <>
                        <ListPlus className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'सिंक हो रहा है...' : 'Google Tasks में सिंक करें'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Earnings Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" /> महीना 1 (पहला लक्ष्य)
                  </span>
                  <p className="text-base font-bold font-mono text-[#10b981] mt-1">{plan.potentialEarnings.month1}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <Zap className="w-3.5 h-3.5 text-[#f59e0b]" /> महीना 3 (स्थिर आय)
                  </span>
                  <p className="text-base font-bold font-mono text-[#f59e0b] mt-1">{plan.potentialEarnings.month3}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3b82f6]" /> महीना 6 (स्केलिंग स्तर)
                  </span>
                  <p className="text-base font-bold font-mono text-[#3b82f6] mt-1">{plan.potentialEarnings.month6}</p>
                </div>
              </div>

              {/* Overview */}
              <div className="p-5 rounded-2xl bg-[#050505] border border-[#222]">
                <h5 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                  यह मॉडल कैसे काम करता है? (Overview)
                </h5>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {plan.overview}
                </p>
              </div>

              {/* 30-Day Interactive Action Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-[#3b82f6]" /> Day 1 से Day 30 तक के दैनिक एक्शन टास्क
                  </h5>
                  <span className="text-xs font-mono text-[#10b981] font-bold">
                    {completedTasksCount}/{totalTasks} पूरा हुआ ({progressPercentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {plan.googleTasks && plan.googleTasks.map((task, idx) => {
                    const taskKey = `custom_plan_task_${idx}`;
                    const isChecked = Boolean(taskCompletions[taskKey]);

                    return (
                      <div
                        key={idx}
                        id={`custom-task-${idx}`}
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
                            <p className={`text-[11px] mt-0.5 leading-relaxed ${isChecked ? 'text-gray-500' : 'text-gray-400'}`}>
                              {task.notes}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 shrink-0">
                          Day {task.dayOffset}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4-Phase Roadmap Summary */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#3b82f6]" /> 4-चरणीय रोडमैप सारांश
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.roadmap.map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#050505] border border-[#222] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h6 className="text-xs font-bold text-white">{phase.phase}</h6>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#161616] text-gray-400 border border-[#262626]">
                          Phase {idx + 1}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono text-gray-400">मुख्य लक्ष्य:</span>
                        <ul className="text-xs text-gray-300 list-disc list-inside space-y-0.5">
                          {phase.goals.map((g, gIdx) => (
                            <li key={gIdx}>{g}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-[#222]">
                        <span className="text-[11px] font-mono text-gray-400">एक्शन स्टेप्स:</span>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {phase.actionSteps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Prompts */}
              {plan.promptsToGetStarted && plan.promptsToGetStarted.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#f59e0b]" /> कॉपी-पेस्ट AI मास्टर प्रॉम्प्ट्स
                  </h5>
                  <div className="space-y-2.5">
                    {plan.promptsToGetStarted.map((p, pIdx) => (
                      <div key={pIdx} className="p-4 rounded-2xl bg-[#050505] border border-[#222]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-200">{p.label}</span>
                          <button
                            id={`wizard-copy-prompt-${pIdx}`}
                            onClick={() => handleCopyPrompt(p.promptText, pIdx)}
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#161616] hover:bg-[#222] text-gray-300 border border-[#333] transition-colors"
                          >
                            {copiedIndex === pIdx ? (
                              <>
                                <Check className="w-3 h-3 text-[#10b981]" />
                                <span className="text-[#10b981] font-mono font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="font-mono">Copy Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-300 font-mono whitespace-pre-wrap bg-[#0c0c0c] p-3 rounded-xl border border-[#222] leading-relaxed">
                          {p.promptText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Tools & Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#050505] border border-[#222] space-y-2">
                  <h5 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    ज़रूरी AI टूल्स
                  </h5>
                  <div className="space-y-1.5">
                    {plan.recommendedTools.map((t, tIdx) => (
                      <div key={tIdx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#222] last:border-none">
                        <div>
                          <span className="font-semibold text-gray-200">{t.name}</span>
                          <p className="text-[11px] text-gray-400">{t.purpose}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${t.isFree ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30' : 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30'}`}>
                          {t.isFree ? 'Free' : 'Paid/Freemium'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050505] border border-[#222] space-y-2">
                  <h5 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    पैसे कमाने के चैनल्स (Monetization)
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-2">
                    {plan.monetizationChannels.map((c, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pitfalls & Pro Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#1f0a0a] border border-[#f43f5e]/30 space-y-2">
                  <h5 className="text-xs font-mono font-bold text-[#f43f5e] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#f43f5e]" /> आम गलतियाँ जिनसे बचें
                  </h5>
                  <ul className="text-xs text-rose-200/80 space-y-1 list-disc list-inside leading-relaxed">
                    {plan.commonPitfallsToAvoid.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1405] border border-[#f59e0b]/30 space-y-2">
                  <h5 className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" /> प्रो टिप्स (Pro Tips)
                  </h5>
                  <ul className="text-xs text-amber-200/80 space-y-1 list-disc list-inside leading-relaxed">
                    {plan.proTips.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

