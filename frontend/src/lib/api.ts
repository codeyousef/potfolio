import axios from 'axios';
import type { DirectusProject, DirectusJournalEntry, DirectusService, PaginatedResponse } from '../types/directus';

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL or NEXT_PUBLIC_API_URL is not defined. Please set it in your .env file.');
}

// Create an axios instance for the API
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches projects with status 'published', with optional filtering and pagination.
 * @param tech_stack Optional tech stack to filter projects by
 * @param tag Optional tag to filter projects by
 * @param page Optional page number for pagination (default: 1)
 * @returns A promise that resolves to a PaginatedResponse of DirectusProject objects.
 */
export async function getPublishedProjects(
  tech_stack?: string, 
  tag?: string, 
  page: number = 1
): Promise<PaginatedResponse<DirectusProject>> {
  try {
    let url = `/projects/published/?page=${page}`;

    if (tech_stack) {
      url += `&tech_stack=${encodeURIComponent(tech_stack)}`;
    }

    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }

    console.log('Fetching projects with URL:', url);
    console.log('Tech stack parameter:', tech_stack);
    console.log('Tag parameter:', tag);
    console.log('Page parameter:', page);

    const response = await api.get(url);
    console.log('Projects response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching published projects:', error);

    // Log more detailed error information if available
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Detailed error information:', error.response?.data);
    }

    // Return an empty paginated response to prevent UI from breaking
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  }
}

/**
 * Fetches a single project by its slug, ensuring it is published.
 * @param slug The slug of the project to fetch.
 * @returns A promise that resolves to a DirectusProject object or null if not found or not published.
 */
export async function getProjectBySlug(slug: string): Promise<DirectusProject | null> {
  if (!slug) return null;
  try {
    const response = await api.get(`/projects/by_slug/?slug=${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);

    // Log more detailed error information if available
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Detailed error information:', error.response?.data);
    }

    return null;
  }
}

/**
 * Fetches journal entries with status 'published', sorted by publication_date descending.
 * @param tag Optional tag to filter journal entries by
 * @param page Optional page number for pagination (default: 1)
 * @returns A promise that resolves to a PaginatedResponse of DirectusJournalEntry objects.
 */
export async function getPublishedJournalEntries(
  tag?: string, 
  page: number = 1
): Promise<PaginatedResponse<DirectusJournalEntry>> {
  try {
    let url = `/journal-entries/published/?page=${page}`;

    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }

    console.log('Fetching journal entries with URL:', url);
    console.log('Tag parameter:', tag);
    console.log('Page parameter:', page);

    const response = await api.get(url);
    console.log('Journal entries response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching published journal entries:', error);

    // Log more detailed error information if available
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Detailed error information:', error.response?.data);
    }

    // Return an empty paginated response to prevent UI from breaking
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  }
}

/**
 * Fetches a single published journal entry by its slug.
 * @param slug The slug of the journal entry.
 * @returns A promise that resolves to a DirectusJournalEntry object or null if not found.
 */
export async function getJournalEntryBySlug(slug: string): Promise<DirectusJournalEntry | null> {
  try {
    const response = await api.get(`/journal-entries/by_slug/?slug=${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching journal entry by slug ${slug}:`, error);

    // Log more detailed error information if available
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Detailed error information:', error.response?.data);
    }

    return null;
  }
}

/**
 * Fetches all services with status 'published', possibly sorted by a 'sort' field or title.
 * @returns A promise that resolves to an array of DirectusService objects.
 */
export async function getPublishedServices(): Promise<DirectusService[]> {
  try {
    const response = await api.get('/services/published/');
    return response.data;
  } catch (error) {
    console.error('Error fetching published services:', error);

    // Log more detailed error information if available
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Detailed error information:', error.response?.data);
    }

    // Still return an empty array to prevent UI from breaking
    return [];
  }
}

/**
 * Fetches a single service by its slug, ensuring it is published.
 * @param slug The slug of the service to fetch.
 * @returns A promise that resolves to a DirectusService object or null if not found or not published.
 */
export async function getServiceBySlug(slug: string): Promise<DirectusService | null> {
  try {
    const response = await api.get(`/services/by_slug/?slug=${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service by slug ${slug}:`, error);

    // Log more detailed error information if available
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Detailed error information:', error.response?.data);
    }

    return null;
  }
}

export default api;
