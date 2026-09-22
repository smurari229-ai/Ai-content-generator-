/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Bot, 
  ListTodo, 
  Layers, 
  TrendingUp, 
  HelpCircle, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MonetizationMethod, GoogleUserProfile } from './types';
import { INITIAL_MONETIZATION_METHODS } from './data/monetizationCatalog';
import { ADDITIONAL_DYNAMIC_METHODS } from './data/additionalMethods';
import { storageService } from './utils/storageService';
import { googleTasksService } from './services/googleTasksService';
import { Header } from './components/Header';
import { ContinuousFeed } from './components/ContinuousFeed';
import { CustomPlanWizard } from './components/CustomPlanWizard';
import { PlanDetailModal } from './components/PlanDetailModal';
import { GoogleTasksDrawer } from './components/GoogleTasksDrawer';
import { AIChatCoachModal } from './components/AIChatCoachModal';
import { PromptsVaultModal } from './components/PromptsVaultModal';
import { IncomeCalculatorModal } from './components/IncomeCalculatorModal';
import { AIContentGeneratorModal } from './components/AIContentGeneratorModal';
import { FreeVideoToolsModal } from './components/FreeVideoToolsModal';

export default function App() {
  const [methods, setMethods] = useState<MonetizationMethod[]>(() => {
    return storageService.getMethods();
  });
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  // Modals & Drawers state
  const [isCustomWizardOpen, setIsCustomWizardOpen] = useState(false);
  const [selectedMethodForDetail, setSelectedMethodForDetail] = useState<MonetizationMethod | null>(null);
  const [isTasksDrawerOpen, setIsTasksDrawerOpen] = useState(false);
  const [isChatCoachOpen, setIsChatCoachOpen] = useState(false);
  const [isPromptsVaultOpen, setIsPromptsVaultOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isContentGeneratorOpen, setIsContentGeneratorOpen] = useState(false);
  const [isFreeVideoToolsOpen, setIsFreeVideoToolsOpen] = useState(false);
  const [contentGeneratorTopic, setContentGeneratorTopic] = useState<string>('');

  // Google Tasks auth & sync state
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [userProfile, setUserProfile] = useState<GoogleUserProfile | null>(null);
  const [syncingMethodId, setSyncingMethodId] = useState<string | null>(null);
  const [syncedMethodIds, setSyncedMethodIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize GSI
  useEffect(() => {
    googleTasksService.initGSI((token) => {
      if (token) {
        setIsGoogleConnected(true);
        googleTasksService.getUserProfile().then((profile) => {
          if (profile) setUserProfile(profile);
        });
        showToast('Google Tasks से सफलतापूर्वक कनेक्ट हो गए!', 'success');
      }
    });

    if (googleTasksService.isConnected()) {
      setIsGoogleConnected(true);
      googleTasksService.getUserProfile().then((profile) => {
        if (profile) setUserProfile(profile);
      });
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConnectGoogle = async () => {
    try {
      await googleTasksService.requestAuth();
      setIsGoogleConnected(true);
      const profile = await googleTasksService.getUserProfile();
      if (profile) setUserProfile(profile);
      showToast('Google Tasks से कनेक्ट हो गया!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Google कनेक्ट करने में त्रुटि: ' + (e.message || 'त्रुटि'), 'error');
    }
  };

  const handleDisconnectGoogle = () => {
    googleTasksService.logout();
    setIsGoogleConnected(false);
    setUserProfile(null);
    showToast('Google Tasks डिस्कनेक्ट हो गया', 'info');
  };

  // "तरीका बताते रहो" - Generate next dynamic monetization method with local persistence & rich catalog fallbacks
  const handleGenerateNextIdea = async (categoryFocus?: string) => {
    setIsGeneratingIdea(true);
    showToast('AI नया कमाई का तरीका खोज रहा है...', 'info');

    const effectiveCategory = categoryFocus || (activeCategory === 'All' ? undefined : activeCategory);

    try {
      const existingTitles = methods.map((m) => m.title.toLowerCase().trim());
      let newIdeasToAdd: MonetizationMethod[] = [];

      // 1. Try server Gemini API
      try {
        const res = await fetch('/api/ai/generate-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: effectiveCategory,
            excludeTitles: existingTitles,
            language: 'hindi',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.ideas) && data.ideas.length > 0) {
            newIdeasToAdd = data.ideas.map((raw: any, index: number) => ({
              id: raw.id || `custom-idea-${Date.now()}-${index}`,
              title: raw.title,
              tagline: raw.tagline || 'AI से ऑनलाइन कमाई का नया तरीका',
              category: raw.category || (effectiveCategory || 'Freelance'),
              earningPotential: raw.earningPotential || '₹40,000 - ₹1,20,000 / माह',
              timeToFirstRupee: raw.timeToFirstRupee || '15 - 30 दिन',
              difficulty: (raw.difficulty as any) || 'Medium',
              investmentRequired: raw.investmentRequired || '₹0',
              description: raw.description || 'इस तरीके से आप AI की सहायता से ऑनलाइन कमाई शुरू कर सकते हैं।',
              toolsNeeded: (raw.toolsNeeded || ['Gemini', 'ChatGPT']).map((t: string) => ({
                name: t,
                isFree: true,
                badge: 'Free / Freemium',
              })),
              keySteps: raw.keySteps || ['मार्केट रिसर्च करें', 'AI टूल्स से आउटपुट बनाएं', 'क्लाइंट्स तक पहुंचें'],
              starterPrompt: raw.starterPrompt || 'मुझे इस तरीके के लिए हाई-कन्वर्टिंग टेम्पलेट तैयार करके दो।',
              googleTasks: raw.googleTasks || [
                {
                  title: `Step 1 for ${raw.title}`,
                  notes: 'पहला बेसिक सेटअप और टूल्स टेस्टिंग',
                  dayOffset: 1,
                },
                {
                  title: `Step 2 for ${raw.title}`,
                  notes: 'कंटेंट या पोर्टफोलियो तैयार करें',
                  dayOffset: 3,
                },
              ],
            }));
          }
        }
      } catch (apiErr) {
        console.warn('API generation failed, pulling from offline pool:', apiErr);
      }

      // 2. If API was unavailable or returned empty, pick from additional pool
      if (newIdeasToAdd.length === 0) {
        const unusedPool = ADDITIONAL_DYNAMIC_METHODS.filter(
          (m) => !existingTitles.includes(m.title.toLowerCase().trim()) &&
                 (!effectiveCategory || m.category === effectiveCategory)
        );

        if (unusedPool.length > 0) {
          // Take the next unused method
          newIdeasToAdd = [unusedPool[0]];
        } else {
          // If all additional are used, create a parameterized variation
          const fallbackPool = ADDITIONAL_DYNAMIC_METHODS.filter((m) => !effectiveCategory || m.category === effectiveCategory);
          const base = fallbackPool.length > 0 ? fallbackPool[Math.floor(Math.random() * fallbackPool.length)] : INITIAL_MONETIZATION_METHODS[0];
          newIdeasToAdd = [{
            ...base,
            id: `method-variant-${Date.now()}`,
            title: `${base.title} (एडवांस 2026 स्ट्रेटेजी)`,
            tagline: `स्केलेबल मॉडल: ${base.tagline}`,
          }];
        }
      }

      // Save to storage and update state
      newIdeasToAdd.forEach((item) => storageService.addMethod(item));
      const updated = storageService.getMethods();
      setMethods(updated);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      showToast(`🎉 नया कमाई का तरीका "${newIdeasToAdd[0].title}" जोड़ा गया!`, 'success');
    } catch (e: any) {
      console.error('Error generating idea:', e);
      showToast('नया तरीका लोड करने में त्रुटि हुई।', 'error');
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  // Sync tasks from a MonetizationMethod to Google Tasks
  const handleSyncMethodTasks = async (method: MonetizationMethod) => {
    if (!isGoogleConnected) {
      await handleConnectGoogle();
      return;
    }

    setSyncingMethodId(method.id);
    try {
      const result = await googleTasksService.syncRoadmapPlan(method.title, method.googleTasks);
      setSyncedMethodIds((prev) => new Set([...prev, method.id]));

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });

      showToast(`🎯 Google Tasks में ${result.count} टास्क लिस्ट के साथ सिंक हो गए!`, 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Google Tasks सिंक करने में त्रुटि: ' + (e.message || 'त्रुटि'), 'error');
    } finally {
      setSyncingMethodId(null);
    }
  };

  // Sync tasks from Custom Plan Wizard
  const handleSyncCustomPlanTasks = async (
    title: string,
    tasks: { title: string; notes: string; dayOffset: number }[]
  ) => {
    const result = await googleTasksService.syncRoadmapPlan(title, tasks);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });
    showToast(`🎯 Google Tasks में ${result.count} एक्शन टास्क सिंक हो गए!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                : 'bg-[#111] text-gray-200 border-[#333]'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#f59e0b] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        isConnected={isGoogleConnected}
        userProfile={userProfile}
        onConnectGoogle={handleConnectGoogle}
        onDisconnectGoogle={handleDisconnectGoogle}
        onOpenTasks={() => setIsTasksDrawerOpen(true)}
        onOpenChat={() => setIsChatCoachOpen(true)}
        onOpenPrompts={() => setIsPromptsVaultOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenContentGenerator={() => setIsContentGeneratorOpen(true)}
        onOpenFreeVideoTools={() => setIsFreeVideoToolsOpen(true)}
        onTriggerNewIdea={() => handleGenerateNextIdea()}
        isGeneratingNewIdea={isGeneratingIdea}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <ContinuousFeed
          methods={methods}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onGenerateNewMethod={handleGenerateNextIdea}
          isGenerating={isGeneratingIdea}
          onOpenCustomWizard={() => setIsCustomWizardOpen(true)}
          onOpenContentGenerator={() => setIsContentGeneratorOpen(true)}
          onOpenFreeVideoTools={() => setIsFreeVideoToolsOpen(true)}
          onViewDetails={(m) => setSelectedMethodForDetail(m)}
          onSyncTasks={handleSyncMethodTasks}
          syncingMethodId={syncingMethodId}
          syncedMethodIds={syncedMethodIds}
        />
      </main>

      {/* Floating Action Coach button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          id="floating-tasks-btn"
          onClick={() => setIsTasksDrawerOpen(true)}
          className="p-3.5 rounded-2xl bg-[#111] hover:bg-[#1a1a1a] text-[#3b82f6] border border-[#333] hover:border-[#3b82f6] shadow-2xl transition-all hover:scale-105 active:scale-95"
          title="Google Tasks देखें"
        >
          <ListTodo className="w-6 h-6" />
        </button>

        <button
          id="floating-chat-btn"
          onClick={() => setIsChatCoachOpen(true)}
          className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white hover:bg-gray-200 text-black font-extrabold text-xs sm:text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white"
          title="AI कमाई गुरु से पूछें"
        >
          <Bot className="w-5 h-5 text-black stroke-[2.5]" />
          <span className="hidden sm:inline">AI गुरु से पूछें</span>
        </button>
      </div>

      {/* Bento Footer */}
      <footer className="border-t border-[#262626] bg-[#050505] py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-400">© 2026 AI-इनकम लैब</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">Powered by Gemini 2.5 Flash & Google Tasks API</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400 font-mono text-[11px]">
            <button onClick={() => setIsContentGeneratorOpen(true)} className="hover:text-[#3b82f6] transition-colors">
              AI कंटेंट जनरेटर
            </button>
            <button onClick={() => setIsPromptsVaultOpen(true)} className="hover:text-[#f59e0b] transition-colors">
              प्रॉम्प्ट वॉल्ट
            </button>
            <button onClick={() => setIsCalculatorOpen(true)} className="hover:text-[#10b981] transition-colors">
              कमाई कैलकुलेटर
            </button>
            <button onClick={() => setIsTasksDrawerOpen(true)} className="hover:text-[#3b82f6] transition-colors">
              Google Tasks
            </button>
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#333]">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-semibold">
                सिस्टम लाइव
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AIContentGeneratorModal
        isOpen={isContentGeneratorOpen}
        onClose={() => {
          setIsContentGeneratorOpen(false);
          setContentGeneratorTopic('');
        }}
        initialTopic={contentGeneratorTopic}
        initialOpenStudio={true}
      />

      <FreeVideoToolsModal
        isOpen={isFreeVideoToolsOpen}
        onClose={() => setIsFreeVideoToolsOpen(false)}
        onOpenInAppStudio={() => {
          setIsFreeVideoToolsOpen(false);
          setIsContentGeneratorOpen(true);
        }}
      />

      <CustomPlanWizard
        isOpen={isCustomWizardOpen}
        onClose={() => setIsCustomWizardOpen(false)}
        onSyncTasks={handleSyncCustomPlanTasks}
        isGoogleConnected={isGoogleConnected}
        onConnectGoogle={handleConnectGoogle}
      />

      <PlanDetailModal
        method={selectedMethodForDetail}
        onClose={() => setSelectedMethodForDetail(null)}
        onSyncTasks={handleSyncMethodTasks}
        isSyncingTasks={syncingMethodId === selectedMethodForDetail?.id}
        isTasksSynced={Boolean(selectedMethodForDetail && syncedMethodIds.has(selectedMethodForDetail.id))}
        isGoogleConnected={isGoogleConnected}
        onConnectGoogle={handleConnectGoogle}
        onOpenContentGenerator={(topic) => {
          setSelectedMethodForDetail(null);
          setContentGeneratorTopic(topic);
          setIsContentGeneratorOpen(true);
        }}
      />


      <GoogleTasksDrawer
        isOpen={isTasksDrawerOpen}
        onClose={() => setIsTasksDrawerOpen(false)}
        isConnected={isGoogleConnected}
        userProfile={userProfile}
        onConnectGoogle={handleConnectGoogle}
      />

      <AIChatCoachModal
        isOpen={isChatCoachOpen}
        onClose={() => setIsChatCoachOpen(false)}
      />

      <PromptsVaultModal
        isOpen={isPromptsVaultOpen}
        onClose={() => setIsPromptsVaultOpen(false)}
      />

      <IncomeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}

