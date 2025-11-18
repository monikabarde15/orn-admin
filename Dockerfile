# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy source
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000
