import { createDirectus, rest, staticToken, authentication } from '@directus/sdk';

// Use the Vite environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_STATIC_TOKEN || '';

// Determine if we're in development mode
const isDev = import.meta.env.DEV;

// Define your schema based on your Directus collections
export type MyCollections = {
  projects: any[];
  journal_entries: any[];
  services: any[];
  conversion_actions: any[];
  directus_users: UsersItem[];
  settings: SettingsItem[];
};

type SettingsItem = {
  id: number;
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
};

type UsersItem = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar: string | null;
};

// Create a custom fetch function that handles credentials
const customFetch = async (path: string, options: any = {}) => {
  // In development, use relative URLs to go through the Vite proxy
  // In production, use the full API URL
  const baseUrl = isDev ? '' : API_URL;
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  
  const headers = new Headers(options.headers);
  
  // Set default headers
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Only add the static token if we're not using cookie auth
  if (DIRECTUS_TOKEN && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${DIRECTUS_TOKEN}`);
  }
  
  console.log(`Making request to: ${url}`, { 
    method: options.method || 'GET',
    headers: Object.fromEntries(headers.entries()) 
  });
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // This is crucial for sending cookies
      headers,
    });
    
    console.log(`Response from ${url}:`, response.status, response.statusText);
    
    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      console.error('Authentication failed - invalid or expired session');
      throw new Error('Not authenticated');
    }
    
    return response;
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
    throw error;
  }
};

// Create the Directus client with REST support and authentication
const directus = createDirectus<MyCollections>(API_URL)
  .with(authentication('json'))
  .with(rest({
    onRequest: async (options) => {
      const headers = new Headers(options?.headers || {});
      
      // Set required headers for CORS and authentication
      headers.set('Accept', 'application/json');
      if (!headers.has('Content-Type') && options?.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      
      // Add CORS headers
      if (typeof window !== 'undefined') {
        headers.set('Origin', window.location.origin);
      }
      
      // Ensure credentials are included with every request
      return {
        ...options,
        credentials: 'include',
        mode: 'cors',
        headers: Object.fromEntries(headers.entries()),
      };
    },
  }));

// Override the transport to ensure credentials are included
directus.transport = {
  ...directus.transport,
  get: async (url: string, options: any) => {
    const headers = new Headers(options?.headers);
    headers.set('Accept', 'application/json');
    
    return directus.transport.get(url, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: Object.fromEntries(headers.entries()),
    });
  },
  post: async (url: string, options: any) => {
    const headers = new Headers(options?.headers);
    headers.set('Accept', 'application/json');
    
    if (!headers.has('Content-Type') && options?.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    return directus.transport.post(url, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: Object.fromEntries(headers.entries()),
    });
  },
  patch: async (url: string, options: any) => {
    const headers = new Headers(options?.headers);
    headers.set('Accept', 'application/json');
    
    if (!headers.has('Content-Type') && options?.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    return directus.transport.patch(url, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: Object.fromEntries(headers.entries()),
    });
  },
  delete: async (url: string, options: any) => {
    const headers = new Headers(options?.headers);
    headers.set('Accept', 'application/json');
    
    return directus.transport.delete(url, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: Object.fromEntries(headers.entries()),
    });
  },
  request: async (options: any) => {
    try {
      const { path, ...rest } = options;
      const headers = new Headers(rest?.headers);
      headers.set('Accept', 'application/json');
      
      if (!headers.has('Content-Type') && rest?.body && !(rest.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      
      const response = await customFetch(path, {
        ...rest,
        credentials: 'include',
        mode: 'cors',
        headers: Object.fromEntries(headers.entries())
      });
      
      return response;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  },
};

// Set up auto-refresh for the token
directus.refreshSession = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
};

// Add custom methods to the Directus client
directus.getCurrentUser = async () => {
  try {
    console.log('Fetching current user...');
    
    // Get the token from local storage
    const token = localStorage.getItem('directus_token');
    
    if (!token) {
      console.error('No authentication token found');
      return null;
    }
    
    // Make a direct request to the users/me endpoint
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch user data:', response.status, response.statusText);
      return null;
    }
    
    const userData = await response.json();
    console.log('Current user data:', userData);
    
    if (!userData || !userData.data) {
      console.error('No user data returned from API');
      return null;
    }
    
    // The response is wrapped in a data object
    const user = userData.data;
    
    // Return the user data in a consistent format
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      avatar: user.avatar || null
    };
  } catch (error) {
    console.error('Error fetching current user:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
};

// Extend the Directus client type
declare module '@directus/sdk' {
  interface DirectusClient<Schema extends object> {
    getCurrentUser: () => Promise<UsersItem | null>;
    refresh: () => Promise<void>;
    token?: string;
    transport: {
      get: (url: string, options?: any) => Promise<any>;
      post: (url: string, options?: any) => Promise<any>;
      patch: (url: string, options?: any) => Promise<any>;
      delete: (url: string, options?: any) => Promise<any>;
      request: (options: any) => Promise<any>;
    };
  }
}

// Add a function to check if we're authenticated
async function ensureAuthenticated() {
  try {
    // If we already have a token, we're good
    if (directus.auth.token) {
      return true;
    }

    // Try to authenticate with static token if available
    if (process.env.DIRECTUS_STATIC_TOKEN) {
      await directus.auth.static(process.env.DIRECTUS_STATIC_TOKEN);
      console.log('Authenticated with static token');
      return true;
    }

    // If no static token is available, try to get the current user
    // This will trigger the authentication flow if needed
    await directus.getCurrentUser();
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
}

// Always use ESM exports
export { directus, ensureAuthenticated };
export default directus;
