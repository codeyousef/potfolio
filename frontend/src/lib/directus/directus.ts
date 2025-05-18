// Import the directus client
import { directus as client } from './client';

// Re-export types and the client instance
export { client as directus };
export type { MyCollections } from './client';

// Export the client as default
export default client;
