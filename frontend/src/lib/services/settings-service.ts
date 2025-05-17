import { directus } from '@/lib/directus/directus';

export type Settings = {
  id?: number;
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
};

const DEFAULT_SETTINGS: Settings = {
  site_name: 'My Portfolio',
  site_description: 'A modern portfolio website',
  contact_email: 'contact@example.com',
  social_links: {
    twitter: '',
    github: '',
    linkedin: '',
  },
};

// Cache for settings
let cachedSettings: Settings | null = null;

export async function getSettings(): Promise<Settings> {
  try {
    console.log('getSettings called');
    
    // Return cached settings if available
    if (cachedSettings) {
      console.log('Returning cached settings');
      return cachedSettings;
    }

    console.log('Fetching settings from Directus...');
    
    // Fetch settings from Directus
    const response = await directus.items('settings').readByQuery({
      limit: 1,
    });

    console.log('Directus response:', response);

    if (response.data && response.data.length > 0) {
      console.log('Settings found in Directus:', response.data[0]);
      cachedSettings = response.data[0] as Settings;
    } else {
      console.log('No settings found, creating default settings...');
      // If no settings exist, create default settings
      try {
        const defaultSettings = await directus.items('settings').createOne(DEFAULT_SETTINGS);
        console.log('Default settings created:', defaultSettings);
        cachedSettings = defaultSettings as Settings;
      } catch (createError) {
        console.error('Error creating default settings:', createError);
        throw createError;
      }
    }

    return cachedSettings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error in getSettings:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  try {
    // Get current settings to ensure we have an ID
    const currentSettings = await getSettings();
    
    // Update settings in Directus
    const updatedSettings = await directus.items('settings').updateOne(
      currentSettings.id || 1, // Use ID if exists, otherwise default to 1
      settings
    );
    
    // Update cached settings
    cachedSettings = { ...currentSettings, ...updatedSettings };
    
    return cachedSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }
}

// Helper function to get a setting value with a default
export function getSetting<T>(settings: Settings, key: string, defaultValue: T): T {
  const value = key.split('.').reduce((obj, k) => {
    if (obj && typeof obj === 'object' && k in obj) {
      return (obj as any)[k];
    }
    return undefined;
  }, settings as any);
  
  return value !== undefined ? value : defaultValue;
}
