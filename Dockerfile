FROM node:22-alpine

WORKDIR /app

# Copy only package files first (best practice)
COPY package*.json ./

RUN npm install                     

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install lightweight static server
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]