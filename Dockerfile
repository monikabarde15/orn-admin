FROM node:22-alpine AS builder

ARG APP_DIR=app
WORKDIR /app

# Copy only package files from the real app folder
COPY ${APP_DIR}/package*.json ./

# Critical flags for admin templates
RUN npm install --legacy-peer-deps --no-audit --fund=false --loglevel=error

# Copy the actual source code
COPY ${APP_DIR}/ ./

# Build it
RUN npm run build

# Final stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist   # safety fallback

RUN npm install -g serve

EXPOSE 3000

CMD ["sh", "-c", "serve -s build -l 3000"]