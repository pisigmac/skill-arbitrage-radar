# AI Assistant Context

## Project
Skill Arbitrage Radar - Full-stack web app with React frontend and tRPC backend.

## Stack
- React 19 + TypeScript + Tailwind CSS + shadcn/ui
- Hono + tRPC + Drizzle ORM + MySQL
- Redis + MinIO

## Key Patterns
- tRPC routers in `api/*-router.ts`, registered in `api/router.ts`
- Database schema in `db/schema.ts`, pushed via `npm run db:push`
- Frontend pages in `src/pages/*.tsx`, routes in `src/App.tsx`
- Use `trpc.*.useQuery()` / `useMutation()` for data fetching
- Auth via `useAuth()` hook, `authedQuery` for protected endpoints

## Commands
- `npm run dev` - Dev server
- `npm run build` - Production build
- `npm run db:push` - Sync schema
- `npm run check` - Type check

## When Modifying
1. Schema changes -> `db/schema.ts` -> `npm run db:push`
2. New API -> create router -> register in `api/router.ts`
3. New page -> create component -> add route in `App.tsx`
