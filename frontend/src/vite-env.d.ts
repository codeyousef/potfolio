/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite environment variables
  readonly VITE_API_URL: string;
  readonly VITE_DIRECTUS_STATIC_TOKEN: string;
  
  // Next.js compatibility
  readonly NEXT_PUBLIC_API_URL: string;
  readonly DIRECTUS_STATIC_TOKEN: string;
  
  // Add other environment variables here as needed
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
