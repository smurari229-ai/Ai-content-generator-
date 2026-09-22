export interface MonetizationMethod {
  id: string;
  title: string;
  tagline: string;
  category: 'Content' | 'Freelance' | 'SaaS' | 'Digital Products' | 'Automation' | 'Agency';
  earningPotential: string;
  timeToFirstRupee: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  investmentRequired: string;
  description: string;
  toolsNeeded: { name: string; isFree?: boolean; badge?: string }[];
  keySteps: string[];
  starterPrompt: string;
  googleTasks: {
    title: string;
    notes: string;
    dayOffset: number;
  }[];
  monetizationChannels?: string[];
  proTips?: string[];
}

export interface CustomRoadmapPlan {
  title: string;
  subtitle: string;
  overview: string;
  potentialEarnings: {
    month1: string;
    month3: string;
    month6: string;
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  recommendedTools: {
    name: string;
    purpose: string;
    isFree: boolean;
    linkSuggestion?: string;
  }[];
  roadmap: {
    phase: string;
    goals: string[];
    actionSteps: string[];
  }[];
  googleTasks: {
    title: string;
    notes: string;
    dayOffset: number;
  }[];
  monetizationChannels: string[];
  promptsToGetStarted: {
    label: string;
    promptText: string;
  }[];
  commonPitfallsToAvoid: string[];
  proTips: string[];
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  updated?: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

export interface GoogleUserProfile {
  email: string;
  name?: string;
  picture?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type ContentTypeOption =
  | 'YouTube Video'
  | 'YouTube Shorts'
  | 'Instagram Reel'
  | 'Facebook Post'
  | 'Blog Post';

export type ContentLanguageOption = 'Hindi' | 'Hinglish' | 'English';

export interface GeneratedContentResult {
  contentType: ContentTypeOption;
  topic: string;
  language: ContentLanguageOption;
  titles: string[];
  script: string;
  description: string;
  hashtags: string[];
  thumbnailPrompt: string;
  timestamp?: string;
}

export interface VideoStoryboardScene {
  sceneNumber: number;
  timeRange: string;
  duration: string;
  sceneTitle: string;
  visualDescription: string;
  imagePrompt: string;
  caption: string;
  onScreenText: string;
  voiceover: string;
  voiceoverScript: string;
  transition: string;
  bgmCue?: string;
}

export interface FreeVideoMakerBlueprint {
  videoTitle: string;
  targetDuration: string;
  aspectRatio: string;
  resolution?: string;
  captionStyle?: string;
  hookStrategy?: string;
  videoSettings?: {
    aspectRatio: string;
    resolution: string;
    recommendedDuration: string;
    captionStyle: string;
    hookInFirstSeconds: string;
  };
  bgMusicSuggestion: {
    genre: string;
    mood: string;
    tempo: string;
    freeSearchKeywords: string;
  };
  scenes: VideoStoryboardScene[];
  assemblyInstructions: string[];
  recommendedFreeTools: string[];
}

export interface FreeVideoMakerState {
  status: 'idle' | 'generating' | 'ready' | 'error';
  blueprint?: FreeVideoMakerBlueprint;
  error?: string;
  regeneratingSceneNumber?: number | null;
}

export interface FreeVideoTool {
  id: string;
  name: string;
  category: 'AI Video Gen' | 'Motion & Animation' | 'Talking Avatar' | 'Video Editor & Captions' | 'Image Keyframe';
  description: string;
  hindiDescription: string;
  freeTierDetails: string;
  url: string;
  badge?: string;
  rating?: string;
  features: string[];
  recommendedFor: string;
}

export type VideoBlueprint = FreeVideoMakerBlueprint;
export type VideoScene = VideoStoryboardScene;


