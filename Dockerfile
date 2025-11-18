# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Production dependencies only (smaller & safer)
RUN npm install

# Copy source
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000
