# Use official Node image (LTS)
FROM node:bullseye-slim

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Install common tools you might want
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    vim \
    tree \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Enable corepack (for pnpm/yarn) – already enabled in postCreateCommand
# Switch to node user (already set by base image)

WORKDIR /app

# Expose common ports
EXPOSE 3000 5173

# Health check (optional)
#HEALTHCHECK CMD curl --fail http://localhost:5173 || exit 1