# Skill Arbitrage Radar

A data-driven platform that identifies high-demand, low-supply skill combinations across freelance marketplaces and job boards.

## Quick Start

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or local development
npm install
npm run db:push
npm run dev
```

## Architecture

- **Frontend:** React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Hono + tRPC + Drizzle ORM + MySQL
- **Cache:** Redis 7
- **Storage:** MinIO (S3-compatible)
- **AI:** OpenAI GPT-4o, Claude 3.5 Sonnet (via API integration)

## Project Structure

```
├── api/                  # tRPC routers + Hono server
├── db/                   # Drizzle schema + migrations
├── contracts/            # Shared types
├── src/                  # React frontend
├── docs/                 # Documentation (20 files)
├── ops/                  # Operations configs (10 files)
├── docker-compose.yml    # Full infrastructure stack
└── Dockerfile            # Production build
```

## Features

1. **Skill Arbitrage Engine** - Ranked opportunities with demand/supply scores
2. **Live Market Data** - Scraping from Upwork, Fiverr, LinkedIn, Indeed
3. **Portfolio Generator** - Specific buildable projects per niche
4. **Client Outreach** - Cold email/LinkedIn templates with A/B testing
5. **Execution Kanban** - Task board with pre-populated Day 1-30 plans
6. **Income Tracker** - Log earnings and compare vs projections

## API Endpoints

All endpoints are tRPC procedures:
- `arbitrage.list` - List arbitrage opportunities
- `arbitrage.recommend` - Personalized recommendations
- `profile.get` / `profile.upsert` - User profile management
- `portfolio.getByCombination` - Portfolio projects
- `outreach.getByCombination` - Outreach templates
- `execution.list` / `execution.create` / `execution.updateStatus` - Kanban
- `income.list` / `income.create` / `income.summary` - Income tracking
- `scraper.status` - Scraper health dashboard

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `REDIS_URL` | Redis connection string |
| `MINIO_ENDPOINT` | MinIO endpoint |
| `VITE_APP_ID` | Kimi OAuth app ID |
| `APP_SECRET` | Server-side app secret |

## License

MIT
