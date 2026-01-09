# Multi-stage build for Next.js Static Site with Nginx
# This Dockerfile is optimized for Coolify deployment

# Stage 1: Build the static site
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source files
COPY . .

# Compile SCSS to CSS
RUN npm run sass:build

# Build the static site
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check - increased start period to allow nginx to fully start
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
