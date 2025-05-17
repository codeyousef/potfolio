import { create } from 'zustand';
import { getPublishedProjects, getPublishedJournalEntries, getPublishedServices } from '../lib/directus';
import type { DirectusProject, DirectusJournalEntry, DirectusService } from '../types/directus';

export type EmergencePhase = 'seed' | 'growth' | 'bloom';
export type CanvasId = 'home' | 'portfolio' | 'services' | 'journal' | 'contact';

interface AethelframeState {
  // Core state
  currentPhase: EmergencePhase;
  activeCanvasId: CanvasId;
  isOvertureVisible: boolean;
  isCuratorMenuOpen: boolean;
  
  // Directus data
  projects: DirectusProject[];
  journalEntries: DirectusJournalEntry[];
  services: DirectusService[];
  isLoading: {
    projects: boolean;
    journalEntries: boolean;
    services: boolean;
  };
  error: {
    projects: string | null;
    journalEntries: string | null;
    services: string | null;
  };
  
  // Actions
  setPhase: (phase: EmergencePhase) => void;
  setActiveCanvas: (id: CanvasId) => void;
  hideOverture: () => void;
  toggleCuratorMenu: () => void;
  closeCuratorMenu: () => void;
  
  // Directus actions
  fetchProjects: () => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
  fetchServices: () => Promise<void>;
}

export const useAethelframeStore = create<AethelframeState>((set, get) => ({
  // Initial state - Seed/Veil phase
  currentPhase: 'seed',
  activeCanvasId: 'home',
  isOvertureVisible: true,
  isCuratorMenuOpen: false,
  
  // Initial Directus data
  projects: [],
  journalEntries: [],
  services: [],
  isLoading: {
    projects: false,
    journalEntries: false,
    services: false,
  },
  error: {
    projects: null,
    journalEntries: null,
    services: null,
  },
  
  // Actions
  setPhase: (phase) => set({ currentPhase: phase }),
  
  setActiveCanvas: (id) => set((state) => {
    // When changing canvas in seed phase, transition to growth
    if (state.currentPhase === 'seed' && state.activeCanvasId !== id) {
      return { activeCanvasId: id, currentPhase: 'growth' };
    }
    
    // When in growth phase and user navigates to a second canvas, transition to bloom
    if (state.currentPhase === 'growth' && state.activeCanvasId !== id) {
      return { activeCanvasId: id, currentPhase: 'bloom' };
    }
    
    return { activeCanvasId: id };
  }),
  
  hideOverture: () => set({ 
    isOvertureVisible: false,
    currentPhase: 'growth' 
  }),
  
  toggleCuratorMenu: () => set((state) => ({ 
    isCuratorMenuOpen: !state.isCuratorMenuOpen 
  })),
  
  closeCuratorMenu: () => set({ isCuratorMenuOpen: false }),
  
  // Directus actions
  fetchProjects: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, projects: true },
      error: { ...state.error, projects: null }
    }));
    
    try {
      const projects = await getPublishedProjects();
      set({ 
        projects,
        isLoading: { ...get().isLoading, projects: false }
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ 
        error: { ...get().error, projects: 'Failed to load projects.' },
        isLoading: { ...get().isLoading, projects: false }
      });
    }
  },
  
  fetchJournalEntries: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, journalEntries: true },
      error: { ...state.error, journalEntries: null }
    }));
    
    try {
      const journalEntries = await getPublishedJournalEntries();
      set({ 
        journalEntries,
        isLoading: { ...get().isLoading, journalEntries: false }
      });
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      set({ 
        error: { ...get().error, journalEntries: 'Failed to load journal entries.' },
        isLoading: { ...get().isLoading, journalEntries: false }
      });
    }
  },
  
  fetchServices: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, services: true },
      error: { ...state.error, services: null }
    }));
    
    try {
      const services = await getPublishedServices();
      set({ 
        services,
        isLoading: { ...get().isLoading, services: false }
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      set({ 
        error: { ...get().error, services: 'Failed to load services.' },
        isLoading: { ...get().isLoading, services: false }
      });
    }
  },
}));