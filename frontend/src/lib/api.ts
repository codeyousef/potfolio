import axios from 'axios'
import { Project, JournalEntry, Service, PaginatedResponse } from '@types/models'

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL

// Create an axios instance
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fetch published projects
export async function getPublishedProjects(
  tech_stack?: string, 
  tag?: string, 
  category?: string,
  page: number = 1
): Promise<PaginatedResponse<Project>> {
  try {
    let url = `/projects/published/?page=${page}`

    if (tech_stack) {
      url += `&tech_stack=${encodeURIComponent(tech_stack)}`
    }

    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`
    }

    if (category) {
      url += `&category=${encodeURIComponent(category)}`
    }

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching published projects:', error)
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    }
  }
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await api.get(`/projects/by_slug/?slug=${encodeURIComponent(slug)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}

// Fetch published journal entries
export async function getPublishedJournalEntries(
  tag?: string, 
  page: number = 1
): Promise<PaginatedResponse<JournalEntry>> {
  try {
    let url = `/journal-entries/published/?page=${page}`

    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`
    }

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching published journal entries:', error)
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    }
  }
}

// Fetch a single journal entry by slug
export async function getJournalEntryBySlug(slug: string): Promise<JournalEntry | null> {
  try {
    const response = await api.get(`/journal-entries/by_slug/?slug=${encodeURIComponent(slug)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching journal entry by slug:', error)
    return null
  }
}

// Fetch published services
export async function getPublishedServices(): Promise<Service[]> {
  try {
    const response = await api.get('/services/published/')
    return response.data
  } catch (error) {
    console.error('Error fetching published services:', error)
    return []
  }
}

// Fetch a single service by slug
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const response = await api.get(`/services/by_slug/?slug=${encodeURIComponent(slug)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching service by slug:', error)
    return null
  }
}

export default api
