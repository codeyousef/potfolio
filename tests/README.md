# Portfolio Project Testing Documentation

This document outlines the testing approach for the Portfolio project, including both frontend and backend tests.

## Overview

The Portfolio project includes comprehensive tests for both the frontend React application and the backend Django API. The tests are designed to ensure that all components and functionality work as expected.

## Frontend Tests

The frontend tests use the following technologies:

- **Vitest**: A Vite-native test runner that's fast and compatible with the Jest API
- **React Testing Library**: For testing React components in a user-centric way
- **MSW (Mock Service Worker)**: For mocking API requests

### Test Structure

The frontend tests are organized as follows:

1. **Component Tests**: Tests for individual React components
   - App.test.tsx: Tests the main App component and routing
   - Pages tests: Tests for page components (Index.test.tsx, etc.)
   - Component tests: Tests for smaller UI components

2. **Authentication Tests**: Tests for the authentication functionality
   - auth-context.test.tsx: Tests the authentication context provider

### Running Frontend Tests

To run the frontend tests locally:

```bash
cd frontend
npm test
```

To run the tests with coverage:

```bash
cd frontend
npm run test:coverage
```

## Backend Tests

The backend tests use Django's built-in testing framework and are organized as follows:

1. **Model Tests**: Tests for Django models
   - tests.py: Tests for File, Project, JournalEntry, and Service models

2. **API Tests**: Tests for Django REST Framework API endpoints
   - test_views.py: Tests for FileViewSet, ProjectViewSet, JournalEntryViewSet, and ServiceViewSet

### Running Backend Tests

To run the backend tests locally:

```bash
cd backend
python manage.py test
```

## Running Tests in Docker

The project includes Docker configuration for running tests in a containerized environment. This ensures that tests run in an environment that matches the production setup.

To run all tests in Docker:

```bash
./run-tests.sh
```

This script will:
1. Start a test database
2. Run the backend tests
3. Run the frontend tests
4. Clean up the test containers

## Continuous Integration

For CI/CD pipelines, the tests can be run using the same Docker configuration. The `run-tests.sh` script is designed to exit with a non-zero status code if any tests fail, making it suitable for CI environments.

## Test Coverage

The project aims for high test coverage, focusing on:

1. Core functionality
2. Edge cases
3. User interactions
4. API endpoints
5. Data models

## Maintaining Tests

When adding new features or modifying existing ones, follow these guidelines:

1. Write tests before or alongside the implementation
2. Ensure tests are isolated and don't depend on external state
3. Mock external dependencies
4. Keep tests focused on behavior, not implementation details
5. Update tests when the requirements change