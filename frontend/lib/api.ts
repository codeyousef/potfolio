import axios from 'axios';

const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const apiEndpoint = `${strapiBaseUrl}/api`;

export const getAPI = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions for Strapi API responses
export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
}

// Project type
export interface Project {
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  imageUrl?: string;
  galleryImages?: {
    data: {
      id: number;
      attributes: {
        url: string;
        width: number;
        height: number;
        alternativeText?: string;
      };
    }[];
  };
  liveUrl?: string;
  githubUrl?: string;
  client?: string;
  technologies: string[];
  projectDate?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: {
    data: {
      id: number;
      attributes: {
        name: string;
        slug: string;
      };
    }[];
  };
  services?: {
    data: {
      id: number;
      attributes: {
        title: string;
        slug: string;
      };
    }[];
  };
}

// Helper functions to fetch data from Strapi
export async function getProjects(params = {}) {
  try {
    const response = await getAPI.get<StrapiResponse<Project>>('/projects', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getProject(slug: string) {
  try {
    const response = await getAPI.get<StrapiSingleResponse<Project>>(`/projects/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
}
