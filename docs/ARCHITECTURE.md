# Architecture Deep Dive

## Data Flow

```
User Input (Skills)
  -> Profile Router -> MySQL (user_profiles)
  -> Arbitrage Router
    -> Fetch skill combinations from MySQL
    -> Calculate match scores
    -> Generate LLM rationale
    -> Store recommendations in MySQL
    -> Return ranked list
  -> User selects opportunity
    -> Portfolio Router -> Return project spec
    -> Outreach Router -> Return templates
    -> Execution Router -> Init default tasks
  -> User logs income
    -> Income Router -> MySQL (income_logs)
    -> Update summary stats
```

## Services

### Arbitrage Engine
- Computes arbitrage score: `(demand * 0.6) + ((100 - supply) * 0.4)`
- Match score based on user's skills vs combination
- Rationale generation via template (LLM-ready)

### Scraper Service (planned)
- Celery + Redis for background jobs
- Playwright for JS-rendered sites
- Scrapy for API endpoints
- Proxy rotation via Bright Data
- Data normalization pipeline

### Portfolio Generator
- Template-based with dynamic fallback
- Tech stack, acceptance criteria, hour estimates
- Ready for LLM integration

### Outreach Generator
- Channel-specific templates (email, LinkedIn, Upwork)
- A/B variant support
- Open/response rate tracking

## Failure Modes
1. **Scraper blocked** -> Proxy rotation + retry with backoff
2. **DB connection lost** -> Connection pooling + reconnect
3. **Auth failure** -> Graceful degradation to public data
4. **Rate limiting** -> Redis-based rate limiter

## Scaling
- Horizontal scaling via K8s
- Read replicas for arbitrage queries
- Redis caching for hot data
- CDN for static assets
