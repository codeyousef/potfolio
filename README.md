# Aethelframe Protocol Portfolio

This project implements the Aethelframe Protocol portfolio website with the "Emergence" theme as detailed in the design specification. The project uses a modern tech stack with Next.js for the frontend and Django for the backend, with PostgreSQL as the database.

## Project Structure

```
Portfolio/
├── frontend/              # Next.js frontend application
│   ├── app/               # Next.js app directory (App Router)
│   ├── components/        # React components
│   ├── lib/               # Utility functions and API clients
│   └── ...                # Other Next.js config files
│
├── backend/               # Django backend application
│   ├── config/            # Django configuration
│   ├── api/               # Django API views and serializers
│   ├── models/            # Django data models
│   └── ...                # Other Django files
│
├── docs/                  # Documentation including design specs
├── Dockerfile             # Combined Docker configuration
├── docker-compose.yml     # Docker Compose for local development
├── run-all-tests.sh       # Script to run all tests
└── init-multiple-dbs.sh   # Script to initialize multiple databases
```

## Technology Stack

- **Frontend**: Next.js with TypeScript, TailwindCSS
- **Backend**: Django (Python web framework)
- **Database**: PostgreSQL
- **Containerization**: Docker

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Docker Compose Setup

The project uses Docker Compose to manage services:

- **Main Services**: The postgres, backend, and frontend services start by default with `docker-compose up`
- **Test Service**: The tests service is only started when explicitly requested with `docker-compose --profile test up tests`

This setup allows you to easily start the development environment or run tests as needed.

### Local Development

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Portfolio
   ```

2. Install dependencies:
   ```
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `frontend` directory based on `.env.example`
   - Create a `.env` file in the `backend` directory based on `.env.example`

4. Start the development servers:

   **Using Docker Compose (recommended)**:
   ```
   # Start development environment
   docker-compose up

   # To build containers and run in detached mode
   docker-compose up --build -d
   ```

   **Running tests**:
   ```
   # Run all tests
   docker-compose --profile test up tests
   ```

   **Or start services individually**:
   ```
   # Start Django backend
   cd backend
   python manage.py runserver

   # Start Next.js frontend in another terminal
   cd frontend
   npm run dev
   ```

5. Access the applications:
   - Frontend: http://localhost:3000
   - Django Admin: http://localhost:8001/admin

## Testing

The project uses a consolidated testing approach with Docker Compose profiles:

### Running All Tests

To run all tests (backend and frontend):

```bash
docker-compose --profile test up tests
```

This command:
1. Starts the postgres service with both development and test databases
2. Runs the backend tests using Django's test framework
3. Runs the frontend tests using the configured test runner

### Test Database

The project uses a separate test database (`test_portfolio`) that is automatically created when the postgres service starts. This ensures that your development database remains untouched during testing.

## Building for Production

To build and run the application for production:

```
# Build the production images
docker build -t portfolio-backend ./backend --target production
docker build -t portfolio-frontend . --target production

# Run the containers
docker run -d -p 8001:8001 portfolio-backend
docker run -d -p 3000:3000 portfolio-frontend
```

## Content Management

The project uses Django Admin for content management:

1. Access the Django admin panel at http://localhost:8001/admin
2. Log in with the admin credentials (default: admin/admin)
3. Manage content through the admin interface
4. The frontend will automatically fetch and display this content via the API

## Design Implementation

The implementation follows the Aethelframe Protocol design specifications with focus on:

- The "Emergence" theme with its phases (Seed/Veil, Growth/Unfurling, Bloom/Horizon)
- High-fashion aesthetic with cyberpunk and old money influences
- Kinetic, ethereal, and minimalist interfaces
- Sophisticated typography and color scheme

## License

This project is proprietary and confidential.
