# 1. Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Set environment variables for Nitro/Nuxt host binding
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]