# ---- Base Stage ----
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    python3 \
    make \
    g++

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install dependencies
WORKDIR /app/frontend
RUN npm install

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app

# Copy app files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
WORKDIR /app/frontend
RUN npm run build

# ---- Development Stage ----
FROM base AS development
WORKDIR /app/frontend

# Copy package files and install dev dependencies
COPY --from=deps /app/frontend/package.json /app/frontend/package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://directus:8055

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the development server
CMD ["npm", "run", "dev", "--", "--port", "3000"]

# ---- Production Stage ----
FROM base AS production
WORKDIR /app/frontend

# Copy built application from builder
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/package.json ./
COPY --from=builder /app/frontend/next.config.js ./

# Install production dependencies
RUN npm install --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the application port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
