# Multi-stage build for optimized production

# ---- Base Node/npm Image ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
# Install system dependencies
RUN apk add --no-cache libc6-compat
# Copy package.json files for both frontend and backend
COPY frontend/package.json frontend/
COPY backend/package.json backend/
# Install dependencies for both frontend and backend
RUN cd frontend && npm install --frozen-lockfile
RUN cd backend && npm install --frozen-lockfile

# ---- Backend Build ----
FROM base AS backend-builder
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/ .
RUN npm run build

# ---- Frontend Build ----
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY frontend/ .
# Set environment variables for frontend build
ENV NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
RUN npm run build

# ---- Production Runtime ----
FROM base AS runner
# Install PostgreSQL client and required dependencies for Strapi and database connection
RUN apk add --no-cache postgresql-client

# Create Strapi user for better security
RUN addgroup --system --gid 1001 strapigroup && \
    adduser --system --uid 1001 strapiuser && \
    adduser strapiuser strapigroup

# Copy built artifacts to production environment
WORKDIR /app

# Copy Strapi backend
COPY --from=backend-builder --chown=strapiuser:strapigroup /app/backend ./backend
# Copy Next.js frontend static build
COPY --from=frontend-builder --chown=strapiuser:strapigroup /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder --chown=strapiuser:strapigroup /app/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=strapiuser:strapigroup /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-builder --chown=strapiuser:strapigroup /app/frontend/node_modules ./frontend/node_modules

# Copy start script
COPY ./start-services.sh /app/start-services.sh
RUN chmod +x /app/start-services.sh

# Expose ports - 3000 for Next.js and 1337 for Strapi
EXPOSE 3000
EXPOSE 1337
EXPOSE 5432

# Set environment variables for Strapi
ENV HOST=0.0.0.0
ENV PORT=1337
ENV DATABASE_CLIENT=postgres
ENV NODE_ENV=production

# Start both services - this will be replaced by a proper script
CMD ["/app/start-services.sh"]
