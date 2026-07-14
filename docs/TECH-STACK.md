# Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend | React 19 + TypeScript | Component model, type safety |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, accessible components |
| Backend | Hono + tRPC | Type-safe APIs, minimal overhead |
| Database | MySQL (TiDB) | JSON support, full-text search |
| ORM | Drizzle | Type-safe, SQL-like syntax |
| Cache | Redis 7 | Rate limiting, sessions, hot data |
| Storage | MinIO | S3-compatible, self-hostable |
| Auth | Kimi OAuth | Built-in MFA, session management |
| AI | OpenAI GPT-4o + Claude 3.5 | Fallback model, cost optimization |
| Deployment | Docker + Docker Compose | Local dev -> staging -> prod |
| Testing | Vitest + Playwright | Unit + E2E testing |

## Alternatives Considered
- **Next.js vs React + Vite**: Chose Vite for faster builds and simpler setup
- **PostgreSQL vs MySQL**: Chose MySQL for TiDB compatibility (distributed)
- **Prisma vs Drizzle**: Chose Drizzle for type safety and SQL-like API
- **Express vs Hono**: Chose Hono for Edge compatibility and performance
