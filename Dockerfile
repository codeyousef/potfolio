# Multi-stage build for optimized production

# ---- Base Bun Image ----
FROM oven/bun:1 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps

# Frontend dependencies
WORKDIR /app/frontend
COPY frontend/package.json .
RUN if [ ! -f package.json ]; then echo "ERROR: Frontend package.json not found in /app/frontend after COPY!"; exit 1; fi
RUN bun install
RUN if [ ! -f bun.lockb ]; then echo "ERROR: Frontend bun.lockb not found in /app/frontend after bun install!"; ls -la; exit 1; else echo "Frontend bun.lockb found in /app/frontend."; fi
RUN echo "--- Contents of /app/frontend in deps stage after bun install: ---" && ls -la

# Backend dependencies
WORKDIR /app/backend
COPY backend/package.json .
RUN if [ ! -f package.json ]; then echo "ERROR: Backend package.json not found in /app/backend after COPY!"; exit 1; fi
RUN bun install
RUN if [ ! -f bun.lockb ]; then echo "ERROR: Backend bun.lockb not found in /app/backend after bun install!"; ls -la; exit 1; else echo "Backend bun.lockb found in /app/backend."; fi
RUN echo "--- Contents of /app/backend in deps stage after bun install: ---" && ls -la

# For debugging: List the full /app directory in deps stage at the end
WORKDIR /app
RUN echo "--- Full contents of /app in deps stage: ---" && ls -R /app

# ---- Backend Build (Strapi) ----
FROM base AS backend-builder
WORKDIR /app/backend
# Copy node_modules and bun.lockb (generated in deps stage) from deps stage
COPY --from=deps /app/backend/node_modules ./node_modules
COPY --from=deps /app/backend/bun.lockb ./
COPY backend/ .
# Set environment variables for backend build if necessary (e.g., for plugins)
# ENV NODE_ENV=production # Strapi typically builds for production by default
RUN bun run build

# ---- Frontend Build (Next.js) ----
FROM base AS frontend-builder
WORKDIR /app/frontend
# Copy node_modules and bun.lockb (generated in deps stage) from deps stage
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY --from=deps /app/frontend/bun.lockb ./
COPY frontend/ .
# Set environment variables for frontend build
ENV NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
ENV NODE_ENV=production
RUN bun run build

# ---- Production Runner ----
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Install PostgreSQL client for Alpine, and curl if needed by start script
RUN apk add --no-cache postgresql-client curl

# Create a non-root user for security
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser && \
    adduser appuser appgroup

# Copy built Strapi backend
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/package.json ./backend/package.json
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/bun.lockb ./backend/bun.lockb
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/node_modules ./backend/node_modules
# If Strapi has a specific production start command in package.json, ensure it's used.
# COPY --from=backend-builder /app/backend/config ./backend/config # If you have separate config files
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/.env.example ./backend/.env.example # Or copy .env if not sensitive

# Copy Next.js standalone build output
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/public ./frontend/public

# Copy start script
COPY ./start-services.sh /app/start-services.sh
RUN chmod +x /app/start-services.sh

USER appuser

# Expose ports - 3000 for Next.js and 1337 for Strapi
EXPOSE 3000
EXPOSE 1337
# EXPOSE 5432 # This is for Postgres, not the app container

# Set environment variables for Strapi (can also be set in docker-compose.yml)
ENV HOST=0.0.0.0
ENV PORT=1337
ENV NODE_ENV=production
# For Next.js, PORT is usually 3000 by default if run via `node server.js` in standalone
ENV NEXT_PORT=3000

# Start both services using the script
CMD ["/app/start-services.sh"]
