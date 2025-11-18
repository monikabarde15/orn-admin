FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install --omit=dev \
    && npm run build

EXPOSE 3000

CMD ["npx", "serve", "-s", "dist", "-l", "3000"]