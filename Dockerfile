# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time env vars
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies (cached)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# 🔥 Fail fast if env is missing
RUN echo "VITE_API_URL=$VITE_API_URL" && \
    if [ -z "$VITE_API_URL" ]; then \
      echo "❌ VITE_API_URL is missing"; \
      exit 1; \
    fi

# Build Vite app
RUN npm run build


# ---------- Runtime stage ----------
FROM node:22-alpine

WORKDIR /app

# Copy built assets only
COPY --from=builder /app/build ./build

# Static file server
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
