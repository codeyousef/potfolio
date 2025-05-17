#!/bin/sh

# This script starts the services defined in docker-compose.yml
# It can be used for local development or in a containerized environment

# Check if Docker is installed
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Please install Docker and Docker Compose."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose >/dev/null 2>&1; then
  echo "Docker Compose is not installed. Please install Docker Compose."
  exit 1
fi

# Function to check if a container is running
check_container() {
  docker ps --filter "name=$1" --format "{{.Names}}" | grep -q "$1"
}

# Start services with Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
  echo "PostgreSQL is not ready yet... waiting"
  sleep 2
done
echo "PostgreSQL is ready!"

# Wait for Directus to be ready
echo "Waiting for Directus to be ready..."
until $(curl --output /dev/null --silent --head --fail http://localhost:8055); do
  echo "Directus is not ready yet... waiting"
  sleep 5
done
echo "Directus is ready!"

# Check if frontend is running
if check_container "portfolio-frontend"; then
  echo "Frontend is running at http://localhost:8080"
else
  echo "Frontend container failed to start. Check logs with: docker-compose logs frontend"
  exit 1
fi

echo "All services are up and running!"
echo "- Directus admin: http://localhost:8055/admin"
echo "- Frontend: http://localhost:8080"

# Show logs for all services
echo "Showing logs for all services. Press Ctrl+C to exit."
docker-compose logs -f
