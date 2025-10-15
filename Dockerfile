FROM node:20-bookworm-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p logs && chown -R node:node /app

USER node

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD ["node", "src/index.js"]
