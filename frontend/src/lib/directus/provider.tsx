'use client';

import { ReactNode, useEffect, useState } from 'react';
import { directus, ensureAuthenticated } from './client';

// Helper function to log detailed error information
function logError(context: string, error: any) {
  console.error(`[${context}] Error:`, {
    message: error?.message,
    status: error?.status,
    statusText: error?.statusText,
    response: error?.response?.data,
    stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
  });
}

interface DirectusProviderProps {
  children: ReactNode;
}

async function waitForDirectus() {
  const maxRetries = 30;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      // First try to ping the server
      await directus.server.ping();
      
      // Then try to authenticate
      if (!directus.auth.token) {
        console.log('No auth token found, trying to authenticate...');
        try {
          await directus.auth.static(process.env.DIRECTUS_STATIC_TOKEN || '');
          console.log('Successfully authenticated with static token');
        } catch (authError) {
          console.log('No static token available, continuing without authentication');
        }
      }
      
      return true;
    } catch (error) {
      console.log(`Waiting for Directus to be ready... (attempt ${retries + 1}/${maxRetries})`);
      retries++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error('Directus is not responding after multiple attempts');
}

async function checkAndInitializeCollection(collection: string, items: any[]) {
  try {
    console.log(`Checking if ${collection} collection is empty...`);
    
    // First, check if we can access the collection
    try {
      await directus.server.info();
    } catch (error) {
      console.log('Server info error, attempting to authenticate...');
      try {
        // Try to authenticate with static token if available
        if (process.env.DIRECTUS_STATIC_TOKEN) {
          await directus.auth.static(process.env.DIRECTUS_STATIC_TOKEN);
          console.log('Authenticated with static token');
        }
      } catch (authError) {
        logError('Authentication failed', authError);
      }
    }

    // Now try to check the collection
    const { data: existingItems } = await directus.request(
      directus.items(collection).readByQuery({
        limit: 1,
        fields: ['id']
      })
    ).catch(async (error) => {
      logError(`Failed to read ${collection} collection`, error);
      throw error;
    });

    if (!existingItems || existingItems.length === 0) {
      console.log(`Initializing ${collection} with ${items.length} items...`);
      
      // Create items one by one for better error handling
      for (const item of items) {
        try {
          await directus.request(
            directus.items(collection).createOne(item)
          );
          console.log(`Created item in ${collection}:`, item.name || item.title || 'Untitled');
        } catch (createError) {
          logError(`Failed to create item in ${collection}`, createError);
          throw createError;
        }
      }
      
      console.log(`Successfully initialized ${collection} with ${items.length} items`);
    } else {
      console.log(`${collection} collection already has data, skipping initialization`);
    }
  } catch (error) {
    logError(`Error in checkAndInitializeCollection for ${collection}`, error);
    throw error;
  }
}

async function initializeDirectusData() {
  try {
    console.log('Starting Directus data initialization...');

    // Wait for Directus to be ready
    await waitForDirectus();

    // Initialize services if empty
    await checkAndInitializeCollection('services', [
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
    ]);

    // Get service IDs for project relationships
    const { data: services } = await directus.request(
      directus.items('services').readByQuery({
        fields: ['id']
      })
    );

    if (services && services.length > 0) {
      // Initialize projects if empty
      await checkAndInitializeCollection('projects', [
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
          services: services.slice(0, 2).map((s: any) => s.id),
          status: 'published',
          date_started: new Date().toISOString().split('T')[0],
          featured: false
        }
      ]);
    }

    console.log('Directus data initialization completed');
  } catch (error) {
    console.error('Error during Directus data initialization:', error);
  }
}

export function DirectusProvider({ children }: DirectusProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Starting Directus initialization...');
        
        // Wait for Directus to be ready
        await waitForDirectus();
        
        // Ensure we're authenticated
        const isAuthenticated = await ensureAuthenticated();
        if (!isAuthenticated) {
          throw new Error('Failed to authenticate with Directus. Please check your credentials.');
        }
        
        // Now initialize the data
        console.log('Starting data initialization...');
        await initializeDirectusData();
        
        console.log('Directus initialization completed successfully');
        setInitialized(true);
      } catch (err) {
        const error = err instanceof Error 
          ? err 
          : new Error('Unknown error during Directus initialization');
        
        console.error('Failed to initialize Directus:', error);
        setError(error);
        setInitialized(true); // Still render children even if initialization fails
      }
    };

    initialize();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  // Show loading state
  if (!initialized) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2>Initializing Application...</h2>
        <p>Please wait while we set up your data.</p>
        <div style={{ marginTop: '1rem', color: '#666' }}>
          This may take a moment if this is the first time loading the application.
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#dc2626' }}>
        <h2>Initialization Error</h2>
        <p>Failed to initialize the application. Please check the console for details.</p>
        <div style={{ 
          margin: '1rem 0', 
          padding: '1rem', 
          backgroundColor: '#fef2f2', 
          borderRadius: '0.375rem',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {error.message}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
