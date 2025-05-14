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
# Inherit from frontend-deps (which uses bun-base and runs bun install)
FROM frontend-deps AS frontend-dev
# WORKDIR is already /app/frontend from frontend-deps
ENV NODE_ENV=development
EXPOSE 3000
# Source code will be mounted from the host. node_modules are already installed by frontend-deps.
CMD ["bun", "run", "dev"]

# ---- Frontend Runner Stage ----
FROM node-base AS frontend-runner
WORKDIR /app

# Create a non-root user for production
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser && \
    adduser appuser appgroup

# Set environment to production for Next.js
ENV NODE_ENV=production

# Copy Next.js build artifacts from frontend-builder
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/package.json ./frontend/package.json

# Install production dependencies using npm (as Next.js typically runs with Node)
# Alternatively, if your start script uses bun, you might copy node_modules from frontend-builder
# or run bun install --production here. For now, assuming npm for 'next start'.
USER root
RUN cd ./frontend && npm install --omit=dev

# Change ownership of the frontend directory to appuser after npm install
RUN chown -R appuser:appgroup ./frontend

USER appuser
WORKDIR /app/frontend

EXPOSE 3000

# HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 CMD curl -f http://localhost:3000/api/health || exit 1
# Add a healthcheck if your Next.js app has a health endpoint e.g. /api/health

# Start Next.js application
# Ensure your package.json has a "start": "next start" script
CMD ["npm", "run", "start"]
