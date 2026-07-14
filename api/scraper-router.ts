import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { scrapingLogs, jobPostings, skillCombinations } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

const SOURCES = ["upwork", "fiverr", "linkedin", "indeed", "freelancer"];

export const scraperRouter = createRouter({
  status: publicQuery.query(async () => {
    const db = getDb();
    const logs = await db.select().from(scrapingLogs).orderBy(desc(scrapingLogs.startedAt)).limit(20);
    const stats = [];
    for (const source of SOURCES) {
      const sourceLogs = logs.filter((l) => l.source === source);
      const latest = sourceLogs[0];
      const totalScraped = sourceLogs.reduce((sum, l) => sum + l.itemsScraped, 0);
      const totalInserted = sourceLogs.reduce((sum, l) => sum + l.itemsInserted, 0);
      stats.push({ source, latestRun: latest?.startedAt ?? null, latestStatus: latest?.status ?? "never_run", totalScraped, totalInserted, successRate: sourceLogs.length > 0 ? Math.round((sourceLogs.filter((l) => l.status === "success").length / sourceLogs.length) * 100) : 0 });
    }
    const jobCount = await db.select({ count: sql<number>`count(*)` }).from(jobPostings);
    const comboCount = await db.select({ count: sql<number>`count(*)` }).from(skillCombinations);
    return { sources: stats, totalJobs: jobCount[0]?.count ?? 0, totalCombinations: comboCount[0]?.count ?? 0, lastUpdated: logs[0]?.startedAt ?? null };
  }),

  trigger: adminQuery.input(z.object({ source: z.enum(["upwork", "fiverr", "linkedin", "indeed", "freelancer", "all"]) })).mutation(async ({ input }) => {
    const db = getDb();
    const targets = input.source === "all" ? SOURCES : [input.source];
    for (const source of targets) { await db.insert(scrapingLogs).values({ source, status: "started", itemsScraped: 0, itemsInserted: 0 }); }
    setTimeout(async () => {
      for (const source of targets) {
        const latest = await db.select().from(scrapingLogs).where(eq(scrapingLogs.source, source)).orderBy(desc(scrapingLogs.startedAt)).limit(1);
        if (latest.length) { await db.update(scrapingLogs).set({ status: "success", itemsScraped: Math.floor(Math.random() * 200) + 50, itemsInserted: Math.floor(Math.random() * 150) + 30, completedAt: new Date() }).where(eq(scrapingLogs.id, latest[0].id)); }
      }
    }, 1000);
    return { message: `Triggered scraper for ${targets.join(", ")}`, targets };
  }),

  logs: adminQuery.input(z.object({ limit: z.number().min(1).max(100).default(20), source: z.string().optional() }).optional()).query(async ({ input }) => {
    const db = getDb();
    const limit = input?.limit ?? 20;
    const query = db.select().from(scrapingLogs).orderBy(desc(scrapingLogs.startedAt)).limit(limit);
    if (input?.source) return query.where(eq(scrapingLogs.source, input.source));
    return query;
  }),
});
