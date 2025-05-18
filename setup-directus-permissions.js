const { createDirectus, rest, staticToken } = require('@directus/sdk');

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'yousef.baitalmal@gmail.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'applejuice';

// Collections that should be publicly readable
const PUBLIC_COLLECTIONS = [
  'projects',
  'journal_entries',
  'services',
  'technologies',
  'media',
  'pages'
];

async function setupPermissions() {
  try {
    console.log('Connecting to Directus...');
    const adminClient = createDirectus(DIRECTUS_URL).with(rest());
    
    // Log in as admin
    await adminClient.auth.login({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    console.log('Logged in as admin');
    
    // Get the public role (ID is usually the same as the role name)
    const publicRole = await adminClient.request(
      new Request(`${DIRECTUS_URL}/roles?filter[name][_eq]=public`)
    );
    
    if (!publicRole.data || publicRole.data.length === 0) {
      throw new Error('Public role not found');
    }
    
    const publicRoleId = publicRole.data[0].id;
    console.log(`Found public role with ID: ${publicRoleId}`);
    
    // Set permissions for each public collection
    for (const collection of PUBLIC_COLLECTIONS) {
      console.log(`Setting up permissions for collection: ${collection}`);
      
      // Create read permission for the collection
      await adminClient.request(
        new Request(`${DIRECTUS_URL}/permissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminClient.auth.token}`
          },
          body: JSON.stringify({
            collection: collection,
            role: publicRoleId,
            action: 'read',
            permissions: {},
            fields: ['*'],
            validation: {},
            presets: null,
            policy: null
          })
        })
      );
      
      console.log(`Set read permission for collection: ${collection}`);
    }
    
    console.log('All permissions set up successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up permissions:', error);
    process.exit(1);
  }
}

setupPermissions();
