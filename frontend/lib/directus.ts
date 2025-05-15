import { createDirectus, rest, readItems, readItem, staticToken } from '@directus/sdk';
import type { DirectusProject, DirectusJournalEntry, DirectusService } from '@/components/canvases/ProjectSculpture'; // Assuming this path is correct

// Ensure your .env.local (or .env) in the frontend directory has NEXT_PUBLIC_API_URL
const directusUrl = process.env.NEXT_PUBLIC_API_URL;
const directusStaticToken = process.env.DIRECTUS_STATIC_TOKEN; // For operations requiring auth, if any from server

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined. Please set it in your .env file.');
}

// Initialize the Directus client
// For public data, no auth token is strictly needed if permissions are public.
// For server-side operations that might need more permissions, a static token can be used.
const directus = createDirectus<{
  projects: DirectusProject[]; // Define the Projects collection type
  journal_entries: DirectusJournalEntry[]; // Define the JournalEntries collection type
  services: DirectusService[]; // Define the Services collection type
  // Add other collection types here as needed
}>(directusUrl).with(rest());

// Client for operations that might require authentication (e.g., accessing drafts if needed from server-side)
// This is optional if all accessed data is public
const directusServer = directusStaticToken 
    ? createDirectus<{
        projects: DirectusProject[];
        journal_entries: DirectusJournalEntry[];
        services: DirectusService[];
      }>(directusUrl).with(rest()).with(staticToken(directusStaticToken))
    : directus;

/**
 * Fetches all projects with status 'published'.
 * @returns A promise that resolves to an array of DirectusProject objects.
 */
export async function getPublishedProjects(): Promise<DirectusProject[]> {
  try {
    const projects = await directus.request(
      readItems('projects', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: ['*', 'main_image.*'], // Fetch all fields from Projects and all fields from related main_image
        // Add other query parameters like sort if needed, e.g., sort: ['-date_created']
      })
    );
    return projects as DirectusProject[]; // Cast to DirectusProject[]
  } catch (error) {
    console.error('Error fetching published projects:', error);
    return [];
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
    const items = await directus.request(
      readItems('projects', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        fields: ['*', 'main_image.*', 'gallery_images.directus_files_id.*'], // Fetch all fields, related main_image, and gallery images
        limit: 1,
      })
    );

    if (items && items.length > 0) {
      return items[0] as DirectusProject;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches all journal entries with status 'published', sorted by publication_date descending.
 * @returns A promise that resolves to an array of DirectusJournalEntry objects.
 */
export async function getPublishedJournalEntries(): Promise<DirectusJournalEntry[]> {
  try {
    const entries = await directus.request(
      readItems('journal_entries', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: ['*', 'featured_image.*'], // Fetch all fields and related featured_image
        sort: ['-publication_date'], // Sort by newest first
      })
    );
    return entries as DirectusJournalEntry[];
  } catch (error) {
    console.error('Error fetching published journal entries:', error);
    return [];
  }
}

/**
 * Fetches a single published journal entry by its slug.
 * @param slug The slug of the journal entry.
 * @returns A promise that resolves to a DirectusJournalEntry object or null if not found.
 */
export async function getJournalEntryBySlug(slug: string): Promise<DirectusJournalEntry | null> {
  try {
    const items = await directus.request(
      readItems('journal_entries', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        fields: ['*', 'featured_image.*'], // Fetch all fields and related featured_image
        limit: 1,
      })
    );
    return items && items.length > 0 ? (items[0] as DirectusJournalEntry) : null;
  } catch (error) {
    console.error(`Error fetching journal entry by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches all services with status 'published', possibly sorted by a 'sort' field or title.
 * @returns A promise that resolves to an array of DirectusService objects.
 */
export async function getPublishedServices(): Promise<DirectusService[]> {
  try {
    const services = await directus.request(
      readItems('services', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: ['*','featured_image.*'], // Fetch all fields, including any related image data
        sort: ['sort'], // Assuming you have a 'sort' field in your Services collection
      })
    );
    return services as DirectusService[];
  } catch (error) {
    console.error('Error fetching published services:', error);
    return [];
  }
}

export default directus;

// Example of a typed function to fetch items (optional, but good practice)
// Replace 'your_collection_name' and the expected type with your actuals
/*
interface YourCollectionItem {
  id: string;
  title: string;
  // ... other fields
}

export async function getItemsFromCollection(collectionName: string) {
  try {
    const items = await directus.request(readItems(collectionName as any)); // Use 'as any' if types aren't fully set up
    return items as YourCollectionItem[];
  } catch (error) {
    console.error(`Error fetching items from ${collectionName}:`, error);
    return [];
  }
}
*/
