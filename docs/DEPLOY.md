# Deployment Guide

## Docker Compose (Recommended)

```bash
docker-compose up -d
```

This starts MySQL, Redis, MinIO, and the app.

## Local Development

```bash
npm install
npm run db:push
npm run dev
```

## Production (K8s)

1. Build image: `docker build -t skill-arbitrage-radar .`
2. Push to registry
3. Apply K8s manifests (see `ops/k8s/`)
4. Configure ingress + TLS

## CI/CD Pipeline

GitHub Actions:
1. Lint + type check
2. Run tests
3. Build Docker image
4. Deploy to staging
5. Run smoke tests
6. Deploy to production

## Database Migrations

```bash
npm run db:generate   # Generate migration
npm run db:migrate    # Apply migration
```
