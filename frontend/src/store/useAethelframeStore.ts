import { create } from 'zustand';
import { getPublishedProjects, getPublishedJournalEntries, getPublishedServices } from '../lib/api';
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
  currentJournalTag: string | null;
  journalPagination: {
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  currentProjectTechStack: string | null;
  currentProjectTag: string | null;
  projectPagination: {
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
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
  fetchProjects: (tech_stack?: string, tag?: string, page?: number) => Promise<void>;
  setProjectTechStack: (tech_stack: string | null) => void;
  setProjectTag: (tag: string | null) => void;
  setProjectPage: (page: number) => void;
  fetchJournalEntries: (tag?: string, page?: number) => Promise<void>;
  setJournalTag: (tag: string | null) => void;
  setJournalPage: (page: number) => void;
  fetchServices: () => Promise<void>;
}

export const useAethelframeStore = create<AethelframeState>((set, get) => ({
  // Initial state - Seed/Veil phase
  currentPhase: localStorage.getItem('aethelframe_phase') as EmergencePhase || 'seed',
  activeCanvasId: localStorage.getItem('aethelframe_activeCanvas') as CanvasId || 'home',
  isOvertureVisible: localStorage.getItem('aethelframe_visited') !== 'true',
  isCuratorMenuOpen: false,

  // Initial Directus data
  projects: [],
  journalEntries: [],
  services: [],
  currentJournalTag: null,
  journalPagination: {
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    hasNext: false,
    hasPrevious: false,
  },
  currentProjectTechStack: null,
  currentProjectTag: null,
  projectPagination: {
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    hasNext: false,
    hasPrevious: false,
  },
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
  setPhase: (phase) => {
    localStorage.setItem('aethelframe_phase', phase);
    set({ currentPhase: phase });
  },

  setActiveCanvas: (id) => set((state) => {
    // Reset journal tag when navigating away from journal canvas
    const shouldResetJournalTag = state.activeCanvasId !== id && id !== 'journal';

    // Log the current and new canvas IDs
    console.log('setActiveCanvas called with id:', id);
    console.log('Current activeCanvasId:', state.activeCanvasId);
    console.log('Current phase:', state.currentPhase);

    // Store the active canvas ID in localStorage
    localStorage.setItem('aethelframe_activeCanvas', id);

    // When changing canvas in seed phase, transition to growth
    if (state.currentPhase === 'seed' && state.activeCanvasId !== id) {
      console.log('Transitioning from seed to growth phase');
      localStorage.setItem('aethelframe_phase', 'growth');
      return { 
        activeCanvasId: id, 
        currentPhase: 'growth',
        ...(shouldResetJournalTag ? { currentJournalTag: null } : {})
      };
    }

    // When in growth phase and user navigates to a second canvas, transition to bloom
    if (state.currentPhase === 'growth' && state.activeCanvasId !== id) {
      console.log('Transitioning from growth to bloom phase');
      localStorage.setItem('aethelframe_phase', 'bloom');
      return { 
        activeCanvasId: id, 
        currentPhase: 'bloom',
        ...(shouldResetJournalTag ? { currentJournalTag: null } : {})
      };
    }

    console.log('No phase transition, just updating activeCanvasId');
    return { 
      activeCanvasId: id,
      ...(shouldResetJournalTag ? { currentJournalTag: null } : {})
    };
  }),

  hideOverture: () => {
    console.log('hideOverture called');
    console.log('Setting aethelframe_visited to true');
    console.log('Setting aethelframe_phase to growth');

    localStorage.setItem('aethelframe_visited', 'true');
    localStorage.setItem('aethelframe_phase', 'growth');

    // Get the current activeCanvasId from localStorage to preserve it
    const storedCanvasId = localStorage.getItem('aethelframe_activeCanvas') as CanvasId;
    const canvasId = storedCanvasId || 'home';

    set({ 
      isOvertureVisible: false,
      currentPhase: 'growth',
      // Preserve the activeCanvasId
      activeCanvasId: canvasId
    });

    console.log('isOvertureVisible set to false');
    console.log('currentPhase set to growth');
    console.log('Preserving activeCanvasId as', canvasId);
  },

  toggleCuratorMenu: () => set((state) => ({ 
    isCuratorMenuOpen: !state.isCuratorMenuOpen 
  })),

  closeCuratorMenu: () => set({ isCuratorMenuOpen: false }),

  // Directus actions
  setProjectTechStack: (tech_stack) => {
    console.log('setProjectTechStack called with tech_stack:', tech_stack);
    console.log('Current tech_stack before update:', get().currentProjectTechStack);

    // Reset to page 1 when changing tech_stack
    set({ 
      currentProjectTechStack: tech_stack,
      projectPagination: {
        ...get().projectPagination,
        currentPage: 1
      }
    });

    console.log('Current tech_stack after update:', get().currentProjectTechStack);

    // Always fetch projects when setting a tech_stack, even if it's the same as the current tech_stack
    console.log('Fetching projects with tech_stack:', tech_stack);
    get().fetchProjects(tech_stack, get().currentProjectTag, 1); // Reset to page 1
  },

  setProjectTag: (tag) => {
    console.log('setProjectTag called with tag:', tag);
    console.log('Current tag before update:', get().currentProjectTag);

    // Reset to page 1 when changing tag
    set({ 
      currentProjectTag: tag,
      projectPagination: {
        ...get().projectPagination,
        currentPage: 1
      }
    });

    console.log('Current tag after update:', get().currentProjectTag);

    // Always fetch projects when setting a tag, even if it's the same as the current tag
    console.log('Fetching projects with tag:', tag);
    get().fetchProjects(get().currentProjectTechStack, tag, 1); // Reset to page 1
  },

  setProjectPage: (page) => {
    console.log('setProjectPage called with page:', page);
    set((state) => ({
      projectPagination: {
        ...state.projectPagination,
        currentPage: page
      }
    }));

    // Fetch projects for the new page
    get().fetchProjects(undefined, undefined, page);
  },

  fetchProjects: async (tech_stack, tag, page) => {
    set((state) => ({
      isLoading: { ...state.isLoading, projects: true },
      error: { ...state.error, projects: null }
    }));

    // Use the provided tech_stack/tag/page or the current tech_stack/tag/page from state
    const techStackToUse = tech_stack !== undefined ? tech_stack : get().currentProjectTechStack;
    const tagToUse = tag !== undefined ? tag : get().currentProjectTag;
    const pageToUse = page !== undefined ? page : get().projectPagination.currentPage;

    try {
      const response = await getPublishedProjects(techStackToUse || undefined, tagToUse || undefined, pageToUse);

      // Calculate total pages
      const totalPages = Math.ceil(response.count / 6); // 6 is the page size

      set({ 
        projects: response.results,
        projectPagination: {
          currentPage: pageToUse,
          totalPages,
          totalEntries: response.count,
          hasNext: response.next !== null,
          hasPrevious: response.previous !== null
        },
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

  setJournalTag: (tag) => {
    console.log('setJournalTag called with tag:', tag);
    console.log('Current tag before update:', get().currentJournalTag);

    // Reset to page 1 when changing tags
    set({ 
      currentJournalTag: tag,
      journalPagination: {
        ...get().journalPagination,
        currentPage: 1
      }
    });

    console.log('Current tag after update:', get().currentJournalTag);

    // Always fetch journal entries when setting a tag, even if it's the same as the current tag
    // This ensures that clicking "All Posts" always refreshes the entries
    console.log('Fetching journal entries with tag:', tag);
    get().fetchJournalEntries(tag, 1); // Reset to page 1
  },

  setJournalPage: (page) => {
    console.log('setJournalPage called with page:', page);
    set((state) => ({
      journalPagination: {
        ...state.journalPagination,
        currentPage: page
      }
    }));

    // Fetch journal entries for the new page
    get().fetchJournalEntries(undefined, page);
  },

  fetchJournalEntries: async (tag, page) => {
    set((state) => ({
      isLoading: { ...state.isLoading, journalEntries: true },
      error: { ...state.error, journalEntries: null }
    }));

    // Use the provided tag/page or the current tag/page from state
    const tagToUse = tag !== undefined ? tag : get().currentJournalTag;
    const pageToUse = page !== undefined ? page : get().journalPagination.currentPage;

    try {
      const response = await getPublishedJournalEntries(tagToUse || undefined, pageToUse);

      // Calculate total pages
      const totalPages = Math.ceil(response.count / 6); // 6 is the page size

      set({ 
        journalEntries: response.results,
        journalPagination: {
          currentPage: pageToUse,
          totalPages,
          totalEntries: response.count,
          hasNext: response.next !== null,
          hasPrevious: response.previous !== null
        },
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
