#!/bin/sh

# This script runs the tests for both the frontend and backend in Docker

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

# Start the test database
echo "Starting test database..."
docker-compose up -d postgres-test

# Wait for PostgreSQL test database to be ready
echo "Waiting for PostgreSQL test database to be ready..."
until docker-compose exec -T postgres-test pg_isready -U postgres -d test_portfolio; do
  echo "PostgreSQL test database is not ready yet... waiting"
  sleep 2
done
echo "PostgreSQL test database is ready!"

# Run backend tests
echo "Running backend tests..."
docker-compose up --build backend-test

# Check if backend tests passed
if [ $? -eq 0 ]; then
  echo "Backend tests passed!"
else
  echo "Backend tests failed!"
  exit 1
fi

# Run frontend tests
echo "Running frontend tests..."
docker-compose up --build frontend-test

# Check if frontend tests passed
if [ $? -eq 0 ]; then
  echo "Frontend tests passed!"
else
  echo "Frontend tests failed!"
  exit 1
fi

echo "All tests passed!"

# Clean up
echo "Cleaning up..."
docker-compose down -v postgres-test backend-test frontend-test

exit 0