import { readItems, createItems } from '@directus/sdk';
import { directus } from './client';

// Support for CommonJS
module.exports = {
  initializeDirectusData,
  initializeDirectus
};

interface CollectionCount {
  collection: string;
  count: number;
}

// Helper function to check if collection exists and is accessible
async function canAccessCollection(collection: string): Promise<boolean> {
  try {
    await directus.request(
      readItems(collection as any, {
        limit: 1,
        fields: ['id']
      })
    );
    return true;
  } catch (error) {
    console.error(`Cannot access collection ${collection}:`, error);
    return false;
  }
}

/**
 * Initialize placeholder data in Directus if collections are empty
 */
export async function initializeDirectusData() {
  try {
    console.log('Checking Directus collections for initialization...');
    
    console.log('Initializing Directus data...');
    
    // Check if we can access the collections
    const canAccessServices = await canAccessCollection('services');
    const canAccessProjects = await canAccessCollection('projects');
    
    if (!canAccessServices || !canAccessProjects) {
      console.warn('Cannot access required collections. Make sure you are authenticated and permissions are set correctly.');
      return;
    }
    
    // Check if collections are empty
    const collectionsToCheck = ['services', 'projects'] as const;

    // Get item counts for each collection
    const collectionCounts = await Promise.all(
      collectionsToCheck.map(async (collection) => {
        try {
          const items = await directus.request(
            readItems(collection as any, {
              limit: 1,
              fields: ['id']
            })
          );
          return { 
            collection, 
            count: Array.isArray(items) ? items.length : 0 
          };
        } catch (error) {
          console.error(`Error checking collection ${collection}:`, error);
          return { collection, count: 0 };
        }
      })
    );
    
    console.log('Collection counts:', collectionCounts);

    // Create placeholder services if empty
    if (collectionCounts.find(c => c.collection === 'services')?.count === 0) {
      console.log('Creating placeholder services...');
      await directus.request(
        createItems('services', [
          {
            name: 'Web Development',
            description: 'Custom web applications and websites',
            icon: 'code',
            sort: 1,
            status: 'published'
          },
          {
            name: 'Mobile Development',
            description: 'iOS and Android applications',
            icon: 'smartphone',
            sort: 2,
            status: 'published'
          },
          {
            name: 'UI/UX Design',
            description: 'User interface and experience design',
            icon: 'palette',
            sort: 3,
            status: 'published'
          }
        ])
      );
    }

    // Create placeholder projects if empty
    if (collectionCounts.find(c => c.collection === 'projects')?.count === 0) {
      console.log('Creating placeholder projects...');
      // Get the service IDs we just created
      const services = await directus.request(
        readItems('services', {
          fields: ['id']
        })
      ) as { id: number }[];

      if (services.length > 0) {
        await directus.request(
          createItems('projects', [
            {
              name: 'Portfolio Website',
              description: 'A modern portfolio website built with Next.js and Directus',
              services: [services[0].id],
              status: 'published',
              date_started: new Date().toISOString().split('T')[0],
              featured: true
            },
            {
              name: 'Mobile App',
              description: 'Cross-platform mobile application',
              services: [services[1].id, services[2].id],
              status: 'published',
              date_started: new Date().toISOString().split('T')[0],
              featured: false
            }
          ])
        );
      }
    }

    console.log('Directus data initialization completed');
  } catch (error) {
    console.error('Error initializing Directus data:', error);
  }
}

// Export a function to be called during app initialization
export async function initializeDirectus() {
  if (typeof window !== 'undefined') {
    // Only run on the client side
    await initializeDirectusData();
  }
}

// For direct script execution (e.g., in a migration or setup script)
if (typeof window === 'undefined' && require.main === module) {
  console.log('Running Directus initialization script...');
  initializeDirectusData()
    .then(() => {
      console.log('Initialization script completed');
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error('Initialization script failed:', error);
      process.exit(1);
    });
}
