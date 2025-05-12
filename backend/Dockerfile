FROM node:18-alpine
# Installing OS dependencies needed for Strapi
RUN apk add --no-cache python3 make g++ build-base vips-dev

WORKDIR /app

# Copy package.json and install dependencies using npm
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy the rest of the Strapi application
COPY . .

# ENV variables (keep these)
ENV NODE_ENV=production
ENV DATABASE_CLIENT=postgres
ENV DATABASE_HOST=postgres
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=portfolio
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=postgres
ENV HOST=0.0.0.0
ENV PORT=1337
# Ensure these are passed from docker-compose via the .env file
# APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, JWT_SECRET

# Build admin panel using npm script
RUN npm run build

# Create the uploads directory needed by the local provider
RUN mkdir -p public/uploads

EXPOSE 1337

# Start command using npm
CMD ["npm", "run", "start"]
