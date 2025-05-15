import { createDirectus, rest, readItems } from '@directus/sdk';

// Ensure your .env.local (or .env) in the frontend directory has NEXT_PUBLIC_API_URL
const directusUrl = process.env.NEXT_PUBLIC_API_URL;

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined. Please set it in your .env file.');
}

// Initialize the Directus client
// We use <any> here as a quick start. In a real app, you'd define your schema types.
// For public data, you typically don't need to authenticate.
// If you need to perform actions requiring auth (like creating items from an API route),
// you might initialize another client instance there with an API token or use staticToken().
const directus = createDirectus<any>(directusUrl).with(rest());

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
