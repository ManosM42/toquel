# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# Accept build-time environment variables for Supabase/Vite
ARG SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV SUPABASE_PUBLISHABLE_KEY=$SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

COPY package*.json ./
# Uses npm install to avoid lockfile mismatch errors during build
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Copy built Nitro standalone server output
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]