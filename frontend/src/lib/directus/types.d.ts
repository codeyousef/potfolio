import { DirectusClient } from '@directus/sdk';
import { MyCollections } from './client';

declare module '@directus/sdk' {
  interface DirectusClient<Schema extends object> {
    getCurrentUser: () => Promise<{
      id: string;
      email: string;
      first_name: string | null;
      last_name: string | null;
      avatar: string | null;
    }>;
  }
}
