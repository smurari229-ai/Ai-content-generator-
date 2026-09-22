import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Video,
  Film,
  Instagram,
  Facebook,
  FileText,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Hash,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Wand2,
  Share2,
  Globe2,
  Clock,
  Play,
  Pause,
  Clapperboard,
  Loader2,
  Music,
  Volume2,
  VolumeX,
  Layers,
  Sparkle,
  CheckCircle2,
  Sliders,
  ExternalLink,
  ChevronRight,
  ListOrdered,
  Download
} from 'lucide-react';
import {
  ContentTypeOption,
  ContentLanguageOption,
  GeneratedContentResult,
  FreeVideoMakerBlueprint,
  FreeVideoMakerState,
  VideoStoryboardScene
} from '../types';
import { storageService } from '../utils/storageService';
import { safeFetchJson } from '../services/apiHelper';
import {
  generateClientFallbackContent,
  generateClientFallbackVideoBlueprint,
  generateClientFallbackScene,
} from '../services/clientFallbackService';
import sampleSplitThumbnail from '../assets/images/earning_split_thumbnail_1788401022413.jpg';
import { FreeVideoToolsDirectory } from './FreeVideoToolsDirectory';
import { InAppVideoStudio } from './InAppVideoStudio';
import { copyToClipboard } from '../utils/safeClipboard';

interface AIContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialContentType?: ContentTypeOption;
  initialOpenStudio?: boolean;
}

const CONTENT_TYPES: { value: ContentTypeOption; label: string; icon: React.ReactNode; badge: string }[] = [
  { value: 'YouTube Video', label: 'YouTube Video', icon: <Video className="w-4 h-4 text-[#ef4444]" />, badge: 'Long Form' },
  { value: 'YouTube Shorts', label: 'YouTube Shorts', icon: <Film className="w-4 h-4 text-[#ef4444]" />, badge: '60s Short' },
  { value: 'Instagram Reel', label: 'Instagram Reel', icon: <Instagram className="w-4 h-4 text-[#ec4899]" />, badge: 'Viral Reel' },
  { value: 'Facebook Post', label: 'Facebook Post', icon: <Facebook className="w-4 h-4 text-[#3b82f6]" />, badge: 'Engagement' },
  { value: 'Blog Post', label: 'Blog Post', icon: <FileText className="w-4 h-4 text-[#10b981]" />, badge: 'SEO Article' },
];

const SAMPLE_TOPICS = [
  '2026 में AI से ₹50,000/महीना कमाने के 5 तरीके',
  'Faceless YouTube Shorts & Reels चैनल कैसे बनाएं और मोनेटाइज करें',
  'Student के लिए Zero Investment Online AI Business Ideas',
  'Freelance Copywriting में AI की मदद से High-Paying Clients कैसे पाएं',
  'Top 5 Free AI Tools in 2026 to Make Money Online',
  'Instagram Reels वायरल करने का सीक्रेट 3-स्टेप फॉर्मूला',
];

export const AIContentGeneratorModal: React.FC<AIContentGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
  initialContentType = 'YouTube Shorts',
  initialOpenStudio = false,
}) => {
  const [contentType, setContentType] = useState<ContentTypeOption>(initialContentType);
  const [topic, setTopic] = useState(initialTopic);
  const [language, setLanguage] = useState<ContentLanguageOption>('Hindi');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContentResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<GeneratedContentResult[]>([]);

  // 100% FREE AI Video Maker State
  const [videoMakerState, setVideoMakerState] = useState<FreeVideoMakerState>({
    status: 'idle',
  });
  const [videoStudioTab, setVideoStudioTab] = useState<'studio' | 'storyboard' | 'tools'>('studio');
  const [activeTtsScene, setActiveTtsScene] = useState<number | null>(null);
  const [isTtsPlaying, setIsTtsPlaying] = useState<boolean>(false);

  // Stop speech on unmount or close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const activeTopic = initialTopic || topic || 'AI YouTube Shorts से ₹50,000/माह';
      if (initialTopic) setTopic(initialTopic);
      if (initialContentType) setContentType(initialContentType);
      const history = storageService.getGeneratedContentHistory();
      setRecentHistory(history);

      let currentActiveResult = result;
      // If initialTopic is specified and doesn't match current result, or if no result yet, regenerate for the active topic
      const needsTopicRefresh = !currentActiveResult || (initialTopic && currentActiveResult.topic !== initialTopic);

      if (needsTopicRefresh) {
        if (!initialTopic && history.length > 0) {
          currentActiveResult = history[0];
        } else {
          currentActiveResult = generateClientFallbackContent(
            activeTopic,
            (initialContentType || 'YouTube Shorts') as ContentTypeOption,
            'Hindi'
          );
        }
        setResult(currentActiveResult);
      }

      // If initialOpenStudio requested or videoMakerState is idle, or videoMaker topic doesn't match active topic, ready blueprint immediately
      const currentBlueprintTitle = videoMakerState.blueprint?.videoTitle || '';
      const isBlueprintMismatched = currentActiveResult && (!currentBlueprintTitle || (!currentBlueprintTitle.toLowerCase().includes(currentActiveResult.topic.toLowerCase()) && !currentActiveResult.topic.toLowerCase().includes(currentBlueprintTitle.toLowerCase())));

      if (currentActiveResult && (videoMakerState.status === 'idle' || initialOpenStudio || isBlueprintMismatched)) {
        const blueprint = generateClientFallbackVideoBlueprint(
          currentActiveResult.topic,
          currentActiveResult.contentType,
          currentActiveResult.language,
          currentActiveResult.script,
          currentActiveResult.thumbnailPrompt
        );
        setVideoMakerState({
          status: 'ready',
          blueprint,
        });
        setVideoStudioTab('studio');
      }
    }
  }, [isOpen, initialTopic, initialContentType, initialOpenStudio]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const stopAllTts = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTtsPlaying(false);
    setActiveTtsScene(null);
  };

  const handlePlayVoiceover = (text: string, sceneNum: number) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isTtsPlaying && activeTtsScene === sceneNum) {
      stopAllTts();
      return;
    }

    stopAllTts();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('hi') ||
        v.lang.toLowerCase().includes('in') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('india')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsTtsPlaying(true);
      setActiveTtsScene(sceneNum);
    };

    utterance.onend = () => {
      setIsTtsPlaying(false);
      setActiveTtsScene(null);
    };

    utterance.onerror = () => {
      setIsTtsPlaying(false);
      setActiveTtsScene(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayFullVoiceover = () => {
    if (!videoMakerState.blueprint) return;
    const allVoiceover = videoMakerState.blueprint.scenes
      .map((s) => `Scene ${s.sceneNumber}. ${s.voiceoverScript}`)
      .join(' ... ');
    handlePlayVoiceover(allVoiceover, 999);
  };

  const handleSelectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setError(null);
  };

  const handleGenerate = async (e?: React.FormEvent, overrideTopic?: string) => {
    if (e) e.preventDefault();
    const targetTopic = (typeof overrideTopic === 'string' ? overrideTopic : topic).trim();
    if (!targetTopic) {
      setError('कृपया एक विषय (Topic) दर्ज करें।');
      return;
    }

    setIsLoading(true);
    setError(null);
    stopAllTts();

    try {
      const response = await safeFetchJson<{
        success: boolean;
        data?: GeneratedContentResult;
        error?: string;
      }>('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          topic: targetTopic,
          language,
        }),
      });

      let generatedData: GeneratedContentResult;
      if (response.ok && response.data?.success && response.data?.data) {
        generatedData = response.data.data;
      } else {
        console.warn('Backend returned non-success or gateway page, using resilient client generator:', response.error);
        generatedData = generateClientFallbackContent(targetTopic, contentType, language);
      }

      setResult(generatedData);
      storageService.saveGeneratedContentHistory(generatedData);
      setRecentHistory(storageService.getGeneratedContentHistory());
      const matchedBlueprint = generateClientFallbackVideoBlueprint(
        generatedData.topic,
        generatedData.contentType,
        generatedData.language,
        generatedData.script,
        generatedData.thumbnailPrompt
      );
      setVideoMakerState({
        status: 'ready',
        blueprint: matchedBlueprint,
      });
    } catch (err: any) {
      console.warn('Content Generation exception, using resilient client generator:', err);
      const fallbackData = generateClientFallbackContent(targetTopic, contentType, language);
      setResult(fallbackData);
      storageService.saveGeneratedContentHistory(fallbackData);
      setRecentHistory(storageService.getGeneratedContentHistory());
      const matchedBlueprint = generateClientFallbackVideoBlueprint(
        fallbackData.topic,
        fallbackData.contentType,
        fallbackData.language,
        fallbackData.script,
        fallbackData.thumbnailPrompt
      );
      setVideoMakerState({
        status: 'ready',
        blueprint: matchedBlueprint,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 100% FREE AI Video Maker Blueprint Generation Handler
  const handleGenerateFreeVideoPlan = async () => {
    if (!result) return;
    stopAllTts();

    setVideoMakerState({
      status: 'generating',
    });

    try {
      const res = await safeFetchJson<{
        success: boolean;
        blueprint?: FreeVideoMakerBlueprint;
        error?: string;
      }>('/api/ai/generate-free-video-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: result.script,
          thumbnailPrompt: result.thumbnailPrompt,
          topic: result.topic,
          contentType: result.contentType,
          language: result.language,
          titles: result.titles,
        }),
      });

      if (res.ok && res.data?.success && res.data?.blueprint) {
        setVideoMakerState({
          status: 'ready',
          blueprint: res.data.blueprint,
        });
        setVideoStudioTab('studio');
        return;
      }

      console.warn('Free video blueprint API fallback triggered:', res.error);
      const fallbackBlueprint = generateClientFallbackVideoBlueprint(
        result.topic,
        result.contentType,
        result.language,
        result.script,
        result.thumbnailPrompt
      );
      setVideoMakerState({
        status: 'ready',
        blueprint: fallbackBlueprint,
      });
      setVideoStudioTab('studio');
    } catch (err: any) {
      console.warn('Free Video Maker error, using resilient client generator:', err);
      const fallbackBlueprint = generateClientFallbackVideoBlueprint(
        result.topic,
        result.contentType,
        result.language,
        result.script,
        result.thumbnailPrompt
      );
      setVideoMakerState({
        status: 'ready',
        blueprint: fallbackBlueprint,
      });
      setVideoStudioTab('studio');
    }
  };

  const handleCopySingleScene = (scene: VideoStoryboardScene) => {
    const lines = [
      `🎬 [SCENE ${scene.sceneNumber}: ${scene.sceneTitle}]`,
      `⏱️ Duration: ${scene.duration || '8s'} (Time: ${scene.timeRange})`,
      `📹 Visual Action: ${scene.visualDescription}`,
      `🎨 Free AI Image Prompt (Bing/Leonardo/Canva):`,
      scene.imagePrompt,
      `💬 On-Screen Caption: "${scene.caption || scene.onScreenText}"`,
      `🎙️ Voiceover: "${scene.voiceover || scene.voiceoverScript}"`,
      `🔀 Transition: ${scene.transition || 'Smooth Cross Dissolve'}`,
    ];
    if (scene.bgmCue) {
      lines.push(`🎵 Music Suggestion: ${scene.bgmCue}`);
    }
    handleCopy(lines.join('\n'), `scene_${scene.sceneNumber}`);
  };

  const handleCopyAllScenes = () => {
    if (!videoMakerState.blueprint) return;
    const bp = videoMakerState.blueprint;
    const lines: string[] = [
      `🎬 ALL SCENES STORYBOARD: ${bp.videoTitle}`,
      `📐 Aspect Ratio: ${bp.aspectRatio} | ⏱️ Total Duration: ${bp.targetDuration}`,
      '========================================================\n'
    ];

    bp.scenes.forEach((scene) => {
      lines.push(
        `--- SCENE ${scene.sceneNumber}: ${scene.sceneTitle} ---`,
        `⏱️ Duration: ${scene.duration || '8s'} (Time: ${scene.timeRange})`,
        `📹 Visual Action: ${scene.visualDescription}`,
        `🎨 AI Image Prompt: ${scene.imagePrompt}`,
        `💬 Caption: "${scene.caption || scene.onScreenText}"`,
        `🎙️ Voiceover: "${scene.voiceover || scene.voiceoverScript}"`,
        `🔀 Transition: ${scene.transition || 'Smooth Cross Dissolve'}`,
        scene.bgmCue ? `🎵 Music Cue: ${scene.bgmCue}` : '',
        ''
      );
    });

    handleCopy(lines.filter(Boolean).join('\n'), 'all_scenes');
  };

  const handleCopyAllPrompts = () => {
    if (!videoMakerState.blueprint) return;
    const prompts = videoMakerState.blueprint.scenes
      .map(
        (s) =>
          `[Scene ${s.sceneNumber}: ${s.sceneTitle} (${s.duration || s.timeRange})]\n${s.imagePrompt}`
      )
      .join('\n\n');
    handleCopy(prompts, 'all_prompts');
  };

  const handleCopyAllVoiceovers = () => {
    if (!videoMakerState.blueprint) return;
    const voiceovers = videoMakerState.blueprint.scenes
      .map(
        (s) =>
          `[Scene ${s.sceneNumber} (${s.duration || s.timeRange}) - ${s.sceneTitle}]:\n${s.voiceover || s.voiceoverScript}`
      )
      .join('\n\n');
    handleCopy(voiceovers, 'all_voiceovers');
  };

  const handleCopyAllCaptions = () => {
    if (!videoMakerState.blueprint) return;
    const captions = videoMakerState.blueprint.scenes
      .map((s) => `Scene ${s.sceneNumber} (${s.timeRange}): "${s.caption || s.onScreenText}"`)
      .join('\n');
    handleCopy(captions, 'all_captions');
  };

  const handleCopyCompleteVideoPackage = () => {
    if (!videoMakerState.blueprint) return;
    const bp = videoMakerState.blueprint;
    const settings = bp.videoSettings || {
      aspectRatio: bp.aspectRatio || '9:16 (Vertical)',
      resolution: bp.resolution || '1080 × 1920 (Full HD)',
      recommendedDuration: bp.targetDuration || '45 – 60 Seconds',
      captionStyle: bp.captionStyle || 'Bold Neon Yellow & White with Black Stroke / Drop Shadow (1-3 words per burst)',
      hookInFirstSeconds: bp.hookStrategy || 'High-energy curiosity hook in first 2-3 seconds to prevent swipe-away',
    };

    const lines = [
      `============================================================`,
      `🎬 100% FREE AI VIDEO PRODUCTION PACKAGE (9:16 SHORT/REEL)`,
      `============================================================`,
      `📌 Video Title: ${bp.videoTitle}`,
      ``,
      `📐 VIDEO SETTINGS:`,
      `- Aspect Ratio: ${settings.aspectRatio}`,
      `- Resolution: ${settings.resolution}`,
      `- Recommended Duration: ${settings.recommendedDuration}`,
      `- Caption Style: ${settings.captionStyle}`,
      `- Hook in First 2–3 Seconds: ${settings.hookInFirstSeconds}`,
      ``,
      `🎵 BACKGROUND MUSIC GUIDE:`,
      `- Genre: ${bp.bgMusicSuggestion.genre}`,
      `- Mood & Vibe: ${bp.bgMusicSuggestion.mood}`,
      `- Tempo / BPM: ${bp.bgMusicSuggestion.tempo}`,
      `- Free Search Keywords: "${bp.bgMusicSuggestion.freeSearchKeywords}" (Search in YouTube Audio Library / Pixabay)`,
      ``,
      `🛠️ FREE TOOLS से VIDEO कैसे बनाएं (STEP-BY-STEP WORKFLOW):`,
      `1. Generate images using a free image-generation option (Bing Image Creator / Leonardo.ai / Canva AI)`,
      `2. Download/save images in 9:16 high resolution`,
      `3. Add images to CapCut or Canva (Canvas size: 1080x1920, 9:16)`,
      `4. Add generated voiceover (Use built-in TTS audio or record your voice over the clips)`,
      `5. Add captions (Use auto-caption in CapCut or paste on-screen captions)`,
      `6. Add transitions (Apply suggested transitions like Whip Pan, Zoom Glitch, Cross Dissolve)`,
      `7. Export in 1080x1920 / 9:16 (60 FPS for maximum sharpness on YouTube Shorts and Reels)`,
      ``,
      `================ SCENE-BY-SCENE STORYBOARD (${bp.scenes.length} SCENES) ================`
    ];

    bp.scenes.forEach((scene) => {
      lines.push(
        `\n[SCENE ${scene.sceneNumber}: ${scene.sceneTitle}]`,
        `⏱️ Duration: ${scene.duration || '8s'} (Time: ${scene.timeRange})`,
        `📹 Visual Action: ${scene.visualDescription}`,
        `🎨 Free AI Image Prompt (Bing/Leonardo/Canva):`,
        scene.imagePrompt,
        `💬 On-Screen Caption: "${scene.caption || scene.onScreenText}"`,
        `🎙️ Voiceover Narration: "${scene.voiceover || scene.voiceoverScript}"`,
        `🔀 Transition Suggestion: ${scene.transition || 'Smooth Cross Dissolve'}`,
        scene.bgmCue ? `🎵 Music Cue: ${scene.bgmCue}` : ''
      );
    });

    lines.push(
      ``,
      `================ ASSEMBLY INSTRUCTIONS ================`,
      ...bp.assemblyInstructions.map((ins, i) => `${i + 1}. ${ins}`),
      `\n🛠️ Recommended Free Tools:`,
      ...bp.recommendedFreeTools.map((t) => `- ${t}`)
    );

    handleCopy(lines.join('\n'), 'complete_package');
  };

  const handleDownloadPackage = () => {
    if (!videoMakerState.blueprint) return;
    const bp = videoMakerState.blueprint;
    const settings = bp.videoSettings || {
      aspectRatio: bp.aspectRatio || '9:16',
      resolution: bp.resolution || '1080 × 1920',
      recommendedDuration: bp.targetDuration || '45 – 60 Seconds',
      captionStyle: bp.captionStyle || 'Bold Neon Yellow & White (1-3 words/burst)',
      hookInFirstSeconds: bp.hookStrategy || 'High-energy hook in first 2-3 seconds',
    };

    const lines = [
      `============================================================`,
      `🎬 100% FREE AI VIDEO PRODUCTION PACKAGE (9:16 SHORT/REEL)`,
      `============================================================`,
      `📌 Video Title: ${bp.videoTitle}`,
      ``,
      `📐 VIDEO SETTINGS:`,
      `- Aspect Ratio: ${settings.aspectRatio}`,
      `- Resolution: ${settings.resolution}`,
      `- Recommended Duration: ${settings.recommendedDuration}`,
      `- Caption Style: ${settings.captionStyle}`,
      `- Hook in First 2–3 Seconds: ${settings.hookInFirstSeconds}`,
      ``,
      `🎵 BACKGROUND MUSIC GUIDE:`,
      `- Genre: ${bp.bgMusicSuggestion.genre}`,
      `- Mood & Vibe: ${bp.bgMusicSuggestion.mood}`,
      `- Tempo / BPM: ${bp.bgMusicSuggestion.tempo}`,
      `- Free Search Keywords: "${bp.bgMusicSuggestion.freeSearchKeywords}"`,
      ``,
      `🛠️ FREE TOOLS से VIDEO कैसे बनाएं (WORKFLOW):`,
      `1. Generate images using a free image-generation option (Bing Image Creator / Leonardo.ai / Canva AI)`,
      `2. Download/save images in 9:16 high resolution`,
      `3. Add images to CapCut or Canva (Canvas size: 1080x1920)`,
      `4. Add generated voiceover`,
      `5. Add captions`,
      `6. Add transitions`,
      `7. Export in 1080x1920 / 9:16 (60 FPS)`,
      ``,
      `================ SCENE-BY-SCENE STORYBOARD (${bp.scenes.length} SCENES) ================`
    ];

    bp.scenes.forEach((scene) => {
      lines.push(
        `\n[SCENE ${scene.sceneNumber}: ${scene.sceneTitle}]`,
        `⏱️ Duration: ${scene.duration || '8s'} (Time: ${scene.timeRange})`,
        `📹 Visual Action: ${scene.visualDescription}`,
        `🎨 AI Image Prompt:`,
        scene.imagePrompt,
        `💬 On-Screen Caption: "${scene.caption || scene.onScreenText}"`,
        `🎙️ Voiceover: "${scene.voiceover || scene.voiceoverScript}"`,
        `🔀 Transition: ${scene.transition || 'Smooth Cross Dissolve'}`,
        scene.bgmCue ? `🎵 Music Cue: ${scene.bgmCue}` : ''
      );
    });

    const fileContent = lines.join('\n');
    try {
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (bp.videoTitle || 'video_plan').replace(/[^a-zA-Z0-9_\-\u0900-\u097F]/g, '_').slice(0, 35);
      link.download = `${safeTitle}-production-package.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      handleCopy(fileContent, 'download_package');
    } catch {
      handleCopy(fileContent, 'download_package');
    }
  };

  const handleRegenerateScene = async (sceneNumber: number) => {
    if (!videoMakerState.blueprint) return;
    const currentScene = videoMakerState.blueprint.scenes.find((s) => s.sceneNumber === sceneNumber);

    setVideoMakerState((prev) => ({
      ...prev,
      regeneratingSceneNumber: sceneNumber,
    }));

    try {
      const res = await safeFetchJson<{
        success: boolean;
        scene?: VideoStoryboardScene;
        error?: string;
      }>('/api/ai/regenerate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneNumber,
          topic: result?.topic || videoMakerState.blueprint.videoTitle,
          videoTitle: videoMakerState.blueprint.videoTitle,
          language: result?.language || 'Hindi',
          sceneTitle: currentScene?.sceneTitle,
          duration: currentScene?.duration,
        }),
      });

      if (res.ok && res.data?.scene) {
        const updatedScene = res.data.scene;
        setVideoMakerState((prev) => {
          if (!prev.blueprint) return prev;
          const newScenes = prev.blueprint.scenes.map((s) =>
            s.sceneNumber === sceneNumber ? updatedScene : s
          );
          return {
            ...prev,
            blueprint: {
              ...prev.blueprint,
              scenes: newScenes,
            },
            regeneratingSceneNumber: null,
          };
        });
        setCopiedKey(`regenerated_${sceneNumber}`);
        setTimeout(() => setCopiedKey(null), 2500);
      } else {
        const fallbackScene = generateClientFallbackScene(
          sceneNumber,
          result?.topic || videoMakerState.blueprint.videoTitle,
          result?.language || 'Hindi',
          currentScene?.sceneTitle
        );
        setVideoMakerState((prev) => {
          if (!prev.blueprint) return prev;
          const newScenes = prev.blueprint.scenes.map((s) =>
            s.sceneNumber === sceneNumber ? fallbackScene : s
          );
          return {
            ...prev,
            blueprint: {
              ...prev.blueprint,
              scenes: newScenes,
            },
            regeneratingSceneNumber: null,
          };
        });
        setCopiedKey(`regenerated_${sceneNumber}`);
        setTimeout(() => setCopiedKey(null), 2500);
      }
    } catch (err) {
      console.warn('Failed to regenerate scene from API, using client fallback:', err);
      const fallbackScene = generateClientFallbackScene(
        sceneNumber,
        result?.topic || videoMakerState.blueprint.videoTitle,
        result?.language || 'Hindi',
        currentScene?.sceneTitle
      );
      setVideoMakerState((prev) => {
        if (!prev.blueprint) return prev;
        const newScenes = prev.blueprint.scenes.map((s) =>
          s.sceneNumber === sceneNumber ? fallbackScene : s
        );
        return {
          ...prev,
          blueprint: {
            ...prev.blueprint,
            scenes: newScenes,
          },
          regeneratingSceneNumber: null,
        };
      });
      setCopiedKey(`regenerated_${sceneNumber}`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };


  const currentTypeConfig = CONTENT_TYPES.find((t) => t.value === contentType) || CONTENT_TYPES[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="ai-content-generator-modal"
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#222] bg-[#0e0e0e]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#3b82f6] shadow-md shadow-[#3b82f6]/10">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Content Generator
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                  Viral Engine
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                YouTube, Reels, Facebook और Blogs के लिए टाइटल्स, स्क्रिप्ट, विवरण और प्रॉम्प्ट्स तैयार करें
              </p>
            </div>
          </div>
          <button
            id="close-content-generator-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#161616] hover:bg-[#262626] text-gray-400 hover:text-white border border-[#333] transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-gray-200">
          {/* Generator Form */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* 1. Content Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  {currentTypeConfig.icon}
                  <span>1. Content Type (कंटेंट का प्रकार)</span>
                </label>
                <div className="relative">
                  <select
                    id="content-type-select"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentTypeOption)}
                    className="w-full bg-[#121212] border border-[#2a2a2a] hover:border-[#3b82f6]/60 focus:border-[#3b82f6] rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer pr-10"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#121212] text-white py-1">
                        {t.label} ({t.badge})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* 2. Language Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>3. Language (भाषा)</span>
                </label>
                <div className="relative">
                  <select
                    id="content-language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as ContentLanguageOption)}
                    className="w-full bg-[#121212] border border-[#2a2a2a] hover:border-[#3b82f6]/60 focus:border-[#3b82f6] rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer pr-10"
                  >
                    <option value="Hindi" className="bg-[#121212] text-white">Hindi (शुद्ध व स्पष्ट हिंदी)</option>
                    <option value="Hinglish" className="bg-[#121212] text-white">Hinglish (रोमन हिंदी + इंग्लिश मिक्स)</option>
                    <option value="English" className="bg-[#121212] text-white">English (Global reach)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Generate Button (Desktop position) */}
              <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
                <button
                  type="submit"
                  id="generate-content-submit-btn"
                  disabled={isLoading}
                  className="w-full py-3 px-5 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] active:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#3b82f6]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>AI कंटेंट लिख रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>कंटेंट जनरेट करें (Generate)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Topic Input Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>2. Topic (विषय या कीवर्ड)</span>
                </label>
                {topic && (
                  <button
                    type="button"
                    onClick={() => {
                      setTopic('');
                      setError(null);
                    }}
                    className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    साफ़ करें (Clear)
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="content-topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error && e.target.value.trim().length > 0) {
                      setError(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="उदा. AI टूल्स से ₹50,000 कमाने के तरीके, Stock market basics, Freelancing guide..."
                  className="w-full bg-[#121212] border border-[#2a2a2a] hover:border-[#3b82f6]/60 focus:border-[#3b82f6] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Sample Topic Chips */}
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-gray-400 font-mono font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#f59e0b]" /> सुझाव:
                </span>
                {SAMPLE_TOPICS.map((sample, idx) => {
                  const isSelected = topic.trim() === sample.trim();
                  return (
                    <button
                      key={idx}
                      type="button"
                      id={`sample-topic-chip-${idx}`}
                      onClick={() => handleSelectTopic(sample)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border transition-all text-left flex items-center gap-1.5 cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/60 shadow-sm shadow-[#3b82f6]/20'
                          : 'bg-[#161616] hover:bg-[#222] text-gray-300 hover:text-white border-[#262626]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shrink-0" />
                      <span>{sample}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300">त्रुटि (Error):</p>
                <p className="text-xs text-rose-200/90 mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="mt-2 px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-xs rounded-lg font-medium transition-colors"
                >
                  पुनः प्रयास करें
                </button>
              </div>
            </div>
          )}

          {/* Loading Animation Placeholder */}
          {isLoading && (
            <div className="py-12 px-6 rounded-3xl bg-[#0e0e0e] border border-[#222] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#3b82f6] shadow-lg shadow-[#3b82f6]/20 animate-pulse">
                <Sparkles className="w-7 h-7 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">AI आपका संपूर्ण कंटेंट पैकेज तैयार कर रहा है...</h4>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  3 आकर्षक टाइटल्स, संपूर्ण स्क्रिप्ट, डिस्क्रिप्शन, हैशटैग्स और थंबनेल प्रॉम्प्ट जेनरेट हो रहे हैं
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Generated Content Output Section - 5 Separate Cards */}
          {!isLoading && result && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-1 border-b border-[#222]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10b981] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#10b981]" /> तैयार कंटेंट पैकेज
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#161616] text-gray-300 border border-[#333]">
                    {result.contentType} • {result.language}
                  </span>
                </div>
                <button
                  type="button"
                  id="copy-all-content-btn"
                  onClick={() => {
                    const allText = `=== 3 CATCHY TITLES ===\n${result.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n=== COMPLETE SCRIPT / CONTENT ===\n${result.script}\n\n=== DESCRIPTION ===\n${result.description}\n\n=== HASHTAGS ===\n${result.hashtags.join(' ')}\n\n=== THUMBNAIL / CREATIVE PROMPT ===\n${result.thumbnailPrompt}`;
                    handleCopy(allText, 'all');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-xs text-gray-200 font-semibold border border-[#333] hover:border-[#3b82f6] transition-colors flex items-center gap-1.5"
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#10b981]">सब कुछ कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>सम्पूर्ण पैकेज कॉपी करें</span>
                    </>
                  )}
                </button>
              </div>

              {/* CARD 1: 3 Catchy Titles */}
              <div 
                id="content-card-titles"
                className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#262626] hover:border-[#3b82f6]/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6]">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">1. 3 Catchy Titles (आकर्षक टाइटल्स)</h4>
                      <p className="text-[11px] text-gray-400 font-mono">High CTR & Viral Hooks</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="copy-titles-btn"
                    onClick={() => handleCopy(result.titles.join('\n'), 'titles')}
                    className="p-2 rounded-xl bg-[#161616] hover:bg-[#222] text-xs text-gray-300 border border-[#333] hover:border-[#3b82f6] transition-colors flex items-center gap-1.5"
                    title="सभी टाइटल्स कॉपी करें"
                  >
                    {copiedKey === 'titles' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-[#10b981] font-mono text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-[11px] hidden xs:inline">Copy Titles</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {result.titles.map((title, idx) => (
                    <div
                      key={idx}
                      id={`title-item-${idx}`}
                      className="p-3 rounded-2xl bg-[#050505] border border-[#222] flex items-center justify-between gap-3 text-xs sm:text-sm text-gray-200 hover:border-[#333] transition-colors"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white break-words">{title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(title, `title_${idx}`)}
                        className="p-1.5 rounded-lg bg-[#161616] hover:bg-[#262626] text-gray-400 hover:text-white shrink-0 transition-colors"
                        title="यह टाइटल कॉपी करें"
                      >
                        {copiedKey === `title_${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: Complete Content / Script */}
              <div 
                id="content-card-script"
                className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#262626] hover:border-[#10b981]/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#10b981]/20 text-[#10b981]">
                      <AlignLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">2. Complete Script / Content (सम्पूर्ण स्क्रिप्ट / सामग्री)</h4>
                      <p className="text-[11px] text-gray-400 font-mono">Hook, Visual Directions, Core Body & Call-to-Action</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="copy-script-btn"
                    onClick={() => handleCopy(result.script, 'script')}
                    className="p-2 rounded-xl bg-[#161616] hover:bg-[#222] text-xs text-gray-300 border border-[#333] hover:border-[#10b981] transition-colors flex items-center gap-1.5"
                    title="पूरी स्क्रिप्ट कॉपी करें"
                  >
                    {copiedKey === 'script' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-[#10b981] font-mono text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-[11px] hidden xs:inline">Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#050505] border border-[#222] max-h-[360px] overflow-y-auto text-xs sm:text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed space-y-2">
                  {result.script}
                </div>
              </div>

              {/* CARD 3: Short Description */}
              <div 
                id="content-card-description"
                className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#262626] hover:border-[#f59e0b]/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">3. Short Description (संक्षिप्त विवरण)</h4>
                      <p className="text-[11px] text-gray-400 font-mono">Algorithm & Search Optimized</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="copy-description-btn"
                    onClick={() => handleCopy(result.description, 'description')}
                    className="p-2 rounded-xl bg-[#161616] hover:bg-[#222] text-xs text-gray-300 border border-[#333] hover:border-[#f59e0b] transition-colors flex items-center gap-1.5"
                    title="डिस्क्रिप्शन कॉपी करें"
                  >
                    {copiedKey === 'description' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-[#10b981] font-mono text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-[11px] hidden xs:inline">Copy Description</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#222] text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {result.description}
                </div>
              </div>

              {/* CARD 4: Hashtags */}
              <div 
                id="content-card-hashtags"
                className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#262626] hover:border-[#a855f7]/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#a855f7]/20 text-[#a855f7]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">4. Hashtags (ट्रेंडिंग हैशटैग्स)</h4>
                      <p className="text-[11px] text-gray-400 font-mono">{result.hashtags.length} Tags for Viral Discovery</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="copy-hashtags-btn"
                    onClick={() => handleCopy(result.hashtags.join(' '), 'hashtags')}
                    className="p-2 rounded-xl bg-[#161616] hover:bg-[#222] text-xs text-gray-300 border border-[#333] hover:border-[#a855f7] transition-colors flex items-center gap-1.5"
                    title="सभी हैशटैग्स कॉपी करें"
                  >
                    {copiedKey === 'hashtags' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-[#10b981] font-mono text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-[11px] hidden xs:inline">Copy All Tags</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#222] flex flex-wrap gap-2">
                  {result.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      id={`hashtag-item-${idx}`}
                      onClick={() => handleCopy(tag, `tag_${idx}`)}
                      className="px-2.5 py-1 rounded-xl bg-[#161616] hover:bg-[#202020] text-[#a855f7] border border-[#a855f7]/30 text-xs font-mono font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                      title="क्लिक करके यह टैग कॉपी करें"
                    >
                      {tag}
                      {copiedKey === `tag_${idx}` && <Check className="w-3 h-3 text-[#10b981]" />}
                    </span>
                  ))}
                </div>
              </div>

              {/* CARD 5: Thumbnail / Creative Prompt */}
              <div 
                id="content-card-thumbnail"
                className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#262626] hover:border-[#06b6d4]/40 transition-all space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#06b6d4]/20 text-[#06b6d4]">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">5. Thumbnail & Creative Visuals (थंबनेल व इमेज प्रॉम्प्ट)</h4>
                      <p className="text-[11px] text-gray-400 font-mono">16:9 Split-Screen YouTube & Reel Thumbnail</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={sampleSplitThumbnail}
                      download="viral_earning_split_thumbnail.jpg"
                      id="download-generated-thumbnail-btn"
                      className="px-3 py-1.5 rounded-xl bg-[#141419] hover:bg-[#202028] text-xs font-semibold text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="थंबनेल इमेज डाउनलोड करें"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono text-[11px]">Download Image</span>
                    </a>
                    <button
                      type="button"
                      id="copy-thumbnail-prompt-btn"
                      onClick={() => handleCopy(result.thumbnailPrompt, 'thumbnail')}
                      className="p-2 rounded-xl bg-[#161616] hover:bg-[#222] text-xs text-gray-300 border border-[#333] hover:border-[#06b6d4] transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="इमेज प्रॉम्प्ट कॉपी करें"
                    >
                      {copiedKey === 'thumbnail' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#10b981]" />
                          <span className="text-[#10b981] font-mono text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono text-[11px] hidden xs:inline">Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Generated High Quality Thumbnail Preview */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#07070a] shadow-lg group">
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                    <img
                      src={sampleSplitThumbnail}
                      alt="Vibrant split-screen YouTube thumbnail: frustrated person vs confident earner with ₹50,000/Month overlay"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 backdrop-blur-md text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/40">
                        16:9 Split-Screen Thumbnail
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 text-[10px] font-mono border border-amber-500/40">
                        ₹50,000/Month Concept
                      </span>
                    </div>

                    {/* Bottom action bar inside preview */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-300 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Ultra-realistic split: Struggle vs AI Earning</span>
                      </div>
                      <a
                        href={sampleSplitThumbnail}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-cyan-300 hover:text-white text-[11px] font-mono flex items-center gap-1 border border-white/20 backdrop-blur-sm transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Full Size</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Prompt Text Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>GENERATION PROMPT (Bing / Leonardo / Midjourney / Canva):</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#222] text-xs sm:text-sm text-cyan-200/90 font-mono leading-relaxed bg-cyan-950/10">
                    {result.thumbnailPrompt}
                  </div>
                </div>
              </div>

              {/* CARD 6: FREE AI VIDEO MAKER */}
              <div
                id="content-card-free-video-maker"
                className="p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#111116] to-[#0a0a0c] border border-emerald-500/30 hover:border-emerald-500/60 transition-all space-y-4 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Clapperboard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          6. FREE AI VIDEO MAKER
                        </h4>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Sparkle className="w-2.5 h-2.5" /> Free workflow • No paid video API
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          9:16 Shorts & Reels
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono">
                        सीन-दर-सीन स्टोरीबोर्ड, AI इमेज प्रॉम्प्ट, वॉयसओवर, कैप्शन व ट्रांजिशन (Zero Cost)
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#18181b] text-emerald-400 border border-emerald-500/20">
                    Free workflow • No paid video API
                  </span>
                </div>

                {/* Main Action Trigger / Idle state */}
                {videoMakerState.status === 'idle' && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0c1611] via-[#09120e] to-[#060a08] border border-emerald-500/50 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
                      <div className="text-xs text-gray-300 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                            ⚡ LIVE IN-APP VIDEO ENGINE
                          </span>
                          <span className="text-[11px] text-amber-300 font-mono font-bold">
                            0 Cost • Local Browser Render
                          </span>
                          <span className="text-[11px] text-cyan-300 font-mono">
                            HD MP4/WebM Exporter
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                          <Film className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>यहीं से सीधे वीडियो बनाएं, चलाएं और डाउनलोड करें!</span>
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                          किसी बाहरी वेबसाइट पर जाने की आवश्यकता नहीं। एक क्लिक में AI स्क्रिप्ट से 9:16 विजुअल्स, काइनेटिक टेक्स्ट (CapCut स्टाइल), वॉयसओवर और बैकग्राउंड म्यूजिक जोड़कर यहीं वीडियो प्लेयर में चलाएं और सीधे डाउनलोड करें।
                        </p>
                      </div>

                      <button
                        type="button"
                        id="generate-inapp-video-btn"
                        onClick={handleGenerateFreeVideoPlan}
                        className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                      >
                        <Play className="w-5 h-5 fill-black" />
                        <span>🎬 यहीं AI वीडियो बनाएं (Create Video Here)</span>
                      </button>
                    </div>

                    <div className="pt-2">
                      <FreeVideoToolsDirectory
                        currentPromptToCopy={result.thumbnailPrompt || result.topic}
                      />
                    </div>
                  </div>
                )}

                {/* Loading / Generating State */}
                {videoMakerState.status === 'generating' && (
                  <div className="p-5 rounded-2xl bg-[#08080a] border border-emerald-500/40 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white">
                            FREE AI Video Blueprint जनरेट हो रहा है...
                          </h5>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            9:16 Storyboard
                          </span>
                        </div>
                        <p className="text-xs text-emerald-300 font-mono mt-0.5 truncate">
                          Gemini AI सीन-दर-सीन इमेज प्रॉम्प्ट्स, अवधि, कैप्शन, ट्रांजिशन व वॉयसओवर तैयार कर रहा है...
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-[#161616] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 h-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
                    </div>

                    <p className="text-[11px] text-gray-400 font-mono text-center">
                      कृपया प्रतीक्षा करें। फ्री वीडियो स्टोरीबोर्ड कुछ ही सेकंड में तैयार हो रहा है...
                    </p>
                  </div>
                )}

                {/* Ready / Storyboard Blueprint Display */}
                {videoMakerState.status === 'ready' && videoMakerState.blueprint && (
                  <div className="space-y-4 pt-1">
                    {/* Video Header Overview */}
                    <div className="p-4 rounded-2xl bg-[#0d0d11] border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                            Free Production Blueprint Ready
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                            100% Free Workflow • No Paid API
                          </span>
                        </div>
                        <h5 className="text-sm sm:text-base font-bold text-white">
                          {videoMakerState.blueprint.videoTitle}
                        </h5>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#18181b] text-amber-300 text-[11px] font-mono border border-[#27272a]">
                            ⏱️ {videoMakerState.blueprint.targetDuration}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#18181b] text-cyan-300 text-[11px] font-mono border border-[#27272a]">
                            📐 {videoMakerState.blueprint.aspectRatio}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#18181b] text-emerald-300 text-[11px] font-mono border border-[#27272a]">
                            🎬 {videoMakerState.blueprint.scenes.length} Scenes
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          id="copy-complete-package-btn"
                          onClick={handleCopyCompleteVideoPackage}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 border border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
                          title="पूरा वीडियो प्रोडक्शन पैकेज कॉपी करें"
                        >
                          {copiedKey === 'complete_package' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span className="font-mono">Copied Package!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="font-mono">Copy Complete Video Package</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          id="download-package-txt-btn"
                          onClick={handleDownloadPackage}
                          className="px-3 py-2 rounded-xl bg-[#17171d] hover:bg-[#23232c] text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/40 hover:border-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="पैकेज टेक्स्ट फाइल डाउनलोड करें"
                        >
                          {copiedKey === 'download_package' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-mono text-emerald-400">Exported!</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="font-mono">Export Package (.txt)</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          id="play-all-voiceover-btn"
                          onClick={handlePlayFullVoiceover}
                          className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="सभी सीन्स का वॉयसओवर सुनें"
                        >
                          {isTtsPlaying && activeTtsScene === 999 ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-blue-300" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                              <span>🔊 Play Full Voiceover</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          id="regenerate-free-video-btn"
                          onClick={handleGenerateFreeVideoPlan}
                          className="p-2 rounded-xl bg-[#161616] hover:bg-[#222] text-gray-300 hover:text-white border border-[#333] transition-colors cursor-pointer"
                          title="पूरा वीडियो प्लान दोबारा जनरेट करें"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mode Navigation Tabs */}
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#09090e] border border-[#20202a]">
                      <button
                        type="button"
                        id="tab-inapp-video-studio-btn"
                        onClick={() => setVideoStudioTab('studio')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          videoStudioTab === 'studio'
                            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                            : 'text-gray-400 hover:text-white hover:bg-[#15151e]'
                        }`}
                      >
                        <Film className="w-4 h-4 text-emerald-300" />
                        <span>🎬 लाइव वीडियो स्टूडियो (Play & Export Video)</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                          DIRECT
                        </span>
                      </button>

                      <button
                        type="button"
                        id="tab-storyboard-specs-btn"
                        onClick={() => setVideoStudioTab('storyboard')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          videoStudioTab === 'storyboard'
                            ? 'bg-[#181824] text-white border border-[#343448]'
                            : 'text-gray-400 hover:text-white hover:bg-[#15151e]'
                        }`}
                      >
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span>📋 स्टोरीबोर्ड व प्रॉम्प्ट्स</span>
                      </button>

                      <button
                        type="button"
                        id="tab-external-tools-btn"
                        onClick={() => setVideoStudioTab('tools')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          videoStudioTab === 'tools'
                            ? 'bg-[#181824] text-white border border-[#343448]'
                            : 'text-gray-400 hover:text-white hover:bg-[#15151e]'
                        }`}
                      >
                        <Globe2 className="w-4 h-4 text-cyan-400" />
                        <span>🌐 मुफ़्त टूल्स</span>
                      </button>
                    </div>

                    {/* Active Video Topic Indicator Bar */}
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-[#111118] border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-gray-400">वीडियो का वर्तमान विषय (Matched Topic):</div>
                          <div className="text-xs sm:text-sm font-bold text-white truncate">
                            {result?.topic || topic || 'AI Shorts'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (result) {
                            const newBp = generateClientFallbackVideoBlueprint(
                              result.topic,
                              result.contentType,
                              result.language,
                              result.script,
                              result.thumbnailPrompt
                            );
                            setVideoMakerState({ status: 'ready', blueprint: newBp });
                          }
                        }}
                        className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>विषय रीफ्रेश करें</span>
                      </button>
                    </div>

                    {/* VIEW 1: In-App Direct Video Studio Player & Exporter */}
                    {videoStudioTab === 'studio' && (
                      <InAppVideoStudio
                        blueprint={videoMakerState.blueprint}
                        topic={result?.topic || topic}
                      />
                    )}

                    {/* VIEW 2: Storyboard Specs & Assembly Instructions */}
                    {videoStudioTab === 'storyboard' && (
                      <div className="space-y-4">
                        {/* Quick "Copy All" Bar */}
                        <div className="p-3 rounded-2xl bg-[#09090d] border border-[#222] flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
                            <Copy className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Quick Copy Actions:</span>
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              id="copy-all-scenes-btn"
                              onClick={handleCopyAllScenes}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f26] text-emerald-300 text-[11px] font-mono border border-emerald-500/30 hover:border-emerald-500 flex items-center gap-1 cursor-pointer transition-colors"
                              title="सभी सीन्स कॉपी करें"
                            >
                              {copiedKey === 'all_scenes' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied All Scenes</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-emerald-400" />
                                  <span>Copy All Scenes</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              id="copy-all-voiceovers-btn"
                              onClick={handleCopyAllVoiceovers}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f26] text-blue-300 text-[11px] font-mono border border-blue-500/30 hover:border-blue-500 flex items-center gap-1 cursor-pointer transition-colors"
                              title="सभी वॉयसओवर स्क्रिप्ट्स कॉपी करें"
                            >
                              {copiedKey === 'all_voiceovers' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied Voiceover</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-blue-400" />
                                  <span>Copy Voiceover</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              id="copy-all-prompts-btn"
                              onClick={handleCopyAllPrompts}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f26] text-cyan-300 text-[11px] font-mono border border-cyan-500/30 hover:border-cyan-500 flex items-center gap-1 cursor-pointer transition-colors"
                              title="सभी AI इमेज प्रॉम्प्ट्स कॉपी करें"
                            >
                              {copiedKey === 'all_prompts' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied Image Prompts</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-cyan-400" />
                                  <span>Copy Image Prompts</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              id="copy-all-captions-btn"
                              onClick={handleCopyAllCaptions}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f26] text-purple-300 text-[11px] font-mono border border-purple-500/30 hover:border-purple-500 flex items-center gap-1 cursor-pointer transition-colors"
                              title="सभी ऑन-स्क्रीन कैप्शन्स कॉपी करें"
                            >
                              {copiedKey === 'all_captions' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied Captions</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-purple-400" />
                                  <span>Copy Captions</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                    {/* VIDEO SETTINGS CARD */}
                    <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-blue-500/30 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                            <Sliders className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                              <span>VIDEO SETTINGS (शॉर्ट वीडियो सेटिंग्स)</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                9:16 Vertical
                              </span>
                            </h5>
                            <p className="text-[11px] text-gray-400 font-mono">
                              YouTube Shorts, Instagram Reels और TikTok के लिए अनुकूलित सेटिंग्स
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                        {/* Aspect Ratio */}
                        <div className="p-3 rounded-xl bg-[#111116] border border-[#23232a] space-y-1">
                          <span className="text-[10px] text-gray-400 font-mono block">📐 Aspect Ratio:</span>
                          <span className="font-bold text-cyan-300 text-sm block">9:16</span>
                          <span className="text-[10px] text-gray-400 font-mono">Vertical Format for Smartphones</span>
                        </div>

                        {/* Resolution */}
                        <div className="p-3 rounded-xl bg-[#111116] border border-[#23232a] space-y-1">
                          <span className="text-[10px] text-gray-400 font-mono block">🖥️ Resolution:</span>
                          <span className="font-bold text-emerald-300 text-sm block">1080 × 1920</span>
                          <span className="text-[10px] text-gray-400 font-mono">Full HD (60 FPS Export)</span>
                        </div>

                        {/* Recommended Duration */}
                        <div className="p-3 rounded-xl bg-[#111116] border border-[#23232a] space-y-1">
                          <span className="text-[10px] text-gray-400 font-mono block">⏱️ Recommended Duration:</span>
                          <span className="font-bold text-amber-300 text-sm block">
                            {videoMakerState.blueprint.targetDuration || '45 – 60 Seconds'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {videoMakerState.blueprint.scenes.length} Scenes (~8-10s per scene)
                          </span>
                        </div>

                        {/* Caption Style */}
                        <div className="p-3 rounded-xl bg-[#111116] border border-[#23232a] space-y-1 sm:col-span-2 lg:col-span-2">
                          <span className="text-[10px] text-gray-400 font-mono block">💬 Caption Style:</span>
                          <span className="font-bold text-purple-300 block">
                            Bold Neon Yellow & High-Contrast White with Black Stroke / Drop Shadow
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Center-screen 1–3 words per burst (Maximum mobile engagement)
                          </span>
                        </div>

                        {/* Hook in First 2-3 Seconds */}
                        <div className="p-3 rounded-xl bg-[#111116] border border-[#23232a] space-y-1 lg:col-span-1">
                          <span className="text-[10px] text-gray-400 font-mono block">⚡ Hook in First 2–3 Seconds:</span>
                          <span className="font-bold text-rose-300 block">
                            Fast Motion + High Curiosity Question
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Instant punchy visual & sound riser to stop swipe-away
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scene-by-Scene Storyboard Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span>Scene-by-Scene Storyboard ({videoMakerState.blueprint.scenes.length} सीन्स)</span>
                        </h5>
                        <span className="text-[11px] text-gray-400 font-mono">
                          Duration • Prompt • Caption • Voiceover • Transition
                        </span>
                      </div>

                      <div className="space-y-3">
                        {videoMakerState.blueprint.scenes.map((scene) => (
                          <div
                            key={scene.sceneNumber}
                            id={`storyboard-scene-${scene.sceneNumber}`}
                            className="p-3.5 sm:p-4 rounded-2xl bg-[#09090c] border border-[#26262a] hover:border-emerald-500/40 transition-all space-y-3"
                          >
                            {/* Scene Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1e1e24]">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                                  {scene.sceneNumber}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-gray-100">
                                  {scene.sceneTitle}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-[#161618] text-amber-300 font-mono text-[11px] border border-amber-500/20">
                                  ⏱️ {scene.timeRange}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 font-mono text-[11px] border border-emerald-500/30 font-bold">
                                  ⏳ {scene.duration || '8s'}
                                </span>

                                {/* Copy Scene Button */}
                                <button
                                  type="button"
                                  id={`copy-scene-btn-${scene.sceneNumber}`}
                                  onClick={() => handleCopySingleScene(scene)}
                                  className="px-2.5 py-1 rounded-lg bg-[#141418] hover:bg-[#202028] text-gray-300 hover:text-white border border-[#333] hover:border-emerald-500 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                                  title="यह पूरा सीन कॉपी करें"
                                >
                                  {copiedKey === `scene_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-emerald-400" />
                                      <span>Copy Scene</span>
                                    </>
                                  )}
                                </button>

                                {/* Regenerate Scene Button */}
                                <button
                                  type="button"
                                  id={`regenerate-scene-btn-${scene.sceneNumber}`}
                                  onClick={() => handleRegenerateScene(scene.sceneNumber)}
                                  disabled={videoMakerState.regeneratingSceneNumber === scene.sceneNumber}
                                  className="px-2.5 py-1 rounded-lg bg-[#141418] hover:bg-[#202028] text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  title="यह सीन दोबारा जनरेट करें"
                                >
                                  {videoMakerState.regeneratingSceneNumber === scene.sceneNumber ? (
                                    <>
                                      <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                                      <span>Regenerating...</span>
                                    </>
                                  ) : copiedKey === `regenerated_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Regenerated!</span>
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="w-3 h-3 text-amber-400" />
                                      <span>Regenerate Scene</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Visual Action */}
                            <div className="text-xs text-gray-300 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-blue-400 font-mono flex items-center gap-1">
                                📹 Visual Direction & Action:
                              </span>
                              <p className="text-gray-200 leading-relaxed pl-1">{scene.visualDescription}</p>
                            </div>

                            {/* AI Image Generator Prompt */}
                            <div className="p-3 rounded-xl bg-[#050507] border border-[#222] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono flex items-center gap-1">
                                  🎨 Free AI Image Prompt (Bing / Leonardo.ai / Canva AI):
                                </span>
                                <button
                                  type="button"
                                  id={`copy-scene-prompt-${scene.sceneNumber}`}
                                  onClick={() => handleCopy(scene.imagePrompt, `scene_prompt_${scene.sceneNumber}`)}
                                  className="px-2 py-1 rounded-lg bg-[#141417] hover:bg-[#202026] text-gray-300 hover:text-white border border-[#333] hover:border-cyan-500 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                                  title="यह इमेज प्रॉम्प्ट कॉपी करें"
                                >
                                  {copiedKey === `scene_prompt_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400 text-[10px]">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-cyan-400" />
                                      <span className="text-[10px]">Copy Prompt</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs font-mono text-cyan-200/90 leading-relaxed select-all">
                                {scene.imagePrompt}
                              </p>

                              {/* 1-Click Free Tool Openers with Auto-Copy */}
                              <div className="pt-2 border-t border-[#1a1a24] flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                                <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                  <span>🚀 मुफ़्त टूल में खोलें:</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(scene.imagePrompt);
                                    setCopiedKey(`kling_${scene.sceneNumber}`);
                                    window.open('https://klingai.com', '_blank', 'noopener,noreferrer');
                                    setTimeout(() => setCopiedKey(null), 2500);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-[#131318] hover:bg-[#1f1f28] text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                                  title="प्रॉम्प्ट कॉपी करें और Kling AI (66 फ्री क्रेडिट्स) खोलें"
                                >
                                  {copiedKey === `kling_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied! Kling</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Kling AI</span>
                                      <ExternalLink className="w-2.5 h-2.5 text-cyan-400" />
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(scene.imagePrompt);
                                    setCopiedKey(`hailuo_${scene.sceneNumber}`);
                                    window.open('https://hailuoai.video', '_blank', 'noopener,noreferrer');
                                    setTimeout(() => setCopiedKey(null), 2500);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-[#131318] hover:bg-[#1f1f28] text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                                  title="प्रॉम्प्ट कॉपी करें और Hailuo AI (No Watermark Free Video) खोलें"
                                >
                                  {copiedKey === `hailuo_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied! Hailuo</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Hailuo AI</span>
                                      <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(scene.imagePrompt);
                                    setCopiedKey(`luma_${scene.sceneNumber}`);
                                    window.open('https://lumalabs.ai/dream-machine', '_blank', 'noopener,noreferrer');
                                    setTimeout(() => setCopiedKey(null), 2500);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-[#131318] hover:bg-[#1f1f28] text-amber-300 hover:text-white border border-amber-500/30 hover:border-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                                  title="प्रॉम्प्ट कॉपी करें और Luma Dream Machine खोलें"
                                >
                                  {copiedKey === `luma_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied! Luma</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Luma AI</span>
                                      <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(scene.imagePrompt);
                                    setCopiedKey(`bing_${scene.sceneNumber}`);
                                    window.open('https://www.bing.com/create', '_blank', 'noopener,noreferrer');
                                    setTimeout(() => setCopiedKey(null), 2500);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-[#131318] hover:bg-[#1f1f28] text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                                  title="प्रॉम्प्ट कॉपी करें और Bing Image Creator (DALL-E 3) खोलें"
                                >
                                  {copiedKey === `bing_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied! Bing</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Bing DALL-E 3</span>
                                      <ExternalLink className="w-2.5 h-2.5 text-purple-400" />
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(scene.imagePrompt);
                                    setCopiedKey(`leonardo_${scene.sceneNumber}`);
                                    window.open('https://leonardo.ai', '_blank', 'noopener,noreferrer');
                                    setTimeout(() => setCopiedKey(null), 2500);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-[#131318] hover:bg-[#1f1f28] text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-400 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                                  title="प्रॉम्प्ट कॉपी करें और Leonardo.ai खोलें"
                                >
                                  {copiedKey === `leonardo_${scene.sceneNumber}` ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied! Leonardo</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Leonardo</span>
                                      <ExternalLink className="w-2.5 h-2.5 text-rose-400" />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Captions & Voiceover Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                              {/* On-Screen Text / Caption */}
                              <div className="p-2.5 rounded-xl bg-[#111114] border border-[#222] space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-purple-400 font-mono block">
                                    💬 On-Screen Caption:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(scene.caption || scene.onScreenText, `caption_${scene.sceneNumber}`)}
                                    className="text-[10px] text-gray-400 hover:text-purple-300 font-mono flex items-center gap-1"
                                    title="कैप्शन कॉपी करें"
                                  >
                                    {copiedKey === `caption_${scene.sceneNumber}` ? (
                                      <span className="text-emerald-400">Copied</span>
                                    ) : (
                                      <span>Copy</span>
                                    )}
                                  </button>
                                </div>
                                <p className="text-xs font-bold text-purple-200 font-sans">
                                  "{scene.caption || scene.onScreenText}"
                                </p>
                              </div>

                              {/* Voiceover Line with Audio Play button */}
                              <div className="p-2.5 rounded-xl bg-[#111114] border border-[#222] flex items-start justify-between gap-2">
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center justify-between pr-1">
                                    <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">
                                      🎙️ Voiceover Line:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(scene.voiceover || scene.voiceoverScript, `vo_${scene.sceneNumber}`)}
                                      className="text-[10px] text-gray-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                                      title="वॉयसओवर कॉपी करें"
                                    >
                                      {copiedKey === `vo_${scene.sceneNumber}` ? (
                                        <span className="text-emerald-400">Copied</span>
                                      ) : (
                                        <span>Copy</span>
                                      )}
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-200 leading-relaxed">
                                    {scene.voiceover || scene.voiceoverScript}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  id={`play-scene-voiceover-${scene.sceneNumber}`}
                                  onClick={() => handlePlayVoiceover(scene.voiceover || scene.voiceoverScript, scene.sceneNumber)}
                                  className="p-2 rounded-xl bg-[#18181d] hover:bg-[#24242d] text-gray-300 hover:text-white border border-[#333] hover:border-emerald-500 transition-colors shrink-0"
                                  title="यह डायलॉग सुनें"
                                >
                                  {isTtsPlaying && activeTtsScene === scene.sceneNumber ? (
                                    <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Transition & Music details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#1e1e24] flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30 shrink-0">
                                    🔀 Transition
                                  </span>
                                  <span className="text-gray-300 font-medium truncate">
                                    {scene.transition || 'Smooth Cross Dissolve & Zoom'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#1e1e24] flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/30 shrink-0">
                                    🎵 Music Cue
                                  </span>
                                  <span className="text-gray-300 font-medium truncate">
                                    {scene.bgmCue || 'Subtle ambient riser (20% volume)'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FREE TOOLS से VIDEO कैसे बनाएं (7-STEP WORKFLOW) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#09090e] border border-emerald-500/40 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1e1e26]">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                              <span>FREE TOOLS से VIDEO कैसे बनाएं</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                                0 Cost Workflow
                              </span>
                            </h5>
                            <p className="text-xs text-gray-400 font-mono">
                              बिना किसी पेड टूल या सब्सक्रिप्शन के 3-5 मिनट में प्रोफेशनल 9:16 शॉर्ट वीडियो तैयार करें
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Step 1 */}
                        <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222a] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-cyan-500/30 mt-0.5">
                            1
                          </div>
                          <div className="space-y-1">
                            <h6 className="text-xs font-bold text-white">Generate images using a free image-generation option</h6>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                              ऊपर दिए गए हर सीन के <span className="text-cyan-300 font-mono font-semibold">AI Image Prompt</span> को कॉपी करें और <strong className="text-white">Bing Image Creator</strong> (Copilot Designer, 100% Free), <strong className="text-white">Leonardo.ai</strong> या <strong className="text-white">Canva AI</strong> में पेस्ट करें।
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222a] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-cyan-500/30 mt-0.5">
                            2
                          </div>
                          <div className="space-y-1">
                            <h6 className="text-xs font-bold text-white">Download / save images</h6>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                              जनरेट हुई इमेजेस को अपने फोन या कंप्यूटर में <strong className="text-white">High Quality (1080×1920, 9:16)</strong> में डाउनलोड व सेव करें।
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222a] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5">
                            3
                          </div>
                          <div className="space-y-1">
                            <h6 className="text-xs font-bold text-white">Add images to CapCut or Canva</h6>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                              <strong className="text-white">CapCut</strong>, <strong className="text-white">VN Video Editor</strong> या <strong className="text-white">Canva Video</strong> में नया प्रोजेक्ट बनाएं। कैनवास साइज <span className="text-emerald-300 font-mono">9:16 (1080x1920)</span> सेट करें और सभी इमेजेस को क्रम से टाइमलाइन पर रखें।
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222a] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5">
                            4
                          </div>
                          <div className="space-y-1">
                            <h6 className="text-xs font-bold text-white">Add generated voiceover</h6>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                              वॉयसओवर स्क्रिप्ट को अपने फोन के माइक से बोलकर रिकॉर्ड करें या CapCut के फ्री <strong className="text-white">Text-to-Speech</strong> टूल में पेस्ट करके नेचुरल आवाज जोड़ें।
                            </p>
                          </div>
                        </div>

                        {/* Step 5 */}
                        <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222a] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-purple-500/30 mt-0.5">
                            5
                          </div>
                          <div className="space-y-1">
                            <h6 className="text-xs font-bold text-white">Add captions</h6>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                              CapCut के <strong className="text-white">'Auto Captions'</strong> पर टैप करें या ऊपर दिए गए <span className="text-purple-300 font-mono">On-Screen Captions</span> पेस्ट करें। स्टाइल में बोल्ड येलो/व्हाइट फॉन्ट और ब्लैक शैडो चुनें (1-3 शब्द प्रति स्क्रीन)।
                            </p>
                          </div>
                        </div>

                        {/* Step 6 */}
                        <div className="p-3.5 rounded-xl bg-[#111116] border border-[#22222a] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-purple-500/30 mt-0.5">
                            6
                          </div>
                          <div className="space-y-1">
                            <h6 className="text-xs font-bold text-white">Add transitions</h6>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                              हर सीन के बीच बताए गए ट्रांजिशन्स (जैसे <span className="text-indigo-300 font-mono">Whip Pan, Zoom Glitch, Cross Dissolve</span>) लगाएं ताकि दर्शकों का ध्यान लगातार बना रहे।
                            </p>
                          </div>
                        </div>

                        {/* Step 7 */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/40 flex items-start gap-3 md:col-span-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-500/40 mt-0.5">
                            7
                          </div>
                          <div className="space-y-1 flex-1">
                            <h6 className="text-xs font-bold text-emerald-200">Export in 1080x1920 / 9:16</h6>
                            <p className="text-[11px] text-gray-200 leading-relaxed">
                              वीडियो को <strong className="text-white">1080p Full HD (60 FPS)</strong> पर एक्सपोर्ट करें। आपका 100% फ्री वायरल शॉर्ट्स/रील्स वीडियो अब YouTube Shorts और Instagram Reels पर अपलोड करने के लिए तैयार है!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BUTTON AFTER GENERATED SCENES: "🎬 FREE VIDEO बनाने की तैयारी करें" */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c0d12] via-[#090b10] to-[#0c0d12] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-emerald-400" />
                          <h5 className="text-xs sm:text-sm font-bold text-white">
                            Ready to Produce your 9:16 Video?
                          </h5>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                          इमेज प्रॉम्प्ट्स को Bing/Leonardo में डालें, वॉयसओवर रिकॉर्ड करें और CapCut/VN में 3 मिनट में वीडियो असेंबल करें।
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          id="after-scenes-prepare-video-btn"
                          onClick={handleGenerateFreeVideoPlan}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <Film className="w-4 h-4" />
                          <span>🎬 FREE VIDEO बनाने की तैयारी करें</span>
                        </button>
                      </div>
                    </div>

                    {/* Background Music Recommendation Card */}
                    <div className="p-4 rounded-2xl bg-[#0b0c10] border border-indigo-500/30 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <Music className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-white">
                              Background Music Recommendation (रॉयल्टी-फ्री संगीत)
                            </h5>
                            <p className="text-[11px] text-gray-400 font-mono">
                              YouTube Audio Library / Pixabay Free Audio
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          id="copy-bgm-search-btn"
                          onClick={() => handleCopy(videoMakerState.blueprint!.bgMusicSuggestion.freeSearchKeywords, 'bgm_search')}
                          className="px-2.5 py-1.5 rounded-xl bg-[#16161c] hover:bg-[#22222a] text-gray-300 hover:text-white border border-[#333] hover:border-indigo-400 text-[11px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="सर्च कीवर्ड्स कॉपी करें"
                        >
                          {copiedKey === 'bgm_search' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Keywords Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-indigo-400" />
                              <span>Copy BGM Search Term</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#222]">
                          <span className="text-[10px] text-gray-400 font-mono block">Genre:</span>
                          <span className="font-semibold text-indigo-200">
                            {videoMakerState.blueprint.bgMusicSuggestion.genre}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#222]">
                          <span className="text-[10px] text-gray-400 font-mono block">Mood & Vibe:</span>
                          <span className="font-semibold text-gray-200">
                            {videoMakerState.blueprint.bgMusicSuggestion.mood}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#222]">
                          <span className="text-[10px] text-gray-400 font-mono block">Tempo / BPM:</span>
                          <span className="font-semibold text-amber-300">
                            {videoMakerState.blueprint.bgMusicSuggestion.tempo}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#060608] border border-[#1e1e24] text-[11px] font-mono text-gray-300 flex items-center gap-2">
                        <span className="text-indigo-400 font-bold shrink-0">Free Search Term:</span>
                        <span className="text-indigo-200 italic truncate">"{videoMakerState.blueprint.bgMusicSuggestion.freeSearchKeywords}"</span>
                      </div>
                    </div>

                    {/* Step-by-Step Free Video Assembly Guide */}
                    <div className="p-4 rounded-2xl bg-[#09090c] border border-[#27272a] space-y-3">
                      <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <ListOrdered className="w-4 h-4 text-emerald-400" />
                        <span>3-Minute Free Video Creation Workflow (CapCut / InShot / VN)</span>
                      </h5>

                      <div className="space-y-2">
                        {videoMakerState.blueprint.assemblyInstructions.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-[#111114] border border-[#202024] flex items-start gap-2.5 text-xs text-gray-200"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recommended Free Tools */}
                      <div className="pt-2 border-t border-[#1e1e24] flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-gray-400 font-mono">Free Tools:</span>
                        {videoMakerState.blueprint.recommendedFreeTools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-[#161619] text-gray-300 text-[11px] font-mono border border-[#2a2a30]"
                          >
                            ✓ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                    {/* VIEW 3: Interactive Free Video Tools Directory */}
                    {videoStudioTab === 'tools' && (
                      <div className="pt-1">
                        <FreeVideoToolsDirectory
                          currentPromptToCopy={videoMakerState.blueprint.scenes[0]?.imagePrompt}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Error State */}
                {videoMakerState.status === 'error' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <h5 className="text-xs sm:text-sm font-bold text-red-200">
                          वीडियो प्लान जनरेट करने में समस्या
                        </h5>
                        <p className="text-xs text-red-300/90 leading-relaxed font-sans">
                          {videoMakerState.error}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleGenerateFreeVideoPlan}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>🔄 पुनः प्रयास करें</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoMakerState({ status: 'idle' })}
                        className="px-3.5 py-2 rounded-xl bg-[#161616] hover:bg-[#222] text-gray-300 text-xs font-semibold border border-[#333] transition-colors"
                      >
                        बंद करें (Dismiss)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Snippet if available */}
          {!isLoading && recentHistory.length > 1 && (
            <div className="pt-3 border-t border-[#222]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> हाल ही में जनरेट किए गए टॉपिक
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recentHistory.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setResult(item);
                      setTopic(item.topic);
                      setContentType(item.contentType);
                      setLanguage(item.language);
                    }}
                    className="p-2.5 rounded-xl bg-[#121212] hover:bg-[#1c1c1c] border border-[#262626] text-left shrink-0 max-w-[220px] transition-colors"
                  >
                    <span className="text-[10px] font-mono text-[#3b82f6] block">{item.contentType}</span>
                    <p className="text-xs font-medium text-gray-200 truncate mt-0.5">{item.topic}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#222] bg-[#0e0e0e]/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-400 font-mono">
            Powered by Gemini AI • Free workflow • No paid video API
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 text-xs font-semibold border border-[#333] transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
