# Portfolio Backend

This is the Django backend for the Portfolio project. It replaces the previous Directus CMS with a Django REST framework API.

## Features

- Django 5.0 with Django REST framework
- PostgreSQL database
- Poetry for dependency management
- Docker support
- API endpoints for projects, journal entries, and services

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Poetry (optional for local development)

### Running with Docker

The easiest way to run the backend is using Docker Compose from the root directory:

```bash
docker-compose up
```

This will start the PostgreSQL database and the Django backend.

### Local Development

1. Install Poetry:
   ```bash
   pip install poetry
   ```

2. Install dependencies:
   ```bash
   cd backend
   poetry install
   ```

3. Activate the virtual environment:
   ```bash
   poetry shell
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

- `/api/projects/` - List and create projects
- `/api/projects/published/` - List published projects
- `/api/projects/by_slug/?slug=<slug>` - Get a project by slug
- `/api/journal-entries/` - List and create journal entries
- `/api/journal-entries/published/` - List published journal entries
- `/api/journal-entries/by_slug/?slug=<slug>` - Get a journal entry by slug
- `/api/services/` - List and create services
- `/api/services/published/` - List published services
- `/api/files/` - List and upload files

## Admin Interface

The Django admin interface is available at `/admin/`. Use the superuser credentials to log in.

## Environment Variables

The following environment variables can be set in the `.env` file:

- `DJANGO_SECRET_KEY` - Secret key for Django
- `DJANGO_DEBUG` - Debug mode (True/False)
- `DJANGO_ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `POSTGRES_HOST` - PostgreSQL host
- `POSTGRES_PORT` - PostgreSQL port
- `POSTGRES_DB` - PostgreSQL database name
- `POSTGRES_USER` - PostgreSQL username
- `POSTGRES_PASSWORD` - PostgreSQL password
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins