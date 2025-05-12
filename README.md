# Aethelframe Protocol Portfolio

This project implements the Aethelframe Protocol portfolio website with the "Emergence" theme as detailed in the design specification. The project uses a modern tech stack with Next.js for the frontend and Strapi CMS for the backend, with PostgreSQL as the database.

## Project Structure

```
Portfolio/
├── frontend/              # Next.js frontend application
│   ├── app/               # Next.js app directory (App Router)
│   ├── components/        # React components
│   ├── lib/               # Utility functions and API clients
│   └── ...                # Other Next.js config files
│
├── backend/               # Strapi CMS backend
│   ├── config/            # Strapi configuration
│   ├── src/               # Strapi source code
│   └── ...                # Other Strapi files
│
├── docs/                  # Documentation including design specs
├── Dockerfile             # Combined Docker configuration
├── docker-compose.yml     # Docker Compose for local development
└── start-services.sh      # Script to start services in Docker
```

## Technology Stack

- **Frontend**: Next.js with TypeScript, TailwindCSS
- **CMS**: Strapi (headless CMS)
- **Database**: PostgreSQL
- **Containerization**: Docker

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

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
   docker-compose up
   ```

   **Or start services individually**:
   ```
   # Start Strapi backend
   cd backend
   npm run develop
   
   # Start Next.js frontend in another terminal
   cd frontend
   npm run dev
   ```

5. Access the applications:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin

## Building for Production

To build and run the application for production:

```
docker build -t portfolio .
docker run -p 3000:3000 -p 1337:1337 portfolio
```

## Content Management

After setting up Strapi:

1. Create an admin user when you first access the Strapi admin panel
2. Create content types based on the design requirements
3. Add content for projects, blog posts, services, etc.
4. The frontend will automatically fetch and display this content

## Design Implementation

The implementation follows the Aethelframe Protocol design specifications with focus on:

- The "Emergence" theme with its phases (Seed/Veil, Growth/Unfurling, Bloom/Horizon)
- High-fashion aesthetic with cyberpunk and old money influences
- Kinetic, ethereal, and minimalist interfaces
- Sophisticated typography and color scheme

## License

This project is proprietary and confidential.
