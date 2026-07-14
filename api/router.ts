import { authRouter } from "./auth-router";
import { profileRouter } from "./profile-router";
import { arbitrageRouter } from "./arbitrage-router";
import { portfolioRouter } from "./portfolio-router";
import { outreachRouter } from "./outreach-router";
import { executionRouter } from "./execution-router";
import { incomeRouter } from "./income-router";
import { scraperRouter } from "./scraper-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  profile: profileRouter,
  arbitrage: arbitrageRouter,
  portfolio: portfolioRouter,
  outreach: outreachRouter,
  execution: executionRouter,
  income: incomeRouter,
  scraper: scraperRouter,
});

export type AppRouter = typeof appRouter;
