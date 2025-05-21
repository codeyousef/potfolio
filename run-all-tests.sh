#!/bin/sh

# This script runs the tests for both the frontend and backend

# Set environment variables for testing
export TEST_MODE=true

# Function to check exit status
check_status() {
  if [ $? -eq 0 ]; then
    echo "$1 tests passed!"
  else
    echo "$1 tests failed!"
    exit 1
  fi
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -U ${POSTGRES_USER:-postgres} -d test_portfolio; do
  echo "PostgreSQL is not ready yet... waiting"
  sleep 2
done
echo "PostgreSQL is ready!"

# Run backend tests
echo "Running backend tests..."
cd /app/backend
python manage.py test
check_status "Backend"

# Run frontend tests
echo "Running frontend tests..."
cd /app/frontend
npm test
check_status "Frontend"

echo "All tests passed!"
exit 0