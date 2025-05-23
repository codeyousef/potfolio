import { create } from 'zustand'
import { getPublishedProjects, getPublishedJournalEntries, getPublishedServices } from '@lib/api'
import { Project, JournalEntry, Service, PaginationState } from '@types/models'

// Define the emergence phases and canvas IDs
export type EmergencePhase = 'seed' | 'growth' | 'bloom'
export type CanvasId = 'home' | 'portfolio' | 'services' | 'journal' | 'contact'

// Define the store state
interface AethelframeState {
  // Core state
  currentPhase: EmergencePhase
  activeCanvasId: CanvasId
  isOvertureVisible: boolean
  
  // Content state
  projects: Project[]
  journalEntries: JournalEntry[]
  services: Service[]
  
  // Pagination state
  projectsPagination: PaginationState
  journalPagination: PaginationState
  
  // Filter state
  activeProjectTechFilter: string | null
  activeProjectTagFilter: string | null
  activeProjectCategoryFilter: string | null
  activeJournalTagFilter: string | null
  
  // Actions
  setActiveCanvas: (id: CanvasId) => void
  hideOverture: () => void
  fetchProjects: (tech_stack?: string, tag?: string, category?: string, page?: number) => Promise<void>
  setProjectCategoryFilter: (category: string | null) => void
  fetchJournalEntries: (tag?: string, page?: number) => Promise<void>
  fetchServices: () => Promise<void>
  setProjectTechFilter: (tech: string | null) => void
  setProjectTagFilter: (tag: string | null) => void
  setJournalTagFilter: (tag: string | null) => void
}

// Create the store
export const useAethelframeStore = create<AethelframeState>((set, get) => ({
  // Initial state
  currentPhase: (localStorage.getItem('aethelframe_phase') as EmergencePhase) || 'seed',
  activeCanvasId: (localStorage.getItem('aethelframe_activeCanvas') as CanvasId) || 'home',
  isOvertureVisible: localStorage.getItem('aethelframe_visited') !== 'true',
  
  // Initial content
  projects: [],
  journalEntries: [],
  services: [],
  
  // Initial pagination
  projectsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  },
  journalPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  },
  
  // Initial filter state
  activeProjectTechFilter: null,
  activeProjectTagFilter: null,
  activeProjectCategoryFilter: null,
  activeJournalTagFilter: null,
  
  // Actions
  setActiveCanvas: (id) => set((state) => {
    // Store in localStorage
    localStorage.setItem('aethelframe_activeCanvas', id)
    
    // Phase transitions logic
    if (state.currentPhase === 'seed' && state.activeCanvasId !== id) {
      localStorage.setItem('aethelframe_phase', 'growth')
      return { activeCanvasId: id, currentPhase: 'growth' }
    }
    
    if (state.currentPhase === 'growth' && state.activeCanvasId !== id) {
      localStorage.setItem('aethelframe_phase', 'bloom')
      return { activeCanvasId: id, currentPhase: 'bloom' }
    }
    
    return { activeCanvasId: id }
  }),
  
  hideOverture: () => {
    localStorage.setItem('aethelframe_visited', 'true')
    localStorage.setItem('aethelframe_phase', 'growth')
    
    // Preserve the active canvas ID
    const canvasId = localStorage.getItem('aethelframe_activeCanvas') as CanvasId || 'home'
    
    set({
      isOvertureVisible: false,
      currentPhase: 'growth',
      activeCanvasId: canvasId
    })
  },
  
  // API actions
  fetchProjects: async (tech_stack, tag, category, page = 1) => {
    try {
      const response = await getPublishedProjects(tech_stack, tag, category, page)
      
      set({
        projects: response.results,
        projectsPagination: {
          currentPage: page,
          totalPages: Math.ceil(response.count / 6), // Assuming page size is 6
          totalItems: response.count,
          hasNext: response.next !== null,
          hasPrevious: response.previous !== null,
        }
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  },
  
  fetchJournalEntries: async (tag, page = 1) => {
    try {
      const response = await getPublishedJournalEntries(tag, page)
      
      set({
        journalEntries: response.results,
        journalPagination: {
          currentPage: page,
          totalPages: Math.ceil(response.count / 6), // Assuming page size is 6
          totalItems: response.count,
          hasNext: response.next !== null,
          hasPrevious: response.previous !== null,
        }
      })
    } catch (error) {
      console.error('Error fetching journal entries:', error)
    }
  },
  
  fetchServices: async () => {
    try {
      const services = await getPublishedServices()
      set({ services })
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  },
  
  // Filter actions
  setProjectTechFilter: (tech) => {
    set({ activeProjectTechFilter: tech })
    get().fetchProjects(tech, get().activeProjectTagFilter, get().activeProjectCategoryFilter)
  },
  
  setProjectTagFilter: (tag) => {
    set({ activeProjectTagFilter: tag })
    get().fetchProjects(get().activeProjectTechFilter, tag, get().activeProjectCategoryFilter)
  },

  setProjectCategoryFilter: (category) => {
    set({ activeProjectCategoryFilter: category })
    get().fetchProjects(get().activeProjectTechFilter, get().activeProjectTagFilter, category)
  },
  
  setJournalTagFilter: (tag) => {
    set({ activeJournalTagFilter: tag })
    get().fetchJournalEntries(tag)
  },
}))