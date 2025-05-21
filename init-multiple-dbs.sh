#!/bin/bash
set -e

# This script initializes multiple PostgreSQL databases
# It's used as a Docker entrypoint script for the postgres container

# Function to create a database if it doesn't exist
create_database() {
  local database=$1
  echo "Creating database '$database'"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $database;
    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

# Create each database from the comma-separated list
if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
  
  for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
    # Skip if it's the default database that's already created
    if [ "$db" != "$POSTGRES_DB" ]; then
      create_database $db
    fi
  done
  
  echo "Multiple databases created"
fi