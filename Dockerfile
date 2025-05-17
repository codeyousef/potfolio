# ---- Base Stages ----
FROM node:20-alpine AS node-base
WORKDIR /app
# Minimal packages for node-base, curl can be removed if not strictly needed by frontend runtime
# RUN apk add --no-cache curl 

FROM oven/bun:1-alpine AS bun-base
WORKDIR /app

# ---- Frontend Dependencies ----
FROM bun-base AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package.json ./ 
# Ensure bun.lockb is copied if that's the lockfile name, or bun.lock* for flexibility
RUN bun install # Use --frozen-lockfile for reproducible builds

# ---- Frontend Builder ----
FROM bun-base AS frontend-builder
# Changed base to bun-base for consistency if bun is used for build
WORKDIR /app/frontend
COPY frontend/ . 
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
RUN bun run build

# ---- Frontend Development Stage ----
FROM oven/bun:1-alpine AS frontend-dev

# Install build dependencies
RUN apk add --no-cache \
    curl \
    git \
    python3 \
    make \
    g++ \
    shadow \
    && rm -rf /var/cache/apk/*

# Create app directory and set permissions
RUN mkdir -p /app/frontend/node_modules/.vite/deps_temp \
    && chown -R 1000:1000 /app \
    && chmod -R 777 /app/frontend/node_modules/.vite

# Set working directory
WORKDIR /app/frontend

# Set environment variables
ENV NODE_ENV=development
ENV PATH="/app/frontend/node_modules/.bin:$PATH"
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure Vite cache directory has correct permissions
RUN mkdir -p /app/frontend/node_modules/.vite/deps_temp \
    && chown -R 1000:1000 /app/frontend/node_modules/.vite \
    && chmod -R 777 /app/frontend/node_modules/.vite

# Copy package files first for better caching
COPY --chown=1000:1000 frontend/package.json frontend/bun.lockb* ./

# Switch to UID 1000
USER 1000

# Install dependencies
RUN bun install --frozen-lockfile --no-save || \
    (echo "Bun install failed, falling back to npm" && \
     rm -rf node_modules && \
     npm install --no-package-lock)

# Copy the rest of the application
COPY --chown=1000:1000 . .

# Ensure Vite cache directory has correct permissions
RUN mkdir -p /app/frontend/node_modules/.vite/deps_temp \
    && chown -R 1000:1000 /app/frontend/node_modules/.vite \
    && chmod -R 777 /app/frontend/node_modules/.vite

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1

# Set default command
CMD ["bun", "run", "dev"]

# ---- Frontend Runner Stage ----
FROM node-base AS frontend-runner
WORKDIR /app

# Create a non-root user for production
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser && \
    adduser appuser appgroup

# Set environment to production
ENV NODE_ENV=production

# Install serve for static file serving
RUN npm install -g serve

# Copy Vite build artifacts from frontend-builder
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/package.json ./frontend/package.json

# Change ownership of the frontend directory to appuser
RUN chown -R appuser:appgroup ./frontend

USER appuser
WORKDIR /app/frontend

EXPOSE 8080

# HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 CMD curl -f http://localhost:8080/ || exit 1
# Add a healthcheck if needed

# Serve the static Vite build
CMD ["serve", "-s", "dist", "-l", "8080"]
