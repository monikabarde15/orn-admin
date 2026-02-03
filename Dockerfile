# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source + env (env is build-time for React)
COPY . .

# Build static files
RUN npm run build


# ---------- Runtime stage ----------
FROM node:22-alpine

WORKDIR /app

# Only copy built assets
COPY --from=builder /app/build ./build

# Install static server
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
