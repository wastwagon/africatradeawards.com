# Docker Setup Guide

This guide explains how to run the Africa Trade Awards website using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Development Mode (Recommended for local development)

Development mode includes hot reload and volume mounting for live code changes:

```bash
# Start development container
docker-compose -f docker-compose.dev.yml up --build

# Start in background (detached mode)
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

Access the application at: `http://localhost:3000`

### Production Mode

Production mode uses an optimized multi-stage build:

```bash
# Build and start production container
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Docker Commands Reference

### Build Images

```bash
# Build production image
docker build -t africa-trade-awards:latest .

# Build development image
docker build -f Dockerfile.dev -t africa-trade-awards:dev .
```

### Run Containers

```bash
# Run production container
docker run -p 3000:3000 africa-trade-awards:latest

# Run with custom port
docker run -p 8080:3000 africa-trade-awards:latest

# Run development container
docker run -p 3000:3000 -v $(pwd):/app africa-trade-awards:dev
```

### Container Management

```bash
# List running containers
docker ps

# View container logs
docker logs africa-trade-awards

# Stop container
docker stop africa-trade-awards

# Remove container
docker rm africa-trade-awards

# Remove image
docker rmi africa-trade-awards:latest
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use port 3001 on host
```

### Build Fails

1. Ensure Docker Desktop is running
2. Check disk space: `docker system df`
3. Clean up unused resources: `docker system prune -a`

### Container Won't Start

1. Check logs: `docker-compose logs`
2. Verify Dockerfile syntax
3. Ensure all dependencies are listed in `package.json`

### Permission Issues (Linux/Mac)

If you encounter permission issues:

```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Or run Docker commands with sudo (not recommended)
```

## Environment Variables

Currently, no environment variables are required. If you need to add them:

1. Create a `.env` file in the project root
2. Add variables to `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

Or use an `.env` file:

```yaml
env_file:
  - .env
```

## Performance Tips

1. **Use production build** for better performance
2. **Enable Docker BuildKit** for faster builds:
   ```bash
   export DOCKER_BUILDKIT=1
   docker-compose up --build
   ```
3. **Use volume caching** in development to speed up rebuilds

## Next Steps

- Review the main [README.md](./README.md) for project details
- Check `next.config.mjs` for Next.js configuration
- Customize Docker settings in `docker-compose.yml` as needed
