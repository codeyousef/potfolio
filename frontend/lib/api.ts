import axios from 'axios';

// Temporarily hardcoded to fix directus issue
const API_URL = 'http://localhost:8001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Types matching Django models
export interface FileData {
  id: number;
  title: string;
  file: string;
  width?: number;
  height?: number;
  filesize?: number;
  mime_type?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description_html?: string;
  status: 'draft' | 'published' | 'archived';
  main_image?: FileData;
  gallery_images?: FileData[];
  category?: string;
  year?: string;
  tech_stack: string[];
  tags: string[];
  live_url?: string;
  repo_url?: string;
  sort: number;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: number;
  title: string;
  title_ar?: string;
  slug: string;
  excerpt: string;
  excerpt_ar?: string;
  content_rich_text?: string;
  content_rich_text_ar?: string;
  status: 'draft' | 'published' | 'archived';
  publication_date: string;
  featured_image?: FileData;
  tags: string[];
  tags_ar?: string[];
  language: 'en' | 'ar' | 'both';
}

export interface Service {
  id: number;
  title: string;
  title_ar?: string;
  slug: string;
  description_rich_text: string;
  description_rich_text_ar?: string;
  icon_svg?: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: FileData;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token } = response.data.data;
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
    
    return response.data.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data.data;
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
};

// Projects API
export const projectsAPI = {
  getPublished: async (params?: {
    tech_stack?: string;
    tag?: string;
    category?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Project>>('/projects/published/', {
      params: {
        page_size: 6,
        ...params
      }
    });
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get<Project>('/projects/by_slug/', {
      params: { slug }
    });
    return response.data;
  }
};

// Journal API
export const journalAPI = {
  getPublished: async (params?: {
    tag?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get<PaginatedResponse<JournalEntry>>('/journal-entries/published/', {
      params: {
        page_size: 6,
        ...params
      }
    });
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get<JournalEntry>('/journal-entries/by_slug/', {
      params: { slug }
    });
    return response.data;
  }
};

// Services API
export const servicesAPI = {
  getPublished: async () => {
    const response = await api.get<Service[]>('/services/published/');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get<Service>('/services/by_slug/', {
      params: { slug }
    });
    return response.data;
  }
};

// Helper function to build full media URL
export const getMediaUrl = (path: string | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Temporarily hardcoded to fix directus issue
  const baseUrl = 'http://localhost:8001';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Contact form submission (if needed)
export const submitContactForm = async (data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
}) => {
  // Note: You'll need to add this endpoint to Django if it doesn't exist
  const response = await api.post('/contact/', data);
  return response.data;
};

export default api;