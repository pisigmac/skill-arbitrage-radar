# Codebase Map

```
/
├── api/                          # Backend
│   ├── boot.ts                   # Hono server entry
│   ├── router.ts                 # tRPC router registry
│   ├── middleware.ts             # Auth middleware (publicQuery, authedQuery, adminQuery)
│   ├── context.ts                # tRPC context builder
│   ├── auth-router.ts            # Auth endpoints
│   ├── profile-router.ts         # User profile CRUD
│   ├── arbitrage-router.ts       # Arbitrage engine + recommendations
│   ├── portfolio-router.ts       # Portfolio project generation
│   ├── outreach-router.ts        # Outreach templates
│   ├── execution-router.ts       # Kanban task management
│   ├── income-router.ts          # Income tracking
│   ├── scraper-router.ts         # Scraper admin
│   ├── queries/connection.ts     # Drizzle DB connection
│   ├── kimi/                     # Kimi OAuth SDK
│   └── lib/                      # Utilities
├── db/
│   ├── schema.ts                 # All 11 table definitions
│   └── relations.ts              # Drizzle relations
├── contracts/                    # Shared types
├── src/
│   ├── main.tsx                  # Entry point (TRPCProvider)
│   ├── App.tsx                   # Routes
│   ├── components/
│   │   ├── layout.tsx            # Nav + page shell
│   │   └── ui/                   # shadcn/ui components
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Dashboard.tsx         # Arbitrage opportunities grid
│   │   ├── OpportunityDetail.tsx # Detail + portfolio + outreach
│   │   ├── ExecutionBoard.tsx    # Kanban board
│   │   ├── IncomeTracker.tsx     # Income logging + charts
│   │   ├── ProfilePage.tsx       # Skill profile editor
│   │   ├── Login.tsx             # Auth page
│   │   └── NotFound.tsx          # 404
│   ├── hooks/useAuth.ts          # Auth hook
│   └── providers/trpc.tsx        # tRPC client setup
├── docs/                         # 20 documentation files
├── ops/                          # 10 operations configs
├── docker-compose.yml            # Infrastructure stack
└── Dockerfile                    # Production image
```
