FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies using npm
# Copy package.json and lock file (if it exists)
COPY package.json package-lock.json* ./

# Use npm ci for reliable installs if lock file exists, otherwise npm install
RUN npm ci || npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set the proper environment variable for building
ENV NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
# Ensure a clean build cache
RUN rm -rf .next
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Change ownership of the app directory *before* switching user
RUN chown -R nextjs:nodejs /app
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Start the Next.js application using Node from the standalone output
CMD ["node", ".next/standalone/server.js"]
