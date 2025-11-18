# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy source
COPY . .

EXPOSE 3000
