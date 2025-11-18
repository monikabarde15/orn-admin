# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Production dependencies only (smaller & safer)
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build-time API URL
ARG VITE_API_URL=https://backend.onrequestlab.com
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]