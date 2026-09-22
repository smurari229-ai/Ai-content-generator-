import { MonetizationMethod, CustomRoadmapPlan } from '../types';
import { INITIAL_MONETIZATION_METHODS } from '../data/monetizationCatalog';

const STORAGE_KEYS = {
  METHODS: 'ai_kamai_methods_v2',
  CUSTOM_PLAN: 'ai_kamai_custom_plan_v2',
  TASK_COMPLETIONS: 'ai_kamai_task_completions_v2',
  SAVED_FAVORITES: 'ai_kamai_favorites_v2',
  LAST_SEEN_METHOD_ID: 'ai_kamai_last_method_idx_v2',
};

export const storageService = {
  // Load Monetization Methods
  getMethods(): MonetizationMethod[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.METHODS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read methods from localStorage:', e);
    }
    return INITIAL_MONETIZATION_METHODS;
  },

  // Save Monetization Methods
  saveMethods(methods: MonetizationMethod[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.METHODS, JSON.stringify(methods));
    } catch (e) {
      console.warn('Could not save methods to localStorage:', e);
    }
  },

  // Add a newly generated or selected method if not duplicate
  addMethod(newMethod: MonetizationMethod): MonetizationMethod[] {
    const existing = this.getMethods();
    const isDuplicate = existing.some(
      (m) => m.id === newMethod.id || m.title.trim().toLowerCase() === newMethod.title.trim().toLowerCase()
    );
    if (!isDuplicate) {
      const updated = [newMethod, ...existing];
      this.saveMethods(updated);
      return updated;
    }
    return existing;
  },

  // Custom 30-day Roadmap Plan
  getCustomPlan(): CustomRoadmapPlan | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PLAN);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read custom plan from localStorage:', e);
    }
    return null;
  },

  saveCustomPlan(plan: CustomRoadmapPlan | null) {
    try {
      if (plan) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_PLAN, JSON.stringify(plan));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_PLAN);
      }
    } catch (e) {
      console.warn('Could not save custom plan to localStorage:', e);
    }
  },

  // Task completions map: { [taskIdentifierKey: string]: boolean }
  getTaskCompletions(): Record<string, boolean> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASK_COMPLETIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read task completions from localStorage:', e);
    }
    return {};
  },

  saveTaskCompletions(completions: Record<string, boolean>) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASK_COMPLETIONS, JSON.stringify(completions));
    } catch (e) {
      console.warn('Could not save task completions to localStorage:', e);
    }
  },

  toggleTaskCompletion(taskKey: string): { completions: Record<string, boolean>; isCompleted: boolean } {
    const current = this.getTaskCompletions();
    const newVal = !current[taskKey];
    const updated = {
      ...current,
      [taskKey]: newVal,
    };
    this.saveTaskCompletions(updated);
    return { completions: updated, isCompleted: newVal };
  },

  // Favorites / Saved methods
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_FAVORITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not read favorites:', e);
    }
    return [];
  },

  toggleFavorite(methodId: string): string[] {
    const favs = this.getFavorites();
    const exists = favs.includes(methodId);
    const updated = exists ? favs.filter((id) => id !== methodId) : [...favs, methodId];
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_FAVORITES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
    return updated;
  },

  // Generated Content History
  getGeneratedContentHistory(): any[] {
    try {
      const data = localStorage.getItem('ai_content_generator_history');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not read generated content history:', e);
    }
    return [];
  },

  saveGeneratedContentHistory(item: any) {
    try {
      const history = this.getGeneratedContentHistory();
      const updated = [item, ...history.filter((h: any) => h.topic !== item.topic)].slice(0, 10);
      localStorage.setItem('ai_content_generator_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save generated content history:', e);
    }
  },
};

