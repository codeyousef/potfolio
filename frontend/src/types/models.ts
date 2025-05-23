// Project model types
export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  long_description_html: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  main_image: File | null;
  gallery_images: File[];
  category: string | null;
  year: string | null;
  tech_stack: string[] | null;
  tags: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  sort: number;
}

// Journal entry model types
export interface JournalEntry {
  id: number;
  title: string;
  title_ar?: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_ar?: string | null;
  content_rich_text: string | null;
  content_rich_text_ar?: string | null;
  status: 'draft' | 'published' | 'archived';
  publication_date: string | null;
  created_at: string;
  updated_at: string;
  featured_image: File | null;
  tags: string[] | null;
  tags_ar?: string[] | null;
  language: 'en' | 'ar';
  sort: number;
}

// Service model types
export interface Service {
  id: number;
  title: string;
  title_ar?: string | null;
  slug: string;
  description_rich_text: string | null;
  description_rich_text_ar?: string | null;
  icon_svg: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  featured_image: File | null;
  sort: number;
}

// File model types
export interface File {
  id: number;
  title: string | null;
  description: string | null;
  file: string;
  filename_disk: string | null;
  width: number | null;
  height: number | null;
  filesize: number | null;
  mime_type: string | null;
}

// Pagination response type
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Pagination state type
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}