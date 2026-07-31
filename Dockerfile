# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

ARG SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV SUPABASE_PUBLISHABLE_KEY=$SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

# Runs Vite/TanStack preview server bound to all network interfaces
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]