# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# Accept build-time environment variables for Supabase/Vite
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

# Copy node_modules and built dist folder from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server/server.js"]