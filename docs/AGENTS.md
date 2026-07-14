# Agent Roles & Protocols

## Router Pattern
Each feature area has its own tRPC router file:
- `api/arbitrage-router.ts` - Arbitrage scoring + recommendations
- `api/profile-router.ts` - User profile CRUD
- `api/portfolio-router.ts` - Portfolio project generation
- `api/outreach-router.ts` - Outreach templates
- `api/execution-router.ts` - Kanban task management
- `api/income-router.ts` - Income logging
- `api/scraper-router.ts` - Scraper status + admin

## Database Pattern
- All tables in `db/schema.ts`
- Relations in `db/relations.ts`
- Use `getDb()` from `api/queries/connection.ts`
- Prefer `db.select().from(table).where(...)` over `db.query`

## Frontend Pattern
- Pages in `src/pages/*.tsx`
- Shared layout in `src/components/layout.tsx`
- Use `trpc` hooks for all API calls
- Use shadcn/ui components from `@/components/ui/*`

## Testing Pattern
- Vitest for unit tests
- Place tests next to source files
