// Interface for a Directus file object (simplified)
export interface DirectusFile {
  id: string;
  title?: string;
  filename_disk?: string;
  // Add other relevant fields like width, height, description if needed
}

// Interface for a Directus project item
export interface DirectusProject {
  id: string;
  status: string; // e.g., 'published', 'draft'
  title: string;
  slug?: string;
  category?: string;
  year?: string;
  description?: string;
  main_image?: DirectusFile | string; // Can be a file object or just an ID
  tech_stack?: string[];
  tags?: string[];
  live_url?: string;
  repo_url?: string;
  long_description_html?: string; // For rich text content from Directus
  gallery_images?: { directus_files_id: DirectusFile | string }[]; // For a gallery relationship
  // any other fields from your Directus collection
}

// Interface for a Directus journal entry
export interface DirectusJournalEntry {
  id: string;
  status: string; // e.g., 'published', 'draft'
  title: string;
  slug: string; // For dynamic routing
  publication_date?: string; // ISO date string
  excerpt?: string; // A short summary
  content_rich_text?: string; // Main content, likely HTML from WYSIWYG
  featured_image?: DirectusFile | string; // Can be a file object or just an ID
  tags?: string[];
  // any other fields from your JournalEntries collection
}

// Interface for a Directus service item
export interface DirectusService {
  id: string;
  status: string; // e.g., 'published'
  title: string;
  slug: string; // For dynamic routing
  description_rich_text?: string; // Main content, likely HTML from WYSIWYG
  icon_svg?: string; // Field to store SVG content directly or an ID to an icon file
  featured_image?: DirectusFile | string; // Optional image for the service
  // any other fields from your Services collection
}

// Interface for paginated responses from the API
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
