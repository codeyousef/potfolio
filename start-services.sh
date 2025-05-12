#!/bin/sh

# Start PostgreSQL service if needed (default is using external PostgreSQL)
if [ "$USE_INTERNAL_POSTGRES" = "true" ]; then
  echo "Starting PostgreSQL service..."
  # Initialize PostgreSQL if not already initialized
  if [ ! -d "/var/lib/postgresql/data/base" ]; then
    echo "Initializing PostgreSQL data directory..."
    mkdir -p /var/lib/postgresql/data
    chown -R postgres:postgres /var/lib/postgresql/data
    chmod 700 /var/lib/postgresql/data
    su postgres -c "initdb -D /var/lib/postgresql/data"
    
    # Configure PostgreSQL to allow connections
    echo "Configuring PostgreSQL..."
    su postgres -c "pg_ctl -D /var/lib/postgresql/data start"
    su postgres -c "psql -c \"CREATE USER \$DATABASE_USERNAME WITH PASSWORD '\$DATABASE_PASSWORD';\""
    su postgres -c "psql -c \"CREATE DATABASE \$DATABASE_NAME WITH OWNER \$DATABASE_USERNAME;\""
    su postgres -c "pg_ctl -D /var/lib/postgresql/data stop"
  fi
  
  # Start PostgreSQL server
  su postgres -c "pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start"
  
  # Wait for PostgreSQL to start
  echo "Waiting for PostgreSQL to start..."
  sleep 5
fi

# Generate Strapi app keys if not already set
if [ -z "$APP_KEYS" ]; then
  echo "Generating random APP_KEYS for Strapi..."
  export APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)
fi

if [ -z "$API_TOKEN_SALT" ]; then
  echo "Generating random API_TOKEN_SALT for Strapi..."
  export API_TOKEN_SALT=$(openssl rand -base64 32)
fi

# Start Strapi in the background
echo "Starting Strapi backend..."
cd /app/backend
npm run start &

# Wait for Strapi to be available
echo "Waiting for Strapi to be available..."
sleep 10

# Start Next.js frontend
echo "Starting Next.js frontend..."
cd /app/frontend
npm run start
