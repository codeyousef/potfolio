import 'dotenv/config';
import { directus } from '../frontend/src/lib/directus/client';
import { initializeDirectusData } from '../frontend/src/lib/directus/init-directus-data';

async function main() {
  try {
    console.log('Starting Directus initialization...');
    
    // Try to authenticate
    try {
      const user = await directus.getCurrentUser();
      console.log('Authenticated as:', user?.email);
    } catch (error) {
      console.error('Authentication failed. Please check your credentials and try again.');
      console.error(error);
      process.exit(1);
    }
    
    // Initialize the data
    await initializeDirectusData();
    
    console.log('Directus initialization completed successfully!');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error);
