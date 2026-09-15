# ==============================================================================
# Multi-Stage Production Dockerfile for Shine Peerpath
# ==============================================================================

# --- Stage 1: Build Frontend & Dependencies ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (clean install)
RUN npm ci

# Copy source code
COPY . .

# Build frontend static bundle to /app/dist
RUN npm run build

# --- Stage 2: Production Runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Copy package manifests & install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled frontend dist and backend source from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose backend service port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:5001/api/health || exit 1

# Start fullstack unified server
CMD ["npx", "tsx", "server/index.ts"]
